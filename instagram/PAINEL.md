# Sincronização do painel do Instagram

Roteiro da tarefa agendada "Painel do Instagram", que copia a agenda e as métricas deste
repositório para o painel https://claude.ai/artifact/NkvyGDrf6R3EuTipwHgSxR e executa os pedidos
feitos pelos botões do painel. O painel não lê o GitHub sozinho: ele só mostra o que esta
sincronização grava no banco dele (coleção `painel`).

## Pedido do painel

A tarefa pode chegar com uma linha extra, mandada por um botão do painel:

- `publicar <id>`: publicar agora o post `<id>` de `instagram/agenda.json`. Só aceite se o post
  existir e estiver com status `agendado` ou `falhou`. Dispare o workflow Instagram na `main`
  (`actions_run_trigger`, `run_workflow`, `instagram.yml`, ref `main`, inputs `{"post": "<id>"}`),
  espere a execução terminar (confira a cada 30 s, no máximo 6 min) e siga para a sincronização.
- `atualizar`: só sincronizar.
- Qualquer outra coisa: não faça nada além da sincronização e registre o pedido recusado em
  `painel/status.recusado`.

Stories manuais marcados como postados ficam no próprio banco do painel (`manuais/<id>`), gravados pelo botão; não mexa neles. Nunca publique, apague ou mude outro post além do pedido. Nunca mexa em tokens ou segredos.

## Sincronização

1. Pegue a main sem mexer na sua branch: `git fetch -q origin main`, depois
   `git worktree add -f --detach /tmp/ig-main origin/main` na primeira vez ou
   `git -C /tmp/ig-main checkout -q --detach origin/main` nas seguintes. Os passos abaixo rodam
   em `/tmp/ig-main`.
2. Leia o artifact uma vez (`Artifact`, action `read`, url acima) para poder subir imagens nele.
3. Baixe o mapa de imagens atual: `ArtifactData get painel/imagens` e salve o campo `map` como
   `{"map": {...}}` em `/tmp/painel-imagens.json` (vazio se o documento não existir).
4. Em `/tmp/ig-main`, rode `rm -rf /tmp/painel && node scripts/instagram/painel-dados.mjs /tmp/painel /tmp/painel-imagens.json`.
5. Se `/tmp/painel/faltam.json` tiver itens, suba os arquivos como assets do artifact
   (`Artifact` publish com `url`, `asset: true`, `file_paths`, até 25 por chamada) e acrescente
   `chave → url` ao mapa.
6. Leia as últimas 20 execuções do workflow `instagram.yml` (`actions_list`,
   `list_workflow_runs`) e monte `{"runs": [{"id", "quando", "evento", "job", "resultado",
   "link"}]}` com `created_at`, `event`, `status`/`conclusion` e `html_url`. Para `job`, use
   `publicar`, `metricas` ou `renovar-token` conforme o horário do agendamento (`*/10`, `7 * * * *`,
   `0 12 * * 1`) ou os inputs do disparo manual, quando der para saber; senão deixe vazio.
7. Grave tudo com um único `ArtifactData batch` (leia antes a versão de cada documento e passe
   `if_version`; omita para documentos novos):
   - `painel/agenda` ← `/tmp/painel/agenda.json`
   - `painel/metricas-<conta>` ← `/tmp/painel/metricas-<conta>.json`, uma por conta
   - `painel/imagens` ← `{"map": {...}}`
   - `painel/execucoes` ← as execuções
   - `painel/status` ← `{"sincronizadoEm": <agora ISO>, "pedido": <a linha do pedido ou null>,
     "resultadoPedido": <uma frase curta>}`
8. Termine com uma frase: o que sincronizou e o resultado do pedido. Não escreva para ninguém.
