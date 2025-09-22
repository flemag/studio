let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  // User interaction is required to start AudioContext
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

// A function to resume AudioContext on user gesture
export const resumeAudioContext = () => {
  const context = getAudioContext();
  if (context && context.state === 'suspended') {
    context.resume();
  }
}

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
