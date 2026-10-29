# Arquitetura e decisões

## Caminho de uma execução

```text
spec → fixture → serviço HTTP → API → PostgreSQL
         ↓
 limpeza das contas criadas pelo teste
```

- **Spec:** descreve o comportamento e verifica a resposta.
- **Service:** concentra URL, método, headers e corpo da requisição.
- **Fixture:** entrega serviços ao teste e controla recursos.
- **Factory:** produz dados com identificadores exclusivos.
- **Scripts:** preparam ou removem dados fora do ciclo do teste.

## Decisões adotadas

| Decisão | Motivo |
| --- | --- |
| JavaScript com ES modules | Mantém a linguagem do material de origem |
| Uma suíte principal com fixtures | Evita repetir a mesma cobertura em duas implementações |
| Factories com UUID no e-mail | Reduz colisões em paralelo |
| Conta nova por teste | Cada cenário prepara sua própria precondição |
| Limpeza por e-mail exato no teardown | Preserva contas de outros testes e massa de performance |
| Listagem comparada sem ordem | A API não tem contrato de ordenação documentado aqui |
| CSV centralizado | Seed e carga usam a mesma fonte |
| Hash bcrypt individual e ULID no seed | Mantém formato de senha e identificador compatível com a aplicação |
| Transação na carga e limpeza | Evita estado parcialmente gravado em falhas de SQL |
| Domínios por finalidade | Permite limpeza explícita e previsível |
| Portas e volume exclusivos | Permite coexistência com o projeto anterior |
| Digest fixado para imagens | Registra a imagem efetivamente usada nas verificações |
| Falha esperada documentada | Expõe uma divergência da aplicação sem esconder a expectativa |

A limpeza automática registra apenas cadastros cujo retorno foi 201. Se o processo for interrompido ou o servidor persistir um cadastro sem entregar a resposta, pode sobrar massa; use a limpeza explícita do escopo `api`.

## Onde adicionar um cenário

1. Coloque o spec em `tests/api/<recurso>`.
2. Reutilize os serviços em `support/services`.
3. Importe `test` e `expect` de `support/fixtures/index.js` quando criar contas.
4. Use a factory para dados válidos e altere somente o campo relevante em um teste negativo.
5. Verifique a precondição antes de testar a ação principal.
6. Execute o arquivo isoladamente e depois a suíte.

O health check usa a fixture HTTP padrão porque não cria usuários.

## Exemplos preservados

`examples/before-fixtures` contém cópias dos estudos anteriores em arquivos `.js.txt`. Eles servem à comparação e não entram na descoberta do Playwright. O material de infraestrutura alternativo também foi preservado como referência.

## Limites

Este é um laboratório de API. Não existe frontend automatizado, contrato OpenAPI validado ou matriz completa de autorização. A pipeline disponibilizada cobre a suíte funcional. Performance tem comando próprio para evitar que um push provoque carga intensa.
