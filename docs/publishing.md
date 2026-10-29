# Publicar no GitHub

Este diretório é um repositório Git independente. A publicação remota ainda não foi feita.

## Identidade e apresentação

Nome sugerido: **shortbeyond-qa-lab**.

Descrição sugerida: **Laboratório de testes de API e performance com Playwright, Artillery e PostgreSQL, com guias de estudo e dados reproduzíveis.**

Topics sugeridos: `qa`, `api-testing`, `playwright`, `artillery`, `performance-testing`, `javascript`, `postgresql`, `test-automation`.

O [README de perfil preservado](reference/profile-readme.md) pode ajudar a compor sua apresentação profissional. Revise suas informações e datas antes de usá-lo no repositório especial do perfil.

## Antes do primeiro envio

```bash
git status --short
npm run check
npm run test:api
git check-ignore .env node_modules reports
```

Confira `git config user.name` e `git config user.email`. Se precisar, configure a identidade apenas neste repositório:

```bash
git config user.name "Seu nome profissional"
git config user.email "Seu e-mail profissional ou endereço noreply do GitHub"
```

## Primeiro commit

```bash
git add .
git diff --cached --stat
git diff --cached --name-only
git commit -m "docs: organiza laboratório de QA com testes e guias"
```

A raiz contém um `.gitignore` que exclui ambiente local, dependências e relatórios. A massa CSV é fictícia e faz parte do projeto.

## Criar o destino

No GitHub, crie um repositório público chamado `shortbeyond-qa-lab`, inicialmente vazio, sem gerar outro README ou licença. Copie a URL SSH ou HTTPS mostrada pelo GitHub.

Depois, execute substituindo `SEU_USUARIO`:

```bash
git remote add origin https://github.com/SEU_USUARIO/shortbeyond-qa-lab.git
git push -u origin main
```

A autenticação é feita pelo GitHub/gerenciador de credenciais. Não coloque tokens em arquivos do projeto.

## Depois de publicar

1. Confira se a página inicial mostra o README.
2. Abra Actions e acompanhe a primeira execução de Testes de API.
3. Confira se o relatório ficou disponível como artefato.
4. Preencha descrição e topics.
5. Fixe o repositório no seu perfil e adicione um link no README profissional.
6. Só adicione um badge de CI após verificar a URL real do workflow.

## Atualizações futuras

Use branches com nomes que descrevam a mudança e commits pequenos. Registre novos aprendizados no guia correspondente, junto com o código. Ao atualizar dependências ou imagens, repita os testes e atualize a evidência com a data real.

Não publique relatórios de carga como se fossem medições de produção. Mantenha o contexto do experimento visível.
