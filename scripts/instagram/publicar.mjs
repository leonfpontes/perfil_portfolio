#!/usr/bin/env node
/**
 * Publicador do Instagram (roda no GitHub Actions a cada 10 minutos, em
 * .github/workflows/instagram.yml). Substitui o Postiz: lê instagram/agenda.json, publica pela
 * API oficial do Instagram (login do Instagram, graph.instagram.com) os posts cuja hora chegou e
 * grava o resultado de volta na agenda (status, link do post, erro).
 *
 * Regras:
 * - Só publica contas com "publicador": "proprio" em agenda.json. Enquanto uma conta estiver em
 *   "postiz", o script não toca nela (evita post duplicado durante a migração).
 * - Stories com "status": "manual" são do Leonardo, postados à mão no app; o script ignora.
 * - Janela: publica posts com hora entre agora - JANELA_HORAS e agora. Mais velho que isso vira
 *   "falhou" com o motivo, para não soltar post atrasado de dias.
 * - Até 3 tentativas por post; na terceira falha, e-mail de alerta (Resend, como o monitor de
 *   disponibilidade).
 * - Imagens precisam estar numa URL pública em JPEG: usamos o arquivo do próprio repositório
 *   (raw.githubusercontent.com), então a mídia tem de estar commitada na main antes da hora.
 *
 * Variáveis: IG_TOKEN_<CONTA> (ex.: IG_TOKEN_PONTES_BRAIN), RESEND_API_KEY, ALERTA_EMAIL,
 * MIDIA_BASE (padrão: raw da main), AGORA (ISO, só para teste), SOMENTE (id de um post para
 * publicar já, ignorando a hora), SIMULAR=1 (não chama a API, só mostra o que faria),
 * VERIFICAR=1 (só confere o token de cada conta na API e a cota de publicação; não publica).
 */
import fs from "node:fs";
import path from "node:path";

const AGENDA = process.env.AGENDA_ARQUIVO ?? "instagram/agenda.json";
const MIDIA_BASE =
  process.env.MIDIA_BASE ??
  "https://raw.githubusercontent.com/leonfpontes/perfil_portfolio/main/instagram/";
const GRAPH = "https://graph.instagram.com/v23.0";
const JANELA_HORAS = Number(process.env.JANELA_HORAS ?? 6);
const MAX_TENTATIVAS = 3;
const SIMULAR = process.env.SIMULAR === "1";
const SOMENTE = process.env.SOMENTE || "";
const agora = process.env.AGORA ? new Date(process.env.AGORA) : new Date();

export function tokenEnv(conta) {
  return "IG_TOKEN_" + conta.toUpperCase().replace(/[^A-Z0-9]/g, "_");
}

/** Posts que devem sair nesta rodada, em ordem de horário. */
export function devidos(agenda, now = agora, somente = SOMENTE) {
  const contas = agenda.contas ?? {};
  return agenda.posts
    .filter((p) => contas[p.conta]?.publicador === "proprio")
    .filter((p) => (somente ? p.id === somente : p.status === "agendado"))
    .filter((p) => somente || new Date(p.quando) <= now)
    .sort((a, b) => a.quando.localeCompare(b.quando));
}

export function atrasado(post, now = agora) {
  return now - new Date(post.quando) > JANELA_HORAS * 3600_000;
}

async function api(metodo, rota, params, token) {
  const url = new URL(GRAPH + rota);
  const opts = { method: metodo, signal: AbortSignal.timeout(60_000) };
  const corpo = new URLSearchParams({ ...params, access_token: token });
  if (metodo === "GET") url.search = corpo.toString();
  else opts.body = corpo;
  const resposta = await fetch(url, opts);
  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok || json.error) {
    const e = json.error ?? {};
    throw new Error(
      `${rota}: ${e.message ?? "HTTP " + resposta.status}${e.error_user_msg ? " (" + e.error_user_msg + ")" : ""}`,
    );
  }
  return json;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Espera o container ficar pronto (vídeo demora; imagem costuma ser imediata). */
async function aguardarContainer(id, token) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await api("GET", `/${id}`, { fields: "status_code" }, token);
    if (status_code === "FINISHED" || status_code === undefined) return;
    if (status_code === "ERROR" || status_code === "EXPIRED")
      throw new Error(`container ${id} ficou ${status_code}`);
    await espera(10_000);
  }
  throw new Error(`container ${id} não ficou pronto em 5 minutos`);
}

const ehVideo = (arquivo) => /\.(mp4|mov)$/i.test(arquivo);
const urlMidia = (arquivo) => MIDIA_BASE + arquivo.split("/").map(encodeURIComponent).join("/");

function midiaParams(arquivo) {
  return ehVideo(arquivo) ? { video_url: urlMidia(arquivo) } : { image_url: urlMidia(arquivo) };
}

