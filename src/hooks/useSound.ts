import { useState, useEffect, useCallback } from 'react';
import { soundManager, SoundType } from '../utils/soundManager';

export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.isMuted());

  useEffect(() => {
    setIsMuted(soundManager.isMuted());
    const unsubscribe = soundManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const toggleMute = useCallback(() => {
    return soundManager.toggleMute();
  }, []);

  const playSound = useCallback((type: SoundType) => {
    soundManager.play(type);
  }, []);

  return {
    isMuted,
    toggleMute,
    playSound,
  };
}
