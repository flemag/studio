let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return null;
    }
  }
  return audioContext;
};

export const resumeAudioContext = () => {
  const context = getAudioContext();
  if (context && context.state === 'suspended') {
    context.resume();
  }
};

const playSound = (type: OscillatorType, frequency: number, duration: number, volume: number = 0.1) => {
  const context = getAudioContext();
  if (!context || context.state === 'suspended') return;

  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
};

export const playJumpSound = () => {
  const context = getAudioContext();
  if (!context || context.state === 'suspended') return;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(300, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(500, context.currentTime + 0.15);

  gainNode.gain.setValueAtTime(0.08, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.15);
};

export const playBitSound = () => {
  playSound('triangle', 880, 0.08, 0.05);
  setTimeout(() => playSound('triangle', 1175, 0.1, 0.05), 60);
};

export const playGameOverSound = () => {
  const context = getAudioContext();
  if (!context || context.state === 'suspended') return;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(400, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.8);

  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.8);
};

export const playPowerUpCollectSound = () => {
  // A rising, pleasant sound
  playSound('sine', 523.25, 0.1, 0.1);
  setTimeout(() => playSound('sine', 659.25, 0.1, 0.1), 80);
  setTimeout(() => playSound('sine', 783.99, 0.15, 0.1), 160);
};

export const playDoubleJumpSound = () => {
  // A quick "whoosh"
  const context = getAudioContext();
  if (!context || context.state === 'suspended') return;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
};

export const playShieldBreakSound = () => {
  // A noisy, breaking sound
  playSound('sawtooth', 300, 0.4, 0.15);
  playSound('square', 200, 0.4, 0.15);
};


// --- Background Music ---

let musicScheduler: number | null = null;
let isMusicPlaying = false;
let currentNote = 0;
let nextNoteTime = 0.0;

// A simple C major pentatonic scale for a pleasant, ambient feel
const scale = {
  C4: 261.63, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25, E5: 659.25, G5: 783.99, A5: 880.00,
};

const sequence = [
  scale.C4, scale.E4, scale.G4, scale.A4,
  scale.C5, scale.A4, scale.G4, scale.E4,
];

const noteDuration = 0.25;
const tempo = 130;
const secondsPerBeat = 60.0 / tempo;

const scheduleNote = (noteTime: number) => {
  const context = getAudioContext();
  if (!context) return;

  const freq = sequence[currentNote];

  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(freq, noteTime);

  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0.04, noteTime); // Low volume for ambient music
  gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDuration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(noteTime);
  oscillator.stop(noteTime + noteDuration);

  currentNote = (currentNote + 1) % sequence.length;
};

const scheduler = () => {
  const context = getAudioContext();
  if (!context || !isMusicPlaying) return;

  const lookahead = 0.1; // How far ahead to schedule audio (sec)
  while (nextNoteTime < context.currentTime + lookahead) {
    scheduleNote(nextNoteTime);
    nextNoteTime += secondsPerBeat;
  }
};

export const startMusic = () => {
  const context = getAudioContext();
  if (!context || isMusicPlaying) return;

  resumeAudioContext(); // Ensure context is running
  if (context.state === 'suspended') return;

  isMusicPlaying = true;
  currentNote = 0;
  nextNoteTime = context.currentTime;

  if (musicScheduler) clearInterval(musicScheduler);
  musicScheduler = window.setInterval(scheduler, 50); // Check every 50ms
};

export const stopMusic = () => {
  if (!isMusicPlaying) return;
  isMusicPlaying = false;
  if (musicScheduler) {
    clearInterval(musicScheduler);
    musicScheduler = null;
  }
};
