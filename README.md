# Dropmind

Jogo educativo em JavaScript para navegador. Classifique os produtos antes de chegarem ao solo: **A** para agricultura, **P** para produção animal (agropecuária no jogo) e **I** para agroindústria. Também é possível usar os botões na tela.

Cada acerto vale 10 pontos. A cada 5 acertos, o nível e a velocidade aumentam. Erros ou produtos no solo consomem uma das 3 vidas. Espaço pausa; o recorde fica salvo no navegador.

Use **Tela cheia** no cabeçalho para expandir o jogo. O botão passa a **Sair da tela cheia**; também é possível sair com Esc. A opção depende do suporte do navegador.

## Desenvolvimento

Requer Node.js 22 ou superior. Sem dependências de instalação.

```sh
npm start
```

O servidor usa a porta 3000, configurável por `PORT`. Abra o endereço do servidor em um navegador. Os arquivos HTML, CSS e JavaScript também podem ser publicados em hospedagem estática. As fontes externas são opcionais; o jogo funciona com fontes locais quando não estão disponíveis.

```sh
npm test
```
