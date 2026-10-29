# Problemas conhecidos e limites

## BUG-001 — exclusão de link inexistente

- **Imagem:** beyondtest/shortb-api:beta, digest fixado no Compose.
- **Ação:** autenticar, enviar DELETE /api/links/:id com um ULID válido que não existe.
- **Expectativa do teste herdado:** HTTP 404 e mensagem "Link não encontrado".
- **Observado em 28/10/2026:** HTTP 400 e a mesma mensagem.
- **Tratamento:** um único teste marcado com `test.fail`, com esta justificativa.
- **Revisão:** ao atualizar a imagem, verificar a expectativa. Uma aprovação inesperada faz a suíte falhar para exigir a retirada da marcação.

A resposta observada foi registrada; não existe especificação externa anexada que confirme se 404 é um requisito oficial do produto. A expectativa foi preservada do material de estudo, tornando a divergência explícita.

## Dependências — auditoria em 28/10/2026

Na preparação, Faker foi atualizado para 10.6.0 e yaml para 2.9.1, corrigindo os alertas diretos identificados nessas bibliotecas.

A auditoria ainda informa quatro entradas transitivas: duas de severidade alta na cadeia Azure Identity/MSAL e duas moderadas na cadeia Artillery/csv-parse. Os testes executados aqui usam HTTP local, sem autenticação Azure. Isso delimita o fluxo verificado; não elimina os alertas.

`npm audit fix` sem alterações incompatíveis foi tentado e não eliminou essas entradas. Não foi aplicada a sugestão de rebaixar o Artillery para 0.0.2.

- [MSAL — GHSA-xcx6-jx8p-x3h5](https://github.com/advisories/GHSA-xcx6-jx8p-x3h5)
- [CSV Parse — GHSA-8cw4-87c7-c6xx](https://github.com/advisories/GHSA-8cw4-87c7-c6xx)

Reavalie com `npm audit` ao atualizar as ferramentas; contagens podem mudar com novas publicações.

## Limites das evidências

- A pipeline de API foi executada com sucesso em 29/10/2026, no commit `0783ba2`: [execução no GitHub](https://github.com/felipephoeppner/shortbeyond-qa-lab/actions/runs/40896231107). Esse resultado inclui a falha esperada BUG-001 e não valida performance nem garante o resultado de commits posteriores.
- O smoke valida os fluxos de performance com uma execução de cada cenário; não estabelece capacidade ou SLO.
- Métricas locais dependem do computador e da concorrência com outros processos.
- A limpeza por teste depende de uma conexão ao banco e pode deixar resíduos se o processo for encerrado abruptamente.
- As imagens de terceiros precisam continuar disponíveis para uma instalação do zero.
