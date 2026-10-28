#!/usr/bin/env node
/**
 * Métricas do Instagram (roda de hora em hora em .github/workflows/instagram.yml). Lê da API de
 * cada conta da agenda o perfil (seguidores, posts), os últimos posts com curtidas e comentários,
 * os insights de cada post (alcance, views, salvos, compartilhamentos), os stories das últimas
 * 24 h e o resumo da conta em 7 e 28 dias, e grava tudo em instagram/metricas.json. O calendário
 * de acompanhamento lê esse arquivo.
 *
 * Insights pedem a permissão instagram_business_manage_insights no token. Sem ela, cada parte
 * que falhar fica com o motivo em "erro" e o resto do arquivo sai normalmente.
 *
 * Também guarda um histórico diário de seguidores e posts (um ponto por dia, o último da rodada),
 * que a API não devolve para contas com menos de 100 seguidores.
 */
import fs from "node:fs";
import { tokenEnv } from "./publicar.mjs";

const AGENDA = process.env.AGENDA_ARQUIVO ?? "instagram/agenda.json";
const SAIDA = process.env.METRICAS_ARQUIVO ?? "instagram/metricas.json";
const PERFIS = "instagram/perfil";
const GRAPH = "https://graph.instagram.com/v23.0";
const MAX_POSTS = 50;
const DIAS_INSIGHTS = 90;
const DIAS_HISTORICO = 400;

const METRICAS = {
  FEED: "views,reach,saved,shares,total_interactions",
  REELS: "views,reach,saved,shares,total_interactions,ig_reels_avg_watch_time",
  STORY: "views,reach,replies,shares,total_interactions",
};

