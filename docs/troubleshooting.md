# Solução de problemas

## npm não encontra package.json

**Sintoma:** ENOENT ao executar um comando npm.

**Causa:** execução fora da raiz do projeto.

**Solução:** entre na pasta que contém `package.json`, ou use `npm --prefix /caminho/shortbeyond-qa-lab run <comando>`.

**Verificação:** `npm run` lista os comandos do laboratório.

## Artillery não encontra o CSV

**Causa:** o caminho do payload é relativo ao YAML.

**Solução:** em `performance/scenarios`, o CSV fica em `../../data/users.csv`. O executor resolve esse caminho antes de gerar uma cópia de execução em `reports`.

**Verificação:** `npm run check`.

## PostgreSQL não resolve shortb-db

**Causa:** o nome não é um serviço deste Compose.

**Solução:** use `db:5432` no Adminer e `127.0.0.1:55432` em um cliente no Linux.

**Verificação:** `docker compose ps` e uma conexão pelo Adminer.

## API não responde ou porta está ocupada

**Solução:** execute `npm run env:up` e `npm run env:logs`. Se mudar a porta externa, atualize `API_PORT` e `BASE_API` no `.env` e recrie os containers com `npm run env:up`.

**Verificação:** `curl --fail http://127.0.0.1:3433/health`, ajustando a porta se necessário.

## Login falha depois da importação

**Causas possíveis:** banco errado, seed ainda sem commit, conta existente com senha diferente ou senha gravada sem bcrypt.

**Solução:** confira as variáveis do banco, aguarde a conclusão do seed e verifique a conta. O seed não troca senhas existentes.

**Verificação:** execute o smoke de performance. Não imprima tokens ou hashes em evidências públicas.

## Cadastro pela API retorna duplicidade

O seed por API espera contas novas. Para uma preparação repetível, use o seed direto que ignora contas existentes, ou limpe a massa antes do cadastro por API.

## PostgreSQL diz que uma coluna com o texto do filtro não existe

Use aspas simples em valores:

```sql
SELECT email FROM users WHERE email LIKE '%@teste.com';
```

Aspas duplas servem a identificadores.

## Um teste aparece como falha esperada

Veja [BUG-001](known-issues.md). A aplicação retorna 400 para um link inexistente, mas a expectativa do estudo é 404. A marcação é específica e deve ser revisada quando a imagem mudar.

## Artillery terminou, mas houve erros

Consulte os contadores `http.codes.*`, `vusers.failed` e `plugins.expect.failed`. O executor do projeto também verifica o relatório JSON e retorna erro se houver falhas, mesmo que o processo Artillery tenha retornado zero.

## Instalação informa alertas de dependências

Consulte `npm audit` e [problemas conhecidos](known-issues.md). Não aplique `npm audit fix --force` indiscriminadamente: a sugestão observada rebaixa o Artillery para uma versão incompatível.
