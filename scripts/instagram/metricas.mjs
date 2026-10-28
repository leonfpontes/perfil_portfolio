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

async function insightsMidia(m, token) {
  const tipo = m.media_product_type === "REELS" ? "REELS" : m.media_product_type === "STORY" ? "STORY" : "FEED";
  try {
    return { insights: valores(await api(`/${m.id}/insights`, { metric: METRICAS[tipo] }, token)) };
  } catch (error) {
    return { erroInsights: error.message };
  }
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
  };
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
    fields: "id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,children{id}",
    limit: String(MAX_POSTS),
  }, token);
  const limite = Date.now() - DIAS_INSIGHTS * 86400_000;
  r.posts = [];
  for (const m of midia) {
    const item = resumoMidia(m);
    if (new Date(m.timestamp) >= limite) Object.assign(item, await insightsMidia(m, token));
    r.posts.push(item);
  }

  try {
    const { data: stories = [] } = await api("/me/stories", { fields: "id,media_type,media_product_type,permalink,timestamp" }, token);
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
      if (c.erroStories) console.log(`${conta}: stories recusados (${c.erroStories})`);
    } catch (error) {
      saida.contas[conta] = { ...anterior.contas?.[conta], erro: error.message };
      console.log(`${conta}: falhou (${error.message})`);
    }
  }
  fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1) + "\n");
}

await main();
