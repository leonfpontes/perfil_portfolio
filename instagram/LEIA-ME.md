# Agenda do Instagram

Publicador próprio no lugar do Postiz, para @pontes_brain e @girahuboficial.

- `agenda.json`: todos os posts, com conta, horário (Brasília), formato, legenda, mídia e status.
- `midia/`: imagens em JPEG (a API do Instagram só aceita JPEG), servidas pelo raw do GitHub.
- `scripts/instagram/publicar.mjs`: publica o que chegou na hora; roda a cada 10 min em
  `.github/workflows/instagram.yml` e grava o status de volta aqui (commits `[instagram]`,
  que a Vercel ignora).
- Calendário para acompanhar: https://claude.ai/artifact/NkvyGDrf6R3EuTipwHgSxR

## Ligar uma conta (uma vez por conta)

1. A conta do Instagram precisa ser profissional (Criador ou Empresa).
2. Em developers.facebook.com, crie um app do tipo Empresa e adicione o produto
   "Instagram" → "API com login do Instagram". Você como administrador do app não precisa de
   revisão da Meta para publicar nas suas próprias contas.
3. Em "Funções do app" → "Testadores do Instagram", adicione a conta e aceite o convite no
   Instagram (Configurações → Apps e sites → Convites de testador).
4. Em "Gerar tokens de acesso", gere o token da conta com as permissões
   `instagram_business_basic` e `instagram_business_content_publish`.
5. No GitHub (Settings → Secrets and variables → Actions), crie o segredo
   `IG_TOKEN_PONTES_BRAIN` (ou `IG_TOKEN_GIRAHUB`) com esse token. Nunca cole o token em chat.
6. Opcional, para o token se renovar sozinho: um token fino do GitHub só deste repositório com
   "Secrets: Read and write", no segredo `GH_SECRETS_TOKEN`.
7. Teste: Actions → Instagram → Run workflow, com o id de um post e "simular" marcado.
8. Só então troque `"publicador": "postiz"` por `"proprio"` na conta em `agenda.json` e apague
   do Postiz os posts daquela conta (só daquela).
