# ShortBeyond QA Lab
## Origem do projeto e créditos

Este laboratório é baseado no projeto **ShortBeyond**, apresentado no curso **Playwright Além da Interface**, ministrado por **Fernando Papito**, na Udemy.

A aplicação utilizada nos testes e a imagem Docker disponibilizada pelo curso **não são de minha autoria**. Os créditos desses materiais pertencem aos respectivos autores. Os exemplos e exercícios do curso serviram como base para este estudo.

Minha contribuição neste repositório está na organização do material para consulta, nas adaptações realizadas durante o aprendizado e na documentação das execuções e dos aprendizados. Não apresento o projeto como uma implementação integralmente criada por mim.

O objetivo é registrar minha evolução em testes de APIs e performance e compartilhar a aplicação prática do conhecimento adquirido no curso.

**Referências:**

- Curso: **Playwright Além da Interface — Fernando Papito / Udemy**
- [Meu certificado de conclusão](https://ude.my/UC-5288234f-b64d-486e-b9c6-c13458930035)
- Imagem Docker utilizada: `beyondtest/shortb-api`

Laboratório de **testes de API e performance**. Reúne cenários executáveis, preparação de dados e notas de estudo para consulta e portfólio.

**Stack:** JavaScript (ES modules), Playwright, Artillery, PostgreSQL e Docker Compose.

A aplicação sob teste é a ShortBeyond, distribuída em uma imagem Docker de terceiros. Este repositório contém a automação e os materiais de estudo; o código da aplicação não faz parte dele.

## Comece por aqui

- **Quero executar:** [instalação e ambiente](docs/setup.md).
- **Quero encontrar um comando:** [consulta rápida](docs/commands.md).
- **Quero entender o código:** [arquitetura](docs/architecture.md).
- **Quero preparar 2.000 usuários:** [massa de dados](docs/test-data.md).
- **Quero estudar performance:** [cenários e métricas](performance/README.md).
- **Deu erro:** [solução de problemas](docs/troubleshooting.md).
- **Quero publicar no GitHub:** [guia de publicação](docs/publishing.md).
- **Quero consultar tudo:** [índice da documentação](docs/README.md).

## Execução rápida

Requisitos: Node.js 24, npm e Docker com Compose v2. Execute os comandos na raiz deste repositório.

```bash
npm ci
npm run setup
npm run env:up
npm run check
npm run test:api
```

O comando `setup` cria o `.env` a partir do exemplo sem sobrescrever configurações existentes. A suíte usa apenas requisições HTTP; não é necessário instalar navegadores.

Para preparar o banco e conferir todos os fluxos do Artillery com carga mínima:

```bash
npm run db:seed
npm run test:performance:smoke
```

Para executar o pico completo de 100 segundos:

```bash
npm run test:performance:spike
```

O pico chega a **100 novos usuários virtuais por segundo**. Cada usuário pode enviar mais de uma requisição. Esse comando gera carga e grava links no banco local.

## Ambiente local

| Serviço | Endereço no Linux |
| --- | --- |
| API | http://127.0.0.1:3433 |
| Saúde | http://127.0.0.1:3433/health |
| PostgreSQL | 127.0.0.1:55432 |
| Adminer opcional | http://127.0.0.1:8180 |

O Compose usa o projeto `shortbeyond-qa-lab` e um volume próprio. As portas foram escolhidas para permitir coexistência com o laboratório anterior em 3333/5432/8080. O frontend não é necessário para estes testes.

## O que este projeto demonstra

- Cadastro e login com cenários positivos e negativos.
- Criação, listagem e exclusão de links autenticados.
- Organização em testes, serviços HTTP, fixtures e factories.
- Dados exclusivos por teste e limpeza das contas criadas.
- Importação direta de CSV com bcrypt, transação e tratamento de duplicidade.
- Carga constante, pico e recuperação com Artillery.
- Registro de problemas conhecidos e execução de API preparada para GitHub Actions.

São **20 testes funcionais**. Um deles registra uma divergência conhecida: a imagem beta responde 400 onde o teste espera 404 para um link inexistente. Ele está marcado como falha esperada, com justificativa em [BUG-001](docs/known-issues.md). Uma correção da aplicação provoca uma aprovação inesperada e exige revisar essa marcação.

Não há testes de interface, avaliação de segurança, cobertura completa de autorização ou SLO de produção definido neste laboratório.

## Estrutura

```text
tests/api/             Cenários funcionais com Playwright
support/               Serviços, fixtures, factories, banco e configuração
performance/scenarios/ Cenários de carga com Artillery
data/users.csv         2.000 usuários fictícios, sem cabeçalho
scripts/               Geração, importação, limpeza e execução
docs/                  Guias, decisões, estudos e evidências
examples/              Exemplos anteriores preservados para comparação
.github/workflows/     Automação preparada para o GitHub
reports/               Resultados locais, ignorados pelo Git
```

## Resultados e manutenção

Consulte a [evidência de validação local](docs/evidence/local-validation.md) para saber o que foi executado e suas limitações. A automação do GitHub precisa ser executada após publicar o repositório; não há badge de CI sem execução real.

As dependências diretas e as imagens principais têm versões fixadas. Antes de atualizar, execute os testes e registre as mudanças. Alertas conhecidos de dependências estão em [limitações](docs/known-issues.md).

## Autoria e referências

**Felipe Hoeppner** · [LinkedIn](https://www.linkedin.com/in/hoeppnerfelipe/)

Consulte [créditos e referências](docs/references.md), [contribuição](CONTRIBUTING.md) e [licença ISC](LICENSE). As imagens de terceiros mantêm suas próprias condições de uso.
