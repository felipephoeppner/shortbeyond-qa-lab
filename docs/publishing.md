# Publicação e manutenção no GitHub

Este projeto está publicado em [felipephoeppner/shortbeyond-qa-lab](https://github.com/felipephoeppner/shortbeyond-qa-lab). A suíte de API foi [executada com sucesso em 29/10/2026](https://github.com/felipephoeppner/shortbeyond-qa-lab/actions/runs/40896231107), no commit `0783ba2`.

Para atualizar este repositório, consulte **Atualizações futuras** ao final. As instruções de primeiro envio abaixo são referência para quem quiser publicar uma cópia em sua própria conta; não é necessário recriar o repositório existente nem adicionar novamente o remoto `origin`.

## Identidade e apresentação

Nome sugerido: **shortbeyond-qa-lab**.

Descrição sugerida: **Laboratório de testes de API e performance com Playwright, Artillery e PostgreSQL, com guias de estudo e dados reproduzíveis.**

Topics sugeridos: `qa`, `api-testing`, `playwright`, `artillery`, `performance-testing`, `javascript`, `postgresql`, `test-automation`.

O [README de perfil preservado](reference/profile-readme.md) pode ajudar a compor sua apresentação profissional. Revise suas informações e datas antes de usá-lo no repositório especial do perfil.

## Antes de enviar alterações

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

## Primeiro commit de uma cópia independente

```bash
git add .
git diff --cached --stat
git diff --cached --name-only
git commit -m "docs: organiza laboratório de QA com testes e guias"
```

A raiz contém um `.gitignore` que exclui ambiente local, dependências e relatórios. A massa CSV é fictícia e faz parte do projeto.

## Criar o destino de uma cópia independente

No GitHub, crie um repositório público chamado `shortbeyond-qa-lab`, inicialmente vazio, sem gerar outro README ou licença. Copie a URL SSH ou HTTPS mostrada pelo GitHub.

Depois, execute substituindo `SEU_USUARIO`:

```bash
git remote add origin https://github.com/SEU_USUARIO/shortbeyond-qa-lab.git
git push -u origin main
```

A autenticação é feita pelo GitHub/gerenciador de credenciais. Não coloque tokens em arquivos do projeto.

## Depois de publicar

1. Confira se a página inicial mostra o README.
2. Abra Actions e acompanhe a execução de Testes de API referente ao commit enviado.
3. Confira se o relatório ficou disponível como artefato.
4. Preencha descrição e topics.
5. Fixe o repositório no seu perfil e adicione um link no README profissional.
6. Só adicione um badge de CI após verificar a URL real do workflow.

## Atualizações futuras

Use branches com nomes que descrevam a mudança e commits pequenos. Registre novos aprendizados no guia correspondente, junto com o código. Ao atualizar dependências ou imagens, repita os testes e atualize a evidência com a data real.

Não publique relatórios de carga como se fossem medições de produção. Mantenha o contexto do experimento visível.
