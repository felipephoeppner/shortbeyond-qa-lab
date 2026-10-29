# Consulta rápida de comandos

Execute na raiz do repositório, onde está `package.json`.

| Objetivo | Comando |
| --- | --- |
| Instalar as versões registradas | `npm ci` |
| Criar .env local | `npm run setup` |
| Iniciar banco e API | `npm run env:up` |
| Ver logs da API | `npm run env:logs` |
| Abrir Adminer | `npm run env:adminer` |
| Verificar arquivos e CSV | `npm run check` |
| Listar cenários funcionais | `npm run test:api:list` |
| Executar testes funcionais | `npm run test:api` |
| Executar apenas login | `npm run test:api -- tests/api/auth/login.spec.js` |
| Abrir relatório Playwright | `npm run test:report` |
| Recriar CSV com 2.000 usuários | `npm run data:generate` |
| Recriar CSV com outra quantidade | `npm run data:generate -- 500` |
| Importar CSV pelo PostgreSQL | `npm run db:seed` |
| Importar outro CSV | `npm run db:seed -- caminho/arquivo.csv` |
| Cadastrar CSV pela API | `npm run db:seed:api` |
| Conferir todos os fluxos Artillery uma vez | `npm run test:performance:smoke` |
| Carga de saúde | `npm run test:performance:health` |
| Carga de cadastro | `npm run test:performance:register` |
| Carga de login | `npm run test:performance:login` |
| Pico com criação e listagem de links | `npm run test:performance:spike` |
| Apagar usuários do CSV e de cadastro de carga, com seus links | `npm run db:cleanup` |
| Apagar contas funcionais residuais, com seus links | `npm run db:cleanup -- api` |
| Encerrar containers preservando dados | `npm run env:down` |

`data:generate` sobrescreve o CSV. `db:cleanup` remove registros do banco. Consulte [dados de teste](test-data.md) antes de escolher o escopo.

Para executar de outra pasta no Linux:

```bash
npm --prefix /caminho/shortbeyond-qa-lab run test:api
```

## SQL para consulta

No Adminer, listar os usuários de performance:

```sql
SELECT id, name, email
FROM users
WHERE email LIKE 'performance%@teste.com'
ORDER BY email;
```

Contar links por usuário:

```sql
SELECT u.email, COUNT(l.id) AS total_links
FROM users u
LEFT JOIN links l ON l.user_id = u.id
GROUP BY u.id, u.email
ORDER BY total_links DESC;
```

Use aspas simples para texto: `LIKE '%@teste.com'`. Aspas duplas identificam tabelas ou colunas.
