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
  const musicAudioRef = useRef(null);
  const isMusicPlayingRef = useRef(false);

  // Stop background music function (defined early for cleanup)
  const stopBackgroundMusic = useCallback(() => {
    isMusicPlayingRef.current = false;
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }
  }, []);

  // Initialize audio context and music audio element
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      // Create gain node for music (used for sound effects)
      musicGainRef.current = audioContextRef.current.createGain();
      musicGainRef.current.connect(audioContextRef.current.destination);

      // Create audio element for background music
      const audio = new Audio('/audio/tavern-music.mp3');
      audio.loop = true;
      audio.volume = musicVolume;
      musicAudioRef.current = audio;
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
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = isMuted ? 0 : musicVolume;
    }
  }, [musicVolume, isMuted]);

  /**
   * Play background music - 8-bit tavern music file
   */
  const playBackgroundMusic = useCallback(() => {
    if (!musicAudioRef.current || isMusicPlayingRef.current) return;

    try {
      isMusicPlayingRef.current = true;
      musicAudioRef.current.play().catch(error => {
        console.warn('Autoplay prevented. Music will start on user interaction:', error);
      });
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
