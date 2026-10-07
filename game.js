import { products, origins, levelFor, durationFor } from './products.js';
const $ = id => document.getElementById(id);
let best = 0;
try { best = Number(localStorage.getItem('dropmind-best')) || 0; } catch {}
let state = 'idle', hits = 0, lives = 3, elapsed = 0, last = 0, current, previous = -1;
function stats() {
  $('score').textContent = hits * 10;
  $('level').textContent = String(levelFor(hits)).padStart(2, '0');
  $('lives').textContent = '♥ '.repeat(lives) + '♡ '.repeat(3 - lives);
  $('lives').setAttribute('aria-label', `${lives} vidas`);
  $('best').textContent = `RECORDE: ${best} PONTOS`;
}
function next() {
  let index;
  do { index = Math.floor(Math.random() * products.length); } while (index === previous);
  previous = index; current = products[index]; elapsed = 0;
  $('icon').textContent = current.icon; $('name').textContent = current.name;
  $('product').hidden = false; render();
}
function render() {
  const distance = Math.max(0, $('field').clientHeight - 27 - $('product').offsetHeight);
  $('product').style.transform = `translate(-50%, ${Math.min(1, elapsed / durationFor(levelFor(hits))) * distance}px)`;
}
function start() {
  hits = 0; lives = 3; state = 'playing'; last = performance.now();
  $('overlay').hidden = true; $('pause').disabled = false; $('pause').textContent = 'Pausar';
  $('feedback').textContent = 'Escolha a origem do produto antes que ele chegue ao solo.';
  stats(); next();
}
function finish() {
  state = 'over'; $('product').hidden = true; $('pause').disabled = true;
  best = Math.max(best, hits * 10);
  try { localStorage.setItem('dropmind-best', String(best)); } catch {}
  $('title').textContent = 'Uma nova colheita te espera!';
  $('description').textContent = `${hits * 10} pontos · ${hits} acertos · nível ${levelFor(hits)}. Tente superar seu recorde!`;
  $('start').textContent = 'Jogar novamente →'; $('overlay').hidden = false; stats();
}
function answer(origin) {
  if (state !== 'playing') return;
  const name = current.name;
  if (origin === current.origin) {
    hits++;
    $('feedback').textContent = `✓ ${name}: ${origins[origin]}!${hits % 5 === 0 ? ` Nível ${levelFor(hits)} — a queda acelerou!` : ' +10 pontos'}`;
  } else {
    lives--;
    $('feedback').textContent = `${origin === -1 ? 'O produto chegou ao solo.' : 'Quase!'} ${name} vem da ${origins[current.origin]}.`;
  }
  stats(); if (!lives) finish(); else next();
}
function pause() {
  if (state === 'playing') {
    state = 'paused'; $('overlay').hidden = false;
    $('title').textContent = 'Uma pausa na colheita'; $('description').textContent = 'Respire. Seu progresso está guardado nesta partida.';
    $('start').textContent = 'Continuar →'; $('pause').textContent = 'Continuar';
  } else if (state === 'paused') {
    state = 'playing'; last = performance.now(); $('overlay').hidden = true; $('pause').textContent = 'Pausar';
  }
}
$('start').addEventListener('click', () => state === 'paused' ? pause() : start());
$('pause').addEventListener('click', pause);
document.querySelectorAll('[data-origin]').forEach(button => button.addEventListener('click', () => answer(Number(button.dataset.origin))));
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || $('help').open) return;
  const origin = ['a', 'p', 'i'].indexOf(event.key.toLowerCase());
  if (origin !== -1) { event.preventDefault(); answer(origin); }
  if (event.code === 'Space' && event.target.tagName !== 'BUTTON') { event.preventDefault(); pause(); }
});
$('soundless').addEventListener('click', () => { if (state === 'playing') pause(); $('help').showModal(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pause(); });
function tick(now) {
  if (state === 'playing') { elapsed += now - last; render(); if (elapsed >= durationFor(levelFor(hits))) answer(-1); }
  last = now; requestAnimationFrame(tick);
}
stats(); requestAnimationFrame(tick);
