# Estudo: teste de pico

O cenário `spike.yaml` explora como a API reage quando a chegada de usuários aumenta e depois diminui.

| Fase | Duração | Novos usuários virtuais por segundo |
| --- | --- | --- |
| warmup | 30 s | 5 |
| ramp-up | 20 s | 5 → 20 |
| spike | 30 s | 100 |
| drop | 10 s | 100 → 10 |
| recovery | 10 s | 5 |

As fases geram usuários durante 100 segundos. A execução pode durar mais enquanto usuários ativos concluem suas requisições.

## Usuários não são requisições

`arrivalRate: 100` cria 100 novos usuários virtuais por segundo. Um usuário do fluxo completo faz login, cria um link e lista os links. Assim, a taxa de requisições difere da taxa de chegada de usuários.

O CSV contém credenciais reutilizáveis; não limita a carga a 2.000 requisições nem garante 2.000 usuários simultâneos distintos.

## Perguntas para analisar

1. O p95 sobe no pico?
2. Aparecem timeouts ou respostas inesperadas?
3. A latência retorna ao patamar inicial durante a recuperação?
4. Todos os usuários criados pelo gerador conseguem concluir o fluxo?
5. CPU, memória ou banco explicam a mudança?

O tempo de resposta HTTP não representa sozinho a duração completa da jornada do usuário.

## Registro de um experimento

Anote versão da imagem, configuração do computador, quantidade de dados existentes, perfil de carga, data e comandos. Guarde uma síntese com os resultados e limitações em `docs/evidence`. Relatórios brutos ficam em `reports`.

Não há limite universal de p95 definido aqui. Um critério de aprovação precisa nascer de uma necessidade do sistema e ser avaliado em um ambiente representativo.
