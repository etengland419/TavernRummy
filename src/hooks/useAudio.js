import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing game audio
 * Handles background music, sound effects, mute, and volume control
 */
export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('tavernRummy_audioMuted');
    return saved ? JSON.parse(saved) : false;
  });

  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('tavernRummy_musicVolume');
    return saved ? parseFloat(saved) : 0.3;
  });

  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('tavernRummy_sfxVolume');
    return saved ? parseFloat(saved) : 0.5;
  });

  const audioContextRef = useRef(null);
  const musicGainRef = useRef(null);
  const musicOscillatorsRef = useRef([]);
  const isMusicPlayingRef = useRef(false);

  // Stop background music function (defined early for cleanup)
  const stopBackgroundMusic = useCallback(() => {
    isMusicPlayingRef.current = false;
    musicOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator already stopped
      }
    });
    musicOscillatorsRef.current = [];
  }, []);

  // Initialize audio context
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      // Create gain node for music
      musicGainRef.current = audioContextRef.current.createGain();
      musicGainRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }

    return () => {
      stopBackgroundMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBackgroundMusic]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('tavernRummy_audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('tavernRummy_musicVolume', musicVolume.toString());
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem('tavernRummy_sfxVolume', sfxVolume.toString());
  }, [sfxVolume]);

  // Update music volume in real-time
  useEffect(() => {
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = isMuted ? 0 : musicVolume * 0.15;
    }
  }, [musicVolume, isMuted]);

  /**
   * Play background music - simple tavern-style melody
   */
  const playBackgroundMusic = useCallback(() => {
    if (!audioContextRef.current || isMusicPlayingRef.current) return;

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      isMusicPlayingRef.current = true;

      // Simple tavern melody using chord progressions
      const melody = [
        { freq: 261.63, duration: 0.5 }, // C4
        { freq: 329.63, duration: 0.5 }, // E4
        { freq: 392.00, duration: 0.5 }, // G4
        { freq: 329.63, duration: 0.5 }, // E4
        { freq: 293.66, duration: 0.5 }, // D4
        { freq: 349.23, duration: 0.5 }, // F4
        { freq: 392.00, duration: 0.5 }, // G4
        { freq: 349.23, duration: 0.5 }, // F4
      ];

      const playMelodyLoop = (startTime = audioContextRef.current.currentTime) => {
        if (!isMusicPlayingRef.current) return;

        let currentTime = startTime;
        const oscillators = [];

        melody.forEach(note => {
          const osc = audioContextRef.current.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = note.freq;
          osc.connect(musicGainRef.current);
          osc.start(currentTime);
          osc.stop(currentTime + note.duration);
          oscillators.push(osc);
          currentTime += note.duration;
        });

        musicOscillatorsRef.current = oscillators;

        // Loop the melody
        const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
        setTimeout(() => {
          if (isMusicPlayingRef.current) {
            playMelodyLoop();
          }
        }, totalDuration * 1000);
      };

      playMelodyLoop();
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Play a sound effect using Web Audio API
   */
  const playSound = useCallback((soundType, frequency = 440, duration = 100) => {
    if (isMuted || !audioContextRef.current) return;

    try {
      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Apply sound effects volume
      const currentVolume = sfxVolume * 0.15; // Keep it reasonable
      gainNode.gain.setValueAtTime(currentVolume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted, sfxVolume]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const changeMusicVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setMusicVolume(clampedVolume);
  }, []);

  const changeSfxVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setSfxVolume(clampedVolume);
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
    musicVolume,
    sfxVolume,
    toggleMute,
    changeMusicVolume,
    changeSfxVolume,
    playSound,
    sounds,
    playBackgroundMusic,
    stopBackgroundMusic
  };
};
