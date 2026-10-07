# Dropmind

Jogo educativo em JavaScript para navegador. Classifique os produtos antes de chegarem ao solo: **A** para agricultura, **P** para produção animal (agropecuária no jogo) **I** para agroindústria e **E** para extrativismo. Também é possível usar os botões na tela.

Cada acerto vale 10 pontos. A cada 5 acertos, o nível e a velocidade aumentam. Erros ou produtos no solo consomem uma das 3 vidas. Espaço pausa; o recorde fica salvo no navegador.

Use o **ícone de tela cheia no canto superior direito da área jogável** para expandir somente a área do jogo, com placar e controles. O mesmo ícone permite sair do modo expandido. Em celulares sem suporte à Fullscreen API, a área ocupa a tela por CSS. Também é possível sair com Esc.

## Som e ranking

A música de fundo original e os efeitos de acerto e erro são sintetizados com Web Audio, sem downloads de áudio. A música começa ao jogar e pausa junto com a partida. O botão **Som** silencia música e efeitos e salva sua preferência.

Ao terminar, informe seu nome para registrar a pontuação no ranking global. O botão **Ranking** exibe as 10 maiores pontuações compartilhadas entre navegadores e dispositivos. Recorde pessoal e última pontuação continuam no localStorage. Pontuações antigas do ranking local não são migradas automaticamente.

## Configurar o ranking global

Na Vercel, abra **Storage / Marketplace**, crie um banco **Upstash Redis** e conecte ao projeto Dropmind, incluindo o ambiente Production. A integração deve fornecer `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` (também são aceitos `KV_REST_API_URL` e `KV_REST_API_TOKEN`). Faça um redeploy após conectar. Nunca coloque o token no JavaScript do navegador ou no Git.

A função `api/ranking.js` consulta e registra pontuações no Redis. O deploy precisa incluir essa função, além de `dist/`. Para desenvolvimento local, configure essas variáveis no processo antes de executar `npm start`. Sem o banco, o jogo funciona e o ranking informa que ainda não foi configurado. Para verificar a conexão, consulte `/api/ranking`: deve responder com status 200 e `{ "ranking": [] }` ou as pontuações existentes.

O ranking é recreativo: a pontuação vem do cliente e pode ser manipulada. Há validação de nome e pontuação e proteção contra duplicação de uma mesma submissão, mas não há autenticação nem validação das partidas no servidor.


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

## Publicar na Vercel

Importe `MullerEsposito/dropmind` na Vercel e selecione a branch `main`. O arquivo `vercel.json` configura a geração do site com `npm run build` e a publicação de `dist/`. O jogo é estático; a função do ranking roda na Vercel e requer as variáveis Redis descritas acima. Após conectar o repositório, novos pushes na branch de produção geram novas publicações.

Para validar a geração localmente, execute `npm run build`. O ranking é global quando o Redis está configurado. O recorde pessoal do localStorage continua restrito ao navegador e domínio.
