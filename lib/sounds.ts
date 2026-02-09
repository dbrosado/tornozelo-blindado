// Sound effects for timer mode

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported');
      return null;
    }
  }
  return audioContext;
}

// Play a simple beep sound
export function playBeep(frequency: number = 800, duration: number = 150, volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.start(ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
  oscillator.stop(ctx.currentTime + duration / 1000);
}

// Countdown beeps (3, 2, 1)
export function playCountdownBeep() {
  playBeep(600, 100, 0.4);
}

// "Go" beep - higher pitch
export function playGoBeep() {
  playBeep(1000, 200, 0.5);
}

// Exercise complete beep
export function playCompleteBeep() {
  playBeep(800, 100, 0.3);
  setTimeout(() => playBeep(1000, 100, 0.3), 150);
  setTimeout(() => playBeep(1200, 200, 0.4), 300);
}

// Rest start beep (lower, softer)
export function playRestBeep() {
  playBeep(400, 200, 0.2);
}

// Workout finished fanfare
export function playFinishFanfare() {
  playBeep(800, 150, 0.4);
  setTimeout(() => playBeep(1000, 150, 0.4), 200);
  setTimeout(() => playBeep(1200, 150, 0.4), 400);
  setTimeout(() => playBeep(1600, 300, 0.5), 600);
}
