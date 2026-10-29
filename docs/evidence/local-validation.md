# Evidência de validação local

Data: **28 de outubro de 2026**, horário de São Paulo.

## Ambiente

- Linux x86_64.
- Node.js 24.22.1.
- Playwright 1.60.0 e Artillery 2.0.34.
- PostgreSQL 15 e API ShortBeyond beta com os digests fixados no Compose.
- API em 127.0.0.1:3433 e PostgreSQL em 127.0.0.1:55432.
- Projeto Docker exclusivo: shortbeyond-qa-lab.

## Resultados

| Verificação | Resultado |
| --- | --- |
| Instalação pelo lockfile | npm ci concluído; suíte executada após a instalação |
| Estrutura, sintaxe JS/YAML e payloads | Válidos |
| CSV | 2.000 registros, 3 campos, e-mails únicos |
| Importação direta | 2.000 inseridos |
| Reimportação | 0 inseridos, 2.000 já existentes |
| Testes funcionais | 19 aprovações regulares e 1 falha esperada documentada |
| Smoke Artillery | 7 fluxos concluídos, sem falhas de expectativas |
| Hash/identificador | bcrypt com salt individual e ULID conferidos |
| Erro de SQL na importação | Rollback verificado em esquema temporário |
| Limpeza | Usuários/links do escopo removidos; conta fora do escopo preservada |
| Origem | 37 arquivos conferidos por SHA-256; conteúdo preservado |

A suíte retorna código zero com a falha esperada; isso não significa que a divergência da API foi corrigida. Leia [BUG-001](../known-issues.md).

## Smoke por fluxo

| Fluxo | Respostas no cenário | Expectativas aprovadas |
| --- | ---: | ---: |
| Saúde | 1 | 2 |
| Cadastro novo | 1 | 3 |
| Cadastro duplicado | 1 | 2 |
| Login | 1 | 2 |
| Criar link | 2 | 4 |
| Listar links | 2 | 4 |
| Fluxo completo | 3 | 6 |

O HTTP 400 do cenário de duplicidade foi esperado e validado. As requisições do hook de preparação do cadastro não entram nessa contagem de cenários.

## Como reproduzir

```bash
npm ci
npm run setup
npm run env:up
npm run check
npm run test:api
npm run db:seed
npm run test:performance:smoke
```

O relatório HTML do Playwright e os JSONs do Artillery ficam em reports/, fora do versionamento. Esta síntese registra o contexto e os resultados relevantes, sem tokens ou traces de autenticação.

## Limitações

O teste de pico completo de 100 segundos não foi executado nesta reorganização. O smoke confirma os fluxos e os caminhos; não mede capacidade. Na data desta validação local, a pipeline ainda não havia sido executada remotamente. Atualização de 29/10/2026: a [execução no GitHub](https://github.com/felipephoeppner/shortbeyond-qa-lab/actions/runs/40896231107) passou no commit `0783ba2`, incluindo instalação, validação da estrutura, ambiente Docker e testes de API. Performance não foi executada nesse workflow. Alertas de dependências estão registrados em [problemas conhecidos](../known-issues.md).

O seed alternativo pela API foi preservado e teve sua estrutura validada; os 2.000 registros desta verificação foram inseridos pelo PostgreSQL.

## Estado ao entregar

Os containers desta cópia foram encerrados após a validação. O volume local mantém a massa importada; execute npm run env:up para retomá-la. O ambiente anterior não foi encerrado nem alterado.

Git inicializado na branch main, sem commit ou remote. O .env, node_modules e reports foram conferidos como ignorados; o envio ao GitHub segue o guia de publicação.
