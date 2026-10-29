# Instalação e ambiente

## Requisitos

- Linux ou outro ambiente com Docker e Compose v2.
- Node.js 24, registrado em `.nvmrc`, e npm.
- Acesso ao registro npm e às imagens públicas do Docker.
- Portas locais 3433 e 55432 livres; 8180 se usar Adminer.

Com nvm instalado, execute `nvm use` na raiz. Caso a versão ainda não esteja disponível, use `nvm install`.

## Primeira execução

```bash
npm ci
npm run setup
npm run env:up
curl --fail http://127.0.0.1:3433/health
npm run check
npm run test:api
```

O banco e a API são iniciados pelo Compose. A imagem da API prepara suas tabelas na inicialização. A primeira subida pode demorar para baixar imagens; se a API ainda estiver iniciando, consulte `npm run env:logs` e repita o health check.

`npm ci` utiliza o `package-lock.json`. O projeto usa somente o motor HTTP do Artillery e a fixture `request` do Playwright. Navegadores não fazem parte do fluxo principal.

## Variáveis de ambiente

| Variável | Padrão do exemplo | Uso |
| --- | --- | --- |
| BASE_API | http://127.0.0.1:3433 | URL externa da API, sem /api no final |
| API_PORT | 3433 | Porta publicada pelo Docker |
| DB_HOST | 127.0.0.1 | Host usado pelos scripts Node |
| DB_PORT | 55432 | Porta externa do PostgreSQL |
| DB_USER | dba | Usuário local |
| DB_PWD | dba | Senha fictícia do laboratório |
| DB_NAME | ShortDB | Banco local |
| ADMINER_PORT | 8180 | Porta externa do Adminer |
| JWT_SECRET | shortbeyond-lab-local-only | Segredo demonstrativo da API local |

Se mudar `API_PORT`, atualize também `BASE_API`. A URL interna do banco no Compose usa `db:5432`; alterar `DB_HOST` não muda essa rede interna. Credenciais com caracteres reservados em URL precisam ser codificadas na `DATABASE_URL` do Compose.

## Adminer e PostgreSQL

```bash
npm run env:adminer
```

Abra http://127.0.0.1:8180 e use:

| Campo | Valor |
| --- | --- |
| Sistema | PostgreSQL |
| Servidor | db:5432 |
| Usuário | dba |
| Senha | dba |
| Base | ShortDB |

No DBeaver instalado no Linux, use `127.0.0.1:55432`. O Adminer acessa o banco de dentro de um container e usa o nome do serviço Docker.

## Encerrar e voltar depois

```bash
npm run env:down
npm run env:up
```

O encerramento preserva o volume. Para excluir deliberadamente todos os dados deste laboratório, use `docker compose down -v`; ele não faz parte da execução normal.

Não compartilhe o mesmo banco entre execuções simultâneas de carga e limpeza. As credenciais do exemplo são exclusivamente locais.
