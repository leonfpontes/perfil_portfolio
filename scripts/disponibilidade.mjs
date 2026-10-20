#!/usr/bin/env node
/**
 * Monitor de disponibilidade do site e da plataforma (roda no GitHub Actions a cada 10 minutos,
 * em .github/workflows/disponibilidade.yml). Fica fora da Vercel de propósito: se a Vercel cair,
 * o monitor continua de pé.
 *
 * Confere cada endereço (com uma segunda tentativa depois de 20 s, para não alarmar por um
 * soluço) e compara com o estado da rodada anterior, guardado em ESTADO_ARQUIVO:
 * - estava tudo bem e agora não está: e-mail "fora do ar";
 * - estava fora e voltou: e-mail "voltou";
 * - nada mudou: nenhum e-mail.
 * O e-mail sai pelo Resend (RESEND_API_KEY) para ALERTA_EMAIL. Sem as variáveis, só registra.
 */
import fs from "node:fs";

const CHECKS = [
  {
    name: "Site",
    url: "https://www.leopontes.com.br/",
    expect: (body) => body.includes("Leonardo Pontes"),
  },
  {
    name: "Área do cliente",
    url: "https://www.leopontes.com.br/entrar",
    expect: (body) => body.includes('<div id="root"') || body.length > 500,
  },
  {
    name: "Plataforma (app.leopontes.com.br)",
    url: "https://app.leopontes.com.br/healthz",
    // 'degraded' é aviso da tela de Operação (um erro nas últimas 24 h, por exemplo), não queda.
    expect: (body) => JSON.parse(body).status !== "down",
  },
];
const STATE_FILE = process.env.ESTADO_ARQUIVO ?? ".disponibilidade/estado.json";
const RETRY_MS = Number(process.env.RETRY_MS ?? 20_000);

async function probe({ name, url, expect }) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "monitor-lp/1" },
    });
    const body = await response.text();
    const ms = Date.now() - started;
    if (!response.ok)
      return { name, url, ok: false, detail: `HTTP ${response.status}`, ms };
    if (!expect(body))
      return { name, url, ok: false, detail: "resposta inesperada", ms };
    return { name, url, ok: true, detail: `HTTP ${response.status}`, ms };
  } catch (error) {
    return {
      name,
      url,
      ok: false,
      detail:
        error.name === "TimeoutError" ? "sem resposta em 15 s" : error.message,
      ms: Date.now() - started,
    };
  }
}

async function check(target) {
  const first = await probe(target);
  if (first.ok) return first;
  await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
  return probe(target);
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { down: [] };
  }
}

async function sendMail(subject, text) {
  const { RESEND_API_KEY: key, ALERTA_EMAIL: to } = process.env;
  if (!key || !to) {
    console.log(`(sem RESEND_API_KEY/ALERTA_EMAIL; o e-mail seria) ${subject}`);
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Monitor LP <monitor@app.leopontes.com.br>",
      to: [to],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok)
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

const results = await Promise.all(CHECKS.map(check));
const before = readState();
const down = results.filter((r) => !r.ok).map((r) => r.name);
const fell = down.filter((name) => !before.down.includes(name));
const back = before.down.filter((name) => !down.includes(name));
const when = new Date().toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
});
const lines = results.map(
  (r) =>
    `${r.ok ? "OK  " : "FORA"} ${r.name}: ${r.detail} (${r.ms} ms) ${r.url}`,
);
console.log(lines.join("\n"));

if (fell.length > 0) {
  await sendMail(
    `Fora do ar: ${fell.join(", ")}`,
    `${when}\n\n${lines.join("\n")}\n\nO que fazer: docs/runbook.md, "Incidente", no repositório lp-diagnostico.`,
  );
}
if (back.length > 0) {
  await sendMail(
    `Voltou: ${back.join(", ")}`,
    `${when}\n\n${lines.join("\n")}`,
  );
}

fs.mkdirSync(STATE_FILE.replace(/\/[^/]+$/, ""), { recursive: true });
fs.writeFileSync(
  STATE_FILE,
  JSON.stringify({ down, at: new Date().toISOString() }),
);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Disponibilidade · ${when}\n\n${lines.map((l) => `- ${l}`).join("\n")}\n`,
  );
}
