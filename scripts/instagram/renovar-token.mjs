#!/usr/bin/env node
/**
 * Renova os tokens do Instagram (vencem em 60 dias; a Meta deixa renovar a partir de 24 h de
 * idade). Roda toda segunda em .github/workflows/instagram.yml. Para cada conta "proprio" da
 * agenda, chama refresh_access_token e:
 * - se a Meta devolver o mesmo token, só estende a validade e pronto;
 * - se devolver um token novo, grava no segredo IG_TOKEN_<CONTA> com o gh CLI (precisa de
 *   GH_TOKEN com permissão de secrets); sem isso, falha e manda e-mail para trocar à mão.
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { tokenEnv } from "./publicar.mjs";

const agenda = JSON.parse(fs.readFileSync(process.env.AGENDA_ARQUIVO ?? "instagram/agenda.json", "utf8"));
const problemas = [];
for (const [conta, cfg] of Object.entries(agenda.contas ?? {})) {
  if (cfg.publicador !== "proprio") continue;
  const nome = tokenEnv(conta);
  const token = process.env[nome];
  if (!token) { problemas.push(`${conta}: falta o segredo ${nome}`); continue; }
  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.search = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: token });
  const resposta = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const json = await resposta.json().catch(() => ({}));
  if (!resposta.ok || !json.access_token) {
    problemas.push(`${conta}: não renovou (${json.error?.message ?? "HTTP " + resposta.status})`);
    continue;
  }
  const dias = Math.round((json.expires_in ?? 0) / 86400);
  if (json.access_token === token) { console.log(`${conta}: token renovado, vale mais ${dias} dias.`); continue; }
  try {
    execFileSync("gh", ["secret", "set", nome, "--body", json.access_token], { stdio: ["ignore", "inherit", "inherit"] });
    console.log(`${conta}: token novo gravado em ${nome}, vale ${dias} dias.`);
  } catch {
    problemas.push(`${conta}: a Meta deu um token novo, mas não consegui gravar em ${nome}. Gere de novo e atualize o segredo.`);
  }
}
if (problemas.length) {
  console.error(problemas.join("\n"));
  const key = process.env.RESEND_API_KEY, to = process.env.ALERTA_EMAIL;
  if (key && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Agenda Instagram <monitor@app.leopontes.com.br>", to: [to], subject: "Instagram: token precisa de atenção", text: problemas.join("\n") }),
    });
  }
  process.exitCode = 1;
}
