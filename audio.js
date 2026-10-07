// Música original sintetizada: não depende de arquivos ou serviços externos.
export function createAudio() {
  let context, master, timer, step = 0, playing = false, muted = false;
  const melody = [60, 64, 67, 72, 69, 67, 64, 62, 65, 69, 72, 74, 72, 69, 65, 67];
  function init() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return false;
      context = new Audio(); master = context.createGain(); master.gain.value = muted ? 0 : 0.55;
      master.connect(context.destination);
    }
    context.resume().catch(() => {}); return true;
  }
  function note(frequency, duration, volume, delay = 0, type = 'sine') {
    if (!context || muted) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain); gain.connect(master); oscillator.start(start); oscillator.stop(start + duration + 0.02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function beat() {
    if (!playing || muted) return;
    note(440 * 2 ** ((melody[step % melody.length] - 69) / 12), 0.3, 0.12, 0, 'triangle');
    if (step % 4 === 0) note(step % 16 < 8 ? 130.81 : 174.61, 0.8, 0.08);
    step++;
  }
  return {
    start() { playing = true; if (!init()) return; if (!timer) { beat(); timer = setInterval(beat, 350); } },
    stop() { playing = false; clearInterval(timer); timer = undefined; },
    mute(value) { muted = value; if (master) master.gain.setTargetAtTime(value ? 0 : 0.55, context.currentTime, 0.02); if (!value && playing) this.start(); },
    effect(correct) {
      if (muted || !init()) return;
      if (correct) { note(523.25, 0.15, 0.25); note(783.99, 0.25, 0.25, 0.1); }
      else { note(196, 0.2, 0.22, 0, 'triangle'); note(130.81, 0.3, 0.22, 0.12, 'triangle'); }
    }
  };
}
