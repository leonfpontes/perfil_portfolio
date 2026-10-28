#!/usr/bin/env node
/**
 * Prepara os dados do painel de acompanhamento (artifact "Agenda do Instagram") a partir de
 * instagram/agenda.json e instagram/metricas.json. Quem roda é a sincronização descrita em
 * instagram/PAINEL.md: este script só monta os arquivos; gravar no banco do painel e subir as
 * imagens fica com a sessão do Claude, que tem acesso ao artifact.
 *
 * Uso: node scripts/instagram/painel-dados.mjs <pasta de saída> [mapa de imagens atual.json]
 *
 * Saída:
 * - agenda.json             documento painel/agenda
 * - metricas-<conta>.json   documento painel/metricas-<conta>
 * - faltam.json             [{chave, arquivo}] imagens que o painel ainda não tem, já reduzidas
 *                           para 540 px em <saída>/imagens/ (chave = id da agenda ou "ig:<id>")
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [saida, mapaArquivo] = process.argv.slice(2);
if (!saida) {
  console.error("uso: painel-dados.mjs <pasta de saída> [mapa de imagens.json]");
  process.exit(1);
}
const agenda = JSON.parse(fs.readFileSync("instagram/agenda.json", "utf8"));
const metricas = fs.existsSync("instagram/metricas.json")
  ? JSON.parse(fs.readFileSync("instagram/metricas.json", "utf8"))
  : { contas: {} };
const mapa = mapaArquivo && fs.existsSync(mapaArquivo) ? JSON.parse(fs.readFileSync(mapaArquivo, "utf8")) : {};
const imagens = mapa.map ?? mapa;

fs.mkdirSync(path.join(saida, "imagens"), { recursive: true });
const grava = (nome, dados) => fs.writeFileSync(path.join(saida, nome), JSON.stringify(dados));

const CAMPOS = ["id", "conta", "quando", "formato", "status", "titulo", "legenda", "nota", "link", "midiaId",
  "publicadoEm", "erro", "tentativas"];
grava("agenda.json", {
  contas: agenda.contas,
  posts: agenda.posts.map((p) => {
    const out = Object.fromEntries(CAMPOS.filter((k) => p[k] != null).map((k) => [k, p[k]]));
    out.itens = p.midia?.length ?? 0;
    return out;
  }),
});

const semImagem = ({ imagem, ...resto }) => resto;
for (const [conta, c] of Object.entries(metricas.contas ?? {})) {
  grava(`metricas-${conta}.json`, {
    geradoEm: metricas.geradoEm,
    coletadoEm: c.coletadoEm ?? null,
    erro: c.erro ?? null,
    perfil: c.perfil ?? null,
    resumo: c.resumo ?? {},
    posts: (c.posts ?? []).map(semImagem),
    stories: (c.storiesRecentes ?? []).map(semImagem),
    historico: c.historico ?? [],
  });
}

// Imagens que faltam: a da agenda vem do repositório; a dos posts já publicados, do link
// temporário que a API devolveu na última coleta de métricas.
const faltam = [];
function reduzir(chave, origem) {
  const arquivo = path.join(saida, "imagens", chave.replace(/[^A-Za-z0-9_-]/g, "_") + ".jpg");
  try {
    execFileSync("convert", [origem + "[0]", "-resize", "540x", "-quality", "80", arquivo], { stdio: "pipe" });
    faltam.push({ chave, arquivo: path.resolve(arquivo) });
  } catch (error) {
    console.log(`sem imagem para ${chave}: ${error.message.split("\n")[0]}`);
  }
}
for (const p of agenda.posts) {
  if (imagens[p.id]) continue;
  const fonte = p.capa ?? p.midia?.find((m) => /\.(jpe?g|png)$/i.test(m));
  if (fonte) reduzir(p.id, path.join("instagram", fonte));
}
const fotos = Object.entries(metricas.contas ?? {}).filter(([, c]) => c.perfil?.foto);
for (const [conta, c] of fotos) {
  const chave = `perfil:${conta}`;
  const arquivo = path.join("instagram", c.perfil.foto);
  if (imagens[chave]) continue;
  if (fs.existsSync(arquivo)) reduzir(chave, arquivo);
}
const temp = path.join(saida, "baixadas");
fs.mkdirSync(temp, { recursive: true });
for (const c of Object.values(metricas.contas ?? {})) {
  for (const m of [...(c.posts ?? []), ...(c.storiesRecentes ?? [])]) {
    const chave = `ig:${m.id}`;
    if (imagens[chave] || !m.imagem) continue;
    const local = path.join(temp, m.id);
    try {
      const resposta = await fetch(m.imagem, { signal: AbortSignal.timeout(30_000) });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      fs.writeFileSync(local, Buffer.from(await resposta.arrayBuffer()));
      reduzir(chave, local);
    } catch (error) {
      console.log(`não baixei ${chave}: ${error.message}`);
    }
  }
}
grava("faltam.json", faltam);
console.log(`agenda: ${agenda.posts.length} posts; métricas: ${Object.keys(metricas.contas ?? {}).join(", ") || "nenhuma"}; imagens novas: ${faltam.length}`);
