# Dropmind

Jogo educativo em JavaScript para navegador. Classifique os produtos antes de chegarem ao solo: **A** para agricultura, **P** para produção animal (agropecuária no jogo) **I** para agroindústria e **E** para extrativismo. Também é possível usar os botões na tela.

Cada acerto vale 10 pontos. A cada 5 acertos, o nível e a velocidade aumentam. Erros ou produtos no solo consomem uma das 3 vidas. Espaço pausa; o recorde fica salvo no navegador.

Use o **ícone de tela cheia no canto superior direito da área jogável** para expandir somente a área do jogo, com placar e controles. O mesmo ícone permite sair do modo expandido. Em celulares sem suporte à Fullscreen API, a área ocupa a tela por CSS. Também é possível sair com Esc.

## Som e ranking

A música de fundo original e os efeitos de acerto e erro são sintetizados com Web Audio, sem downloads de áudio. A música começa ao jogar e pausa junto com a partida. O botão **Som** silencia música e efeitos e salva sua preferência.

Ao terminar, informe seu nome para registrar a pontuação. O botão **Ranking** exibe as 10 maiores pontuações, em ordem decrescente. Cada partida pode ser registrada uma única vez; empates mantêm a ordem de registro. O ranking e o recorde são salvos no localStorage. O placar da última partida concluída também é restaurado ao recarregar a página; começar uma nova partida zera os pontos. Esses dados são locais ao navegador e não são compartilhados entre dispositivos. Se o armazenamento estiver bloqueado, os resultados ficam disponíveis apenas na sessão atual.

## Desenvolvimento

Requer Node.js 22 ou superior. Sem dependências de instalação.

```sh
npm start
```

O servidor usa a porta 3000, configurável por `PORT`. Abra o endereço do servidor em um navegador. Os arquivos HTML, CSS e JavaScript também podem ser publicados em hospedagem estática. As fontes externas são opcionais; o jogo funciona com fontes locais quando não estão disponíveis.

```sh
npm test
```

Extrativismo inclui produtos retirados da natureza: castanhas e açaí silvestres, peixe de pesca, látex de seringueira nativa e caranguejo do mangue. As descrições distinguem coleta silvestre de cultivo ou criação.
