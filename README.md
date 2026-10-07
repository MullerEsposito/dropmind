# Dropmind

Jogo educativo em JavaScript para navegador. Classifique os produtos antes de chegarem ao solo: **A** para agricultura, **P** para produção animal (agropecuária no jogo) e **I** para agroindústria. Também é possível usar os botões na tela.

Cada acerto vale 10 pontos. A cada 5 acertos, o nível e a velocidade aumentam. Erros ou produtos no solo consomem uma das 3 vidas. Espaço pausa; o recorde fica salvo no navegador.

Use **Tela cheia** no cabeçalho para expandir o jogo. O botão passa a **Sair da tela cheia**; também é possível sair com Esc. A opção depende do suporte do navegador.

## Som e ranking

A música de fundo original e os efeitos de acerto e erro são sintetizados com Web Audio, sem downloads de áudio. A música começa ao jogar e pausa junto com a partida. O botão **Som** silencia música e efeitos e salva sua preferência.

Ao terminar, informe seu nome para registrar a pontuação. O botão **Ranking** exibe as 10 maiores pontuações, em ordem decrescente. Cada partida pode ser registrada uma única vez; empates mantêm a ordem de registro. O ranking é local, salvo no navegador, e não é compartilhado entre dispositivos. Se o armazenamento estiver bloqueado, os resultados ficam disponíveis apenas na sessão atual.

## Desenvolvimento

Requer Node.js 22 ou superior. Sem dependências de instalação.

```sh
npm start
```

O servidor usa a porta 3000, configurável por `PORT`. Abra o endereço do servidor em um navegador. Os arquivos HTML, CSS e JavaScript também podem ser publicados em hospedagem estática. As fontes externas são opcionais; o jogo funciona com fontes locais quando não estão disponíveis.

```sh
npm test
```
