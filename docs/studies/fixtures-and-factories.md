# Estudo: fixtures, factories e services

## O problema inicial

Os exemplos anteriores criavam os serviços em `beforeEach` e repetiam esse preparo em vários arquivos. Depois surgiram versões com fixtures, mas ambas as versões continuaram dentro da suíte.

As cópias em [examples/before-fixtures](../../examples/before-fixtures) preservam essa etapa para consulta.

## As três responsabilidades

| Peça | Pergunta que responde | Exemplo |
| --- | --- | --- |
| Factory | Quais dados usar? | `getUser()` |
| Service | Como chamar o endpoint? | `auth.createUser(user)` |
| Fixture | Como preparar e liberar recursos do teste? | `async ({ auth }, use)` |

Exemplo da suíte:

```js
const user = getUser();
expect((await auth.createUser(user)).status()).toBe(201);
const response = await auth.login(user);
expect(response.status()).toBe(200);
```

O spec mantém a regra de negócio visível. A fixture entrega o serviço e registra as contas criadas com sucesso; ao finalizar, remove os links e usuários daquele teste.

## Aprendizados

- Uma variável criada fora do teste pode ser compartilhada por cenários e gerar duplicidade. Crie a massa por teste.
- E-mails com identificadores exclusivos permitem paralelismo sem colisões frequentes.
- Verifique o status da precondição: um cadastro que falhou não deve ser diagnosticado como falha de login.
- Não confunda reduzir repetição com esconder todas as ações dentro de um helper. O leitor precisa entender o comportamento testado.
- Uma chamada como `expect(data).toHaveProperty;` não executa uma asserção. Ela apenas acessa uma função.
- Evite comparar posições de listas quando o contrato não define a ordem.

## Exercício sugerido

Adicione um teste de isolamento: crie dois usuários, crie um link com o primeiro e confira que a listagem do segundo não inclui esse link. Essa cobertura ainda não está implementada e é uma expansão útil.
