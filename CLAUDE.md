# CLAUDE.md

As regras do repositório estão no [`AGENTS.md`](AGENTS.md), que vale para qualquer agente:

@AGENTS.md

## Específico do Claude Code

- **Verificação visual:** depois de mudar algo que aparece na tela, suba o site (`npm run dev`, porta 3000, ou `npm run build` + `npm run preview`, porta 4173) e confira no navegador, também a 375 px de largura e com "Reduzir movimento" ligado. No macOS, veja a nota sobre `Funil.tsx` / `funil.ts` no `AGENTS.md`: se o build local quebrar por isso, confira no preview da Vercel do PR.
- **Commits:** terminam com a linha `Co-Authored-By` do modelo, como no histórico.
- **Plataforma:** mudanças em `lp-noir.css` ou `glass-light.ts` precisam do mesmo PR no `lp-diagnostico`. Se não puder fazer lá, diga que falta.
