import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import ranking from './api/ranking.js';
const files = { '/': ['index.html', 'text/html'], '/style.css': ['style.css', 'text/css'], '/game.js': ['game.js', 'text/javascript'], '/products.js': ['products.js', 'text/javascript'], '/audio.js': ['audio.js', 'text/javascript'] };
createServer(async (req, res) => {
  if (new URL(req.url, 'http://localhost').pathname === '/api/ranking') return ranking(req, res);
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Não encontrado'); return; }
  try { res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8` }); res.end(await readFile(new URL(file[0], import.meta.url))); }
  catch { res.writeHead(500); res.end('Erro ao carregar o jogo'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Dropmind iniciado na porta ' + (process.env.PORT || 3000)));
