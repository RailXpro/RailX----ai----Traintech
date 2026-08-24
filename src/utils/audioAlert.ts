// Web Audio API synthesizer for emergency sirens and operational chime sounds

let sharedAudioCtx: AudioContext | null = null;
let activeSirenOsc1: OscillatorNode | null = null;
let activeSirenOsc2: OscillatorNode | null = null;
let activeSirenGain: GainNode | null = null;

function getOrCreateAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn('AudioContext initialization error:', e);
    return null;
  }
}

export function stopEmergencyAlertSound(): void {
  try {
    if (activeSirenOsc1) {
      activeSirenOsc1.stop();
      activeSirenOsc1.disconnect();
      activeSirenOsc1 = null;
    }
    if (activeSirenOsc2) {
      activeSirenOsc2.stop();
      activeSirenOsc2.disconnect();
      activeSirenOsc2 = null;
    }
    if (activeSirenGain) {
      activeSirenGain.disconnect();
      activeSirenGain = null;
    }
  } catch {}
}

export function playEmergencyAlertSound(): boolean {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Clear any existing active siren
    stopEmergencyAlertSound();

    const now = ctx.currentTime;
    const duration = 2.4;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Two-tone alternating emergency siren
    const warbleCount = 4;
    const step = duration / (warbleCount * 2);
    for (let i = 0; i < warbleCount; i++) {
      const t = now + i * (step * 2);
      osc1.frequency.setValueAtTime(880, t);
      osc1.frequency.exponentialRampToValueAtTime(440, t + step);
      osc1.frequency.exponentialRampToValueAtTime(880, t + step * 2);

      osc2.frequency.setValueAtTime(440, t);
      osc2.frequency.exponentialRampToValueAtTime(220, t + step);
      osc2.frequency.exponentialRampToValueAtTime(440, t + step * 2);
    }

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.22, now + duration - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    activeSirenOsc1 = osc1;
    activeSirenOsc2 = osc2;
    activeSirenGain = gain;

    osc1.onended = () => {
      if (activeSirenOsc1 === osc1) {
        activeSirenOsc1 = null;
        activeSirenOsc2 = null;
        activeSirenGain = null;
      }
    };

    return true;
  } catch (e) {
    console.warn('Audio alert could not play:', e);
    return false;
  }
}

export function playOptimizationChime(): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Harmonious chord chime
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + i * 0.08;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } catch (e) {
    console.warn('Audio chime could not play:', e);
  }
}

