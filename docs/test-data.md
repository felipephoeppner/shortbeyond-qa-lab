# Massa de dados

## Três conjuntos com funções diferentes

| Conjunto | Identificação | Criação | Limpeza |
| --- | --- | --- | --- |
| Funcional | api-UUID@qa.example.test | Factory + cadastro pela API | Automática por teste; residual com `db:cleanup -- api` |
| Performance | performance01@teste.com até performance2000@teste.com | CSV importado no banco ou cadastrado pela API | `db:cleanup` |
| Cadastro sob carga | load-UUID@load.example.test e duplicado@load.example.test | Cenário register | `db:cleanup` |

Os registros são fictícios e não disparam e-mails. O CSV mantém os valores do material original para facilitar comparação.

## Formato do CSV

```csv
Usuario Performance 01,performance01@teste.com,senha123
Usuario Performance 02,performance02@teste.com,senha123
```

Não há cabeçalho. A ordem é `name,email,password`. Senhas no CSV são dados de teste conhecidos; no banco são armazenadas como hashes.

```bash
npm run data:generate
npm run db:seed
```

O gerador sobrescreve o CSV. Reduzir a quantidade não apaga contas já importadas. Se quiser reduzir também o banco, execute a limpeza com o CSV antigo antes de gerar o novo.

## Importação direta

`scripts/seed-users.js` valida todos os registros, consulta os e-mails existentes, gera ULIDs e bcrypt com custo 10, e insere em lotes de 100 dentro de uma transação. Cada hash recebe seu próprio salt.

A reexecução ignora e-mails existentes: não atualiza nomes nem redefine senhas. Se uma conta já existir com outra senha, o login do CSV falhará; limpe e recrie a massa apropriada.

As mensagens de progresso indicam registros processados. A importação só está persistida quando aparece a conclusão após o commit. Em erro de SQL, a transação é desfeita. A conexão e o pool são encerrados.

A importação depende do esquema atual: `users(id, name, email, password)`. Ela prepara a massa; não testa as regras de cadastro da API.

## Alternativa pela API

```bash
npm run db:seed:api
```

Um usuário virtual percorre todo o CSV com `loadAll` e `loop`. Essa alternativa espera 201 em cada cadastro, portanto exige e-mails ainda não cadastrados. Escolha uma das duas formas de preparação, sem executar ambas sobre a mesma massa.

## Limpeza

```bash
npm run db:cleanup
npm run db:cleanup -- api
```

O primeiro comando remove os e-mails exatos do CSV atual e contas do domínio `@load.example.test`. O segundo remove contas do domínio `@qa.example.test`. Ambos removem os links associados antes dos usuários, dentro de uma transação.

Os comandos atuam no banco configurado no `.env`. O padrão aponta ao banco exclusivo do laboratório em 55432. O projeto anterior e seu banco em 5432 não são usados.
