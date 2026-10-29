# Mapa da reorganização

A pasta original `QA_portfolio` foi usada como fonte de leitura. Esta cópia foi criada em um diretório separado.

| Caminho anterior dentro de Playwright_API | Destino / decisão |
| --- | --- |
| playwright/e2e/auth/registerFixture.spec.js | tests/api/auth/register.spec.js |
| playwright/e2e/auth/loginFixture.spec.js | tests/api/auth/login.spec.js |
| playwright/e2e/links/postFixture.spec.js | tests/api/links/create.spec.js |
| playwright/e2e/links/get.spec.js | tests/api/links/list.spec.js |
| playwright/e2e/links/delete.spec.js | tests/api/links/delete.spec.js |
| playwright/e2e/health.spec.js | tests/api/health.spec.js |
| playwright/e2e/support | support |
| Versões sem fixtures de login/register/post | examples/before-fixtures, como referência .txt |
| performance/tests/cadastro.yaml | performance/scenarios/register.yaml |
| performance/tests/login.yaml | performance/scenarios/login.yaml |
| performance/tests/spike.yaml | performance/scenarios/spike.yaml |
| performance/tests/health.yaml | performance/scenarios/health.yaml |
| performance/tests/cadastroPrévio.yaml | scripts/seed-users-api.yaml |
| performance/tests/data/usuarios.csv | data/users.csv, conteúdo preservado |
| performance/scripts/importarUsuarios.js | scripts/seed-users.js |
| .env.exmaple | .env.example corrigido e utilizável |
| global-setup.js | Limpeza global substituída por teardown de cada teste |
| shortbeyond.yaml | examples/infrastructure/shortbeyond-pod.yaml |
| README profissional da pasta pai | docs/reference/profile-readme.md |
| Relatórios, node_modules e .env pessoal | Não copiados |

## Ajustes funcionais nesta cópia

- Padronização de nomes, imports e comandos.
- Testes repetidos consolidados em uma suíte com fixtures.
- Precondições verificadas antes das ações principais.
- Contas exclusivas e limpeza por teste.
- Comparação de listagem sem dependência de ordenação.
- URL de health respeita o ambiente.
- Plugin expect habilitado nos cenários de carga.
- Validações de mensagem em JMESPath no lugar do match não reconhecido.
- Login separado do cenário de cadastro duplicado.
- Preparo explícito da conta usada no teste de duplicidade.
- Seed direto preserva transação e gera ULIDs.
- Executor de performance verifica erros no relatório.
- Um caso de resposta divergente documentado como falha esperada.

O manifesto de Pod preservado é material de referência, não foi executado e usa portas/configurações anteriores. O caminho suportado por este laboratório é o Compose da raiz.
