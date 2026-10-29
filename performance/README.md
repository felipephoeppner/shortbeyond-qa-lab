# Performance com Artillery

Pré-requisitos: ambiente iniciado e, para login/spike/smoke, usuários do CSV importados.

```bash
npm run env:up
npm run db:seed
npm run test:performance:smoke
```

## Cenários

| Arquivo | Propósito | Preparação |
| --- | --- | --- |
| health.yaml | Saúde com 5 chegadas/s por 30 s | API online |
| register.yaml | Cadastro e e-mail duplicado, 3 chegadas/s por 45 s | A conta de duplicidade é preparada no before |
| login.yaml | Login, 4 chegadas/s por 60 s | CSV importado |
| spike.yaml | Aquecimento, pico e recuperação durante 100 s | CSV importado |

No cadastro, os pesos são 80% para conta nova e 20% para duplicidade. No pico, são 50% criação, 30% listagem e 20% fluxo completo. São probabilidades de seleção, não garantia de proporções exatas em amostras pequenas.

## Execução e relatórios

Os comandos npm chamam `scripts/run-performance.js`, que:

1. Carrega o YAML e aplica `BASE_API` do ambiente.
2. Resolve o caminho do CSV.
3. Grava a configuração efetiva e o relatório em `reports/performance/<data-hora>`.
4. Executa o Artillery local instalado pelo projeto.
5. Verifica falhas HTTP, de usuários virtuais e de expectativas no relatório.

`test:performance:smoke` executa cada um dos sete fluxos exatamente uma vez, reduzindo as fases para um único usuário. Ele confere comportamento e configuração, não capacidade sob carga.

As validações usam o plugin `expect`. HTTP 400 no cenário de duplicidade é uma resposta esperada, não uma falha de transporte.

## Interpretar resultados

| Métrica | Leitura |
| --- | --- |
| http.requests / http.responses | Requisições enviadas e respostas recebidas |
| http.codes.* | Distribuição de status HTTP |
| http.response_time.p95 | 95% das respostas ficaram até esse tempo |
| vusers.created / completed / failed | Jornadas iniciadas, concluídas ou falhas |
| plugins.expect.failed | Validações de conteúdo ou status que falharam |
| errors.* | Erros observados durante a execução |

O pico completo pode saturar um computador local. Consulte o [estudo de spike](../docs/studies/spike-testing.md). Os comandos retornam falha em erros funcionais; limites de latência precisam ser definidos conforme o objetivo do experimento.

O cadastro prévio pela API foi movido para `scripts/seed-users-api.yaml`, pois prepara dados. Não é um teste de capacidade.
