import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for managing game audio
 * Handles background music, sound effects, mute, and volume control
 */
export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('tavernRummy_audioMuted');
    return saved ? JSON.parse(saved) : false;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('tavernRummy_volume');
    return saved ? parseFloat(saved) : 0.5;
  });

  // Initialize audio context
  useEffect(() => {
    // We'll use HTML5 Audio for simplicity instead of Web Audio API
    // In a production app, you'd load actual audio files here
    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('tavernRummy_audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('tavernRummy_volume', volume.toString());
  }, [volume]);

  /**
   * Play a sound effect
   * For now, we'll use a simple beep generator as placeholder
   * In production, you'd load actual audio files
   */
  const playSound = useCallback((soundType, frequency = 440, duration = 100) => {
    if (isMuted) return;

    try {
      // For now, we'll just log the sound since we don't have actual audio files
      // In production, you'd do: new Audio('/sounds/soundType.mp3').play()
      console.log(`[Audio] Playing sound: ${soundType} (muted: ${isMuted}, volume: ${volume})`);

      // You can add actual Web Audio API beeps here for testing:
      // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // const oscillator = audioContext.createOscillator();
      // const gainNode = audioContext.createGain();
      // oscillator.connect(gainNode);
      // gainNode.connect(audioContext.destination);
      // oscillator.frequency.value = frequency;
      // gainNode.gain.value = volume * 0.1; // Keep it quiet
      // oscillator.start();
      // oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted, volume]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  // Sound effect shortcuts
  const sounds = {
    cardDraw: () => playSound('cardDraw', 400, 100),
    cardDiscard: () => playSound('cardDiscard', 350, 120),
    cardShuffle: () => playSound('cardShuffle', 300, 150),
    knock: () => playSound('knock', 200, 200),
    win: () => playSound('win', 600, 300),
    lose: () => playSound('lose', 250, 300),
    gin: () => playSound('gin', 700, 400),
    undercut: () => playSound('undercut', 450, 350),
    buttonClick: () => playSound('buttonClick', 500, 80),
    achievement: () => playSound('achievement', 800, 350),
    newRound: () => playSound('newRound', 550, 150),
    matchWin: () => playSound('matchWin', 900, 500),
  };

  return {
    isMuted,
    volume,
    toggleMute,
    changeVolume,
    playSound,
    sounds
  };
};