/** Cria os containers do formato do post e devolve o id do container final. */
async function montar(post, token) {
  const arquivos = post.midia;
  if (!arquivos?.length) throw new Error("post sem mídia");
  if (post.formato === "story" || post.formato === "story-video") {
    return (await api("POST", "/me/media", { media_type: "STORIES", ...midiaParams(arquivos[0]) }, token)).id;
  }
  if (post.formato === "reel") {
    return (await api("POST", "/me/media", { media_type: "REELS", caption: post.legenda, ...midiaParams(arquivos[0]) }, token)).id;
  }
  if (arquivos.length === 1) {
    return (await api("POST", "/me/media", { caption: post.legenda, ...midiaParams(arquivos[0]) }, token)).id;
  }
  if (arquivos.length > 20) throw new Error("carrossel com mais de 20 itens");
  const filhos = [];
  for (const arquivo of arquivos) {
    const extra = ehVideo(arquivo) ? { media_type: "VIDEO" } : {};
    const { id } = await api("POST", "/me/media", { is_carousel_item: "true", ...extra, ...midiaParams(arquivo) }, token);
    filhos.push(id);
  }
  for (const id of filhos) await aguardarContainer(id, token);
  return (await api("POST", "/me/media", { media_type: "CAROUSEL", children: filhos.join(","), caption: post.legenda }, token)).id;
}

/** Já está no perfil? Evita post duplicado se outro publicador (ex.: Postiz) soltou antes. */
async function jaPublicado(post, token) {
  if (!post.legenda || post.formato?.startsWith("story")) return null;
  const inicio = post.legenda.trim().slice(0, 80);
  const { data = [] } = await api("GET", "/me/media", { fields: "id,caption,permalink,timestamp", limit: "15" }, token);
  return data.find((m) => (m.caption ?? "").trim().startsWith(inicio)) ?? null;
}

async function publicar(post, token) {
  const existente = await jaPublicado(post, token);
  if (existente) return { midiaId: existente.id, link: existente.permalink ?? null, nota: "já estava no perfil" };
  const container = await montar(post, token);
  await aguardarContainer(container, token);
  const { id } = await api("POST", "/me/media_publish", { creation_id: container }, token);
  const { permalink } = await api("GET", `/${id}`, { fields: "permalink" }, token).catch(() => ({}));
  return { midiaId: id, link: permalink ?? null };
}

async function enviarEmail(assunto, texto) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ALERTA_EMAIL;
  if (!key || !to) return console.log(`(sem e-mail configurado) ${assunto}`);
  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Agenda Instagram <monitor@app.leopontes.com.br>", to: [to], subject: assunto, text: texto }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!resposta.ok) console.error(`Resend ${resposta.status}: ${await resposta.text()}`);
}

/** Confere o token de cada conta da agenda sem publicar nada. */
async function verificar(agenda) {
  let ok = true;
  for (const conta of Object.keys(agenda.contas ?? {})) {
    const nome = tokenEnv(conta);
    const token = process.env[nome];
    if (!token) { console.log(`${conta}: sem o segredo ${nome}`); ok = false; continue; }
    try {
      const me = await api("GET", "/me", { fields: "user_id,username,account_type" }, token);
      const cota = await api("GET", `/${me.user_id}/content_publishing_limit`, { fields: "quota_usage,config" }, token)
        .then((r) => r.data?.[0]).catch(() => null);
      const usado = cota ? `, cota de hoje ${cota.quota_usage}/${cota.config?.quota_total ?? "?"}` : "";
      console.log(`${conta}: token OK, conta @${me.username} (${me.account_type})${usado}`);
    } catch (error) {
      console.log(`${conta}: token recusado (${error.message})`);
      ok = false;
    }
  }
  if (!ok) process.exitCode = 1;
}

async function main() {
  const agenda = JSON.parse(fs.readFileSync(AGENDA, "utf8"));
  if (process.env.VERIFICAR === "1") return verificar(agenda);
  const fila = devidos(agenda);
  if (!fila.length) return console.log(`Nada para publicar (${agora.toISOString()}).`);
  let mudou = false;
  const falhas = [];
  for (const post of fila) {
    const rotulo = `${post.id} [${post.conta}] ${post.quando}`;
    if (!SOMENTE && atrasado(post)) {
      Object.assign(post, { status: "falhou", erro: `passou mais de ${JANELA_HORAS} h da hora marcada sem publicar` });
      falhas.push(`${rotulo}: ${post.erro}`);
      mudou = true;
      continue;
    }
    const token = process.env[tokenEnv(post.conta)];
    if (!token && !SIMULAR) {
      falhas.push(`${rotulo}: falta o segredo ${tokenEnv(post.conta)}`);
      continue;
    }
    if (SIMULAR) {
      console.log(`SIMULAR ${rotulo}: ${post.formato}, ${post.midia.map(urlMidia).join(" ")}`);
      continue;
    }
    try {
      const r = await publicar(post, token);
      Object.assign(post, { status: "publicado", publicadoEm: new Date().toISOString(), ...r, erro: null });
      console.log(`OK ${rotulo} ${r.link ?? r.midiaId}`);
    } catch (error) {
      post.tentativas = (post.tentativas ?? 0) + 1;
      post.erro = error.message;
      console.error(`ERRO ${rotulo} (tentativa ${post.tentativas}): ${error.message}`);
      if (post.tentativas >= MAX_TENTATIVAS) {
        post.status = "falhou";
        falhas.push(`${rotulo}: ${error.message}`);
      }
    }
    mudou = true;
  }
  if (mudou) fs.writeFileSync(AGENDA, JSON.stringify(agenda, null, 1) + "\n");
  if (falhas.length) {
    await enviarEmail(
      `Instagram: ${falhas.length} post(s) não saíram`,
      `${falhas.join("\n")}\n\nVeja a agenda em instagram/agenda.json e o log em Actions → Instagram.`,
    );
    process.exitCode = 1;
  }
}

if (path.resolve(process.argv[1] ?? "") === path.resolve(new URL(import.meta.url).pathname)) {
  await main();
}
