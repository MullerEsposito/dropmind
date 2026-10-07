import { products, origins, levelFor, durationFor } from './products.js';
import { createAudio } from './audio.js';
const $ = id => document.getElementById(id);
const audio = createAudio();
let muted = false, ranking = [], submitted = false, saving = false, roundId;
try {
  muted = localStorage.getItem('dropmind-muted') === 'true';
} catch {}
function soundButton() {
  audio.mute(muted); $('sound').textContent = muted ? 'Som: desligado' : 'Som: ligado';
  $('sound').setAttribute('aria-pressed', String(!muted));
}
soundButton();
$('sound').addEventListener('click', () => {
  muted = !muted; soundButton();
  try { localStorage.setItem('dropmind-muted', String(muted)); } catch {}
});
function showRanking() {
  if (state === 'playing') pause();
  $('ranking-form').hidden = state !== 'over' || submitted;
  $('ranking-status').textContent = '';
  ranking = []; renderRanking(); $('ranking-empty').hidden = true;
  $('ranking-dialog').showModal(); loadRanking();
}
function renderRanking() {
  $('ranking-list').replaceChildren();
  for (const entry of ranking) {
    const row = document.createElement('li'), name = document.createElement('span'), score = document.createElement('strong');
    name.textContent = entry.name; score.textContent = `${entry.score} pontos`;
    row.append(name, score); $('ranking-list').append(row);
  }
  $('ranking-empty').hidden = ranking.length > 0;
}
$('ranking-button').addEventListener('click', showRanking);
async function rankingRequest(options) {
  const response = await fetch('/api/ranking', { ...options, signal: AbortSignal.timeout(10000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Ranking indisponível.');
  return data.ranking;
}
async function loadRanking() {
  $('ranking-status').textContent = 'Carregando ranking global…';
  try { const result = await rankingRequest(); if (!saving && !submitted) { ranking = result; renderRanking(); $('ranking-status').textContent = ''; } }
  catch (error) { if (!saving && !submitted) $('ranking-status').textContent = error.message; }
}
$('ranking-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (state !== 'over' || submitted || saving) return;
  const name = $('player-name').value.trim().slice(0, 24);
  if (!name) { $('ranking-status').textContent = 'Digite seu nome para salvar.'; $('player-name').focus(); return; }
  saving = true; const button = $('ranking-form').querySelector('button'); button.disabled = true;
  $('ranking-status').textContent = 'Salvando pontuação…';
  try {
    ranking = await rankingRequest({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, score: hits * 10, id: roundId }) });
    submitted = true; $('ranking-form').hidden = true; renderRanking();
    $('ranking-status').textContent = 'Pontuação registrada no ranking global!';
  } catch (error) { $('ranking-status').textContent = `${error.message} Sua pontuação não foi enviada. Tente salvar novamente.`; }
  finally { saving = false; button.disabled = false; }
});
let best = 0;
try { best = Number(localStorage.getItem('dropmind-best')) || 0; } catch {}
let lastScore = 0;
try { const saved = Number(localStorage.getItem('dropmind-last-score')); if (Number.isFinite(saved) && saved >= 0 && saved % 10 === 0) lastScore = saved; } catch {}
let state = 'idle', hits = lastScore / 10, lives = 3, elapsed = 0, last = 0, current, previous = -1;
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
  submitted = false; roundId = crypto.randomUUID(); audio.start();
  hits = 0; lives = 3; state = 'playing'; last = performance.now();
  $('overlay').hidden = true; $('pause').disabled = false; $('pause').textContent = 'Pausar';
  $('feedback').textContent = 'Escolha a origem do produto antes que ele chegue ao solo.';
  stats(); next();
}
function finish() {
  audio.stop();
  state = 'over'; $('product').hidden = true; $('pause').disabled = true;
  best = Math.max(best, hits * 10);
  try { localStorage.setItem('dropmind-best', String(best)); localStorage.setItem('dropmind-last-score', String(hits * 10)); } catch {}
  $('title').textContent = 'Uma nova colheita te espera!';
  $('description').textContent = `${hits * 10} pontos · ${hits} acertos · nível ${levelFor(hits)}. Tente superar seu recorde!`;
  $('start').textContent = 'Jogar novamente →'; $('overlay').hidden = false; stats();
  showRanking();
}
function answer(origin) {
  if (state !== 'playing') return;
  const name = current.name;
  audio.effect(origin === current.origin);
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
    audio.stop();
    state = 'paused'; $('overlay').hidden = false;
    $('title').textContent = 'Uma pausa na colheita'; $('description').textContent = 'Respire. Seu progresso está guardado nesta partida.';
    $('start').textContent = 'Continuar →'; $('pause').textContent = 'Continuar';
  } else if (state === 'paused') {
    audio.start();
    state = 'playing'; last = performance.now(); $('overlay').hidden = true; $('pause').textContent = 'Pausar';
  }
}
$('start').addEventListener('click', () => state === 'paused' ? pause() : start());
$('pause').addEventListener('click', pause);
function syncFullscreen() {
  const active = $('game').classList.contains('expanded') || document.fullscreenElement === $('game');
  document.body.classList.toggle('game-expanded', active);
  const label = active ? 'Sair da tela cheia' : 'Entrar em tela cheia';
  $('fullscreen').setAttribute('aria-label', label);
  $('fullscreen').title = label;
  $('fullscreen-icon').setAttribute('d', active ? 'M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5' : 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5');
  $('fullscreen').setAttribute('aria-pressed', String(active));
  if (current) render();
}
async function toggleFullscreen() {
  if ($('game').classList.contains('expanded') || document.fullscreenElement === $('game')) {
    if (document.fullscreenElement === $('game')) await document.exitFullscreen();
    $('game').classList.remove('expanded');
  } else {
    $('game').classList.add('expanded');
    // A expansão por CSS também funciona em celulares sem Fullscreen API.
    if (document.fullscreenEnabled && $('game').requestFullscreen) {
      try { await $('game').requestFullscreen(); } catch { /* Mantém o modo expandido. */ }
    }
  }
  syncFullscreen();
}
$('fullscreen').addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) $('game').classList.remove('expanded');
  syncFullscreen();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !document.fullscreenElement && !$('ranking-dialog').open && $('game').classList.contains('expanded')) toggleFullscreen();
});
window.addEventListener('resize', () => { if (current) render(); });
document.querySelectorAll('[data-origin]').forEach(button => button.addEventListener('click', () => answer(Number(button.dataset.origin))));
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || $('help').open || $('ranking-dialog').open || event.target.closest('input, textarea, [contenteditable]')) return;
  const origin = ['a', 'p', 'i', 'e'].indexOf(event.key.toLowerCase());
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
