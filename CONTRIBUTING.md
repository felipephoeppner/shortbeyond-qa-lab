# Contribuindo

Este projeto serve para aprendizado, consulta e demonstração de práticas de QA. Sugestões de cenários, melhorias de legibilidade e correções de documentação são bem-vindas.

## Preparar

Siga o [setup](docs/setup.md). Use Node 24 e o ambiente local do Compose. Trabalhe em uma branch dedicada.

## Alterar

- Escreva nomes de arquivos em inglês e explicações de estudo em português.
- Mantenha as expectativas explícitas nos specs.
- Use factories para dados exclusivos e fixtures para recursos.
- Inclua o objetivo de novos cenários na documentação correspondente.
- Registre falhas reais da aplicação; não enfraqueça asserções apenas para obter aprovação.
- Não inclua dados reais, credenciais pessoais ou resultados sem contexto.

## Validar

```bash
npm run check
npm run test:api
```

Se alterar performance, importe a massa e execute `npm run test:performance:smoke`. Carga completa exige uma execução intencional e registro das condições.

## Abrir uma mudança

Descreva o problema, a alteração e como foi validada. Se um teste depende de uma alteração na aplicação, informe a imagem usada. Consulte [problemas conhecidos](docs/known-issues.md) para não remover uma falha esperada sem investigar.