async function api(rota, params, token) {
  const url = new URL(GRAPH + rota);
  url.search = new URLSearchParams({ ...params, access_token: token }).toString();
  const resposta = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${resposta.status}`);
  return json;
}

/** Converte a resposta de /insights em {metrica: valor}. */
function valores(json) {
  const out = {};
  for (const m of json.data ?? []) out[m.name] = m.total_value?.value ?? m.values?.[0]?.value ?? null;
  return out;
}

// Números extras, que nem todo tipo de post ou versão da API aceita: pedidos à parte, um a um,
// para que a recusa de um não apague os outros.
const EXTRAS = {
  FEED: ["follows", "profile_visits", "likes", "comments"],
  REELS: ["likes", "comments", "ig_reels_video_view_total_time"],
  STORY: ["follows", "profile_visits", "navigation"],
};
const recusadas = new Set();
export const avisos = [];

/** Quebra (ex.: seguidores × não seguidores) de uma métrica, quando a API aceita. */
function quebra(json) {
  const out = {};
  for (const m of json.data ?? []) {
    for (const r of m.total_value?.breakdowns?.[0]?.results ?? []) out[`${m.name}:${r.dimension_values?.join("/")}`] = r.value;
  }
  return out;
}

async function insightsMidia(m, token) {
  const tipo = m.media_product_type === "REELS" ? "REELS" : m.media_product_type === "STORY" ? "STORY" : "FEED";
  const extras = EXTRAS[tipo].filter((x) => !recusadas.has(`${tipo}:${x}`));
  let insights;
  try {
    // Uma chamada só, no caso comum; se a API recusar alguma métrica, cai para uma a uma.
    insights = valores(await api(`/${m.id}/insights`, { metric: [METRICAS[tipo], ...extras].join(",") }, token));
  } catch {
    try {
      insights = valores(await api(`/${m.id}/insights`, { metric: METRICAS[tipo] }, token));
    } catch (error) {
      return { erroInsights: error.message };
    }
    for (const metrica of extras) {
      try {
        Object.assign(insights, valores(await api(`/${m.id}/insights`, { metric: metrica }, token)));
      } catch (error) {
        recusadas.add(`${tipo}:${metrica}`);
        avisos.push(`${tipo}:${metrica} recusada: ${error.message}`);
      }
    }
  }
  // Seguidores × não seguidores por post: a API recusa follow_type na mídia; só há o da conta.
  return { insights };
}

function resumoMidia(m) {
  return {
    id: m.id,
    tipo: m.media_type,
    produto: m.media_product_type,
    quando: m.timestamp,
    link: m.permalink,
    legenda: (m.caption ?? "").slice(0, 160),
    curtidas: m.like_count ?? null,
    comentarios: m.comments_count ?? null,
    itens: m.children?.data?.length ?? null,
    // Link temporário (expira em dias): o painel copia a imagem para ele na sincronização.
    imagem: m.thumbnail_url ?? (m.media_type === "VIDEO" ? null : m.media_url) ?? null,
  };
}

/**
 * Linha do tempo dos números de um post: o Instagram só dá o valor de agora, então cada coleta
 * acrescenta um ponto. De hora em hora nas primeiras 48 h (quando o post mais cresce), depois um
 * ponto por dia, até 60 dias.
 */
function serie(anterior = [], item) {
  if (!item.insights && item.curtidas == null) return anterior;
  const agora = Date.now();
  const ponto = {
    t: new Date(agora).toISOString().slice(0, 16) + "Z",
    views: item.insights?.views ?? null,
    reach: item.insights?.reach ?? null,
    curtidas: item.curtidas,
    comentarios: item.comentarios,
    saved: item.insights?.saved ?? null,
    shares: item.insights?.shares ?? null,
    total_interactions: item.insights?.total_interactions ?? null,
    follows: item.insights?.follows ?? null,
    profile_visits: item.insights?.profile_visits ?? null,
  };
  const idade = (t) => new Date(t) - new Date(item.quando);
  const pontos = [...anterior.filter((p) => p.t !== ponto.t), ponto]
    .filter((p) => agora - new Date(p.t) < 60 * 86400_000);
  // Depois de 48 h de vida do post, fica só o último ponto de cada dia.
  const porDia = new Map();
  const saida = [];
  for (const p of pontos) {
    if (idade(p.t) < 48 * 3600_000) saida.push(p);
    else porDia.set(p.t.slice(0, 10), p);
  }
  return [...saida, ...porDia.values()].sort((a, b) => a.t.localeCompare(b.t));
}

async function resumoConta(userId, token, dias) {
  const until = Math.floor(Date.now() / 1000);
  const since = until - dias * 86400;
  return valores(
    await api(`/${userId}/insights`, {
      metric: "reach,views,accounts_engaged,total_interactions,likes,comments,saves,shares,follows_and_unfollows,profile_links_taps",
      period: "day",
      metric_type: "total_value",
      since: String(since),
      until: String(until),
    }, token),
  );
}

async function coletar(conta, token, anterior) {
  const r = { coletadoEm: new Date().toISOString() };
  const perfil = await api("/me", { fields: "user_id,username,name,account_type,biography,website,profile_picture_url,followers_count,follows_count,media_count" }, token);
  // O link da foto do perfil expira em poucos dias: guarda uma cópia no repositório.
  const { profile_picture_url: foto, ...resto } = perfil;
  r.perfil = resto;
  if (foto) {
    try {
      const resposta = await fetch(foto, { signal: AbortSignal.timeout(30_000) });
      if (resposta.ok) {
        fs.mkdirSync(PERFIS, { recursive: true });
        fs.writeFileSync(`${PERFIS}/${conta}.jpg`, Buffer.from(await resposta.arrayBuffer()));
        r.perfil.foto = `perfil/${conta}.jpg`;
      }
    } catch (error) {
      console.log(`${conta}: não baixei a foto do perfil (${error.message})`);
    }
  }

  const { data: midia = [] } = await api("/me/media", {
    fields: "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,media_url,thumbnail_url,children{id}",
    limit: String(MAX_POSTS),
  }, token);
  const limite = Date.now() - DIAS_INSIGHTS * 86400_000;
  r.posts = [];
  for (const m of midia) {
    const item = resumoMidia(m);
    item.quando = m.timestamp;
    // Posts de até 30 dias: toda hora. Mais velhos (até 90 dias): uma vez por dia, de madrugada,
    // para não gastar a cota de chamadas da API com números que quase não mudam.
    const antes = anterior?.posts?.find((p) => p.id === m.id);
    const recente = Date.now() - new Date(m.timestamp) < 30 * 86400_000;
    const madrugada = new Date().getUTCHours() === 6;
    if (new Date(m.timestamp) >= limite) {
      if (recente || madrugada || !antes?.insights) Object.assign(item, await insightsMidia(m, token));
      else Object.assign(item, { insights: antes.insights });
    }
    item.serie = serie(antes?.serie, item);
    r.posts.push(item);
  }

  try {
    const { data: stories = [] } = await api("/me/stories", { fields: "id,media_type,media_product_type,permalink,timestamp,media_url,thumbnail_url" }, token);
    r.stories = [];
    for (const s of stories) r.stories.push({ ...resumoMidia({ ...s, media_product_type: "STORY" }), ...(await insightsMidia({ ...s, media_product_type: "STORY" }, token)) });
  } catch (error) {
    r.stories = [];
    r.erroStories = error.message;
  }
  // Stories somem da API em 24 h: guarda os que já vimos para não perder os números.
  const vistos = new Map((anterior?.storiesRecentes ?? []).map((s) => [s.id, s]));
  for (const s of r.stories) vistos.set(s.id, s);
  r.storiesRecentes = [...vistos.values()]
    .filter((s) => Date.now() - new Date(s.quando) < 30 * 86400_000)
    .sort((a, b) => b.quando.localeCompare(a.quando));

  // Série diária da conta (o Instagram guarda até 30 dias por consulta).
  r.diario = {};
  for (const metrica of ["reach", "follower_count"]) {
    try {
      const until = Math.floor(Date.now() / 1000);
      const json = await api(`/${perfil.user_id}/insights`, { metric: metrica, period: "day", since: String(until - 29 * 86400), until: String(until) }, token);
      r.diario[metrica] = (json.data?.[0]?.values ?? []).map((v) => ({ dia: v.end_time?.slice(0, 10), valor: v.value }));
    } catch (error) {
      r.diario[metrica] = { erro: error.message };
    }
  }

  // Público da conta: seguidores × não seguidores nos últimos 7 dias e perfil demográfico.
  r.publico = {};
  try {
    const until = Math.floor(Date.now() / 1000);
    r.publico.porSeguidor = quebra(await api(`/${perfil.user_id}/insights`, {
      metric: "reach,views", period: "day", metric_type: "total_value", breakdown: "follow_type",
      since: String(until - 7 * 86400), until: String(until),
    }, token));
  } catch (error) {
    r.publico.erroPorSeguidor = error.message;
  }
  for (const [nome, metrica] of [["seguidores", "follower_demographics"], ["engajados", "engaged_audience_demographics"]]) {
    r.publico[nome] = {};
    for (const corte of ["age", "gender", "city", "country"]) {
      try {
        r.publico[nome][corte] = quebra(await api(`/${perfil.user_id}/insights`, {
          metric: metrica, period: "lifetime", metric_type: "total_value", breakdown: corte,
          ...(nome === "engajados" ? { timeframe: "this_month" } : {}),
        }, token));
      } catch (error) {
        r.publico[nome].erro = error.message;
        break;
      }
    }
  }

  r.resumo = {};
  for (const dias of [7, 28]) {
    try {
      r.resumo[`${dias}d`] = await resumoConta(perfil.user_id, token, dias);
    } catch (error) {
      r.resumo[`${dias}d`] = { erro: error.message };
    }
  }

  const hoje = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const historico = (anterior?.historico ?? []).filter((h) => h.data !== hoje);
  historico.push({ data: hoje, seguidores: perfil.followers_count ?? null, seguindo: perfil.follows_count ?? null, posts: perfil.media_count ?? null });
  r.historico = historico.slice(-DIAS_HISTORICO);
  return r;
}

async function main() {
  const agenda = JSON.parse(fs.readFileSync(AGENDA, "utf8"));
  const anterior = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, "utf8")) : { contas: {} };
  const saida = { geradoEm: new Date().toISOString(), contas: {} };
  for (const conta of Object.keys(agenda.contas ?? {})) {
    const token = process.env[tokenEnv(conta)];
    if (!token) {
      saida.contas[conta] = { ...anterior.contas?.[conta], erro: `sem o segredo ${tokenEnv(conta)}` };
      continue;
    }
    try {
      saida.contas[conta] = await coletar(conta, token, anterior.contas?.[conta]);
      const c = saida.contas[conta];
      const comInsights = c.posts.filter((p) => p.insights).length;
      console.log(`${conta}: @${c.perfil.username}, ${c.perfil.followers_count} seguidores, ${c.posts.length} posts (${comInsights} com insights), ${c.stories.length} stories no ar`);
      const erro = c.posts.find((p) => p.erroInsights)?.erroInsights;
      if (erro) console.log(`${conta}: insights de post recusados (${erro})`);
      for (const [k, v] of Object.entries(c.resumo)) console.log(`${conta} ${k}: ${JSON.stringify(v)}`);
      if (c.publico?.erroPorSeguidor) console.log(`${conta}: seguidores × não seguidores recusado (${c.publico.erroPorSeguidor})`);
      if (c.publico?.seguidores?.erro) console.log(`${conta}: demografia recusada (${c.publico.seguidores.erro})`);
      for (const [k, v] of Object.entries(c.diario ?? {})) console.log(`${conta} diário ${k}: ${Array.isArray(v) ? v.length + " dias" : v.erro}`);
      if (c.erroStories) console.log(`${conta}: stories recusados (${c.erroStories})`);
    } catch (error) {
      saida.contas[conta] = { ...anterior.contas?.[conta], erro: error.message };
      console.log(`${conta}: falhou (${error.message})`);
    }
  }
  for (const aviso of new Set(avisos)) console.log(aviso);
  fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1) + "\n");
}

await main();
