/**
 * Procedural Web Audio API sound generator for portfolio UI and arcade games.
 * Zero external audio files required - eliminates 404s and network latency.
 * Persists muted preference in localStorage ('portfolio_sound_muted').
 */

export type SoundType = 
  | 'click' 
  | 'toggle' 
  | 'switch' 
  | 'unmute' 
  | 'eat' 
  | 'power' 
  | 'die' 
  | 'start' 
  | 'clear' 
  | 'drop';

const STORAGE_KEY = 'portfolio_sound_muted';

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Default to false (sound enabled) or true if explicitly stored 'true'
      this.muted = saved === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(value: boolean) {
    this.muted = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(value));
    }
    this.notify();
    if (!value) {
      this.play('unmute');
    }
  }

  public toggleMute(): boolean {
    const nextState = !this.muted;
    this.setMuted(nextState);
    return nextState;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.muted));
  }

  public play(type: SoundType) {
    if (this.muted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (type) {
        case 'click': {
          // Subtle, modern micro-tick
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'toggle': {
          // Soft dual-frequency blip
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.setValueAtTime(740, now + 0.03);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'switch': {
          // Sleek mode transition sound
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'unmute': {
          // Cheerful feedback when sound is activated
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(880, now + 0.06);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
        }

        case 'eat': {
          // Retro game bite / pellet crunch
          osc.type = 'square';
          osc.frequency.setValueAtTime(480, now);
          osc.frequency.exponentialRampToValueAtTime(960, now + 0.07);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.005, now + 0.07);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'power': {
          // Arpeggiated power chime
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.linearRampToValueAtTime(680, now + 0.1);
          osc.frequency.linearRampToValueAtTime(1020, now + 0.2);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'die': {
          // Classic arcade falling pitch
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.32);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.start(now);
          osc.stop(now + 0.32);
          break;
        }

        case 'start': {
          // Ascending energetic start melody
          osc.type = 'sine';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case 'clear': {
          // Tetris line clear triumph sound
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.setValueAtTime(880, now + 0.08); // A5
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'drop': {
          // Tetris block slam
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
      }
    } catch {
      // Audio playback fails gracefully if browser restricts
    }
  }
}

export const soundManager = new SoundManager();
