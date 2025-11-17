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
      const audio = new Audio(`${process.env.PUBLIC_URL}/audio/tavern-music.mp3`);
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
  }, [stopBackgroundMusic, musicVolume]);

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
      // Resume AudioContext if it's suspended (required by browser autoplay policies)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          console.log('AudioContext resumed successfully');
        }).catch(error => {
          console.warn('Failed to resume AudioContext:', error);
        });
      }

      isMusicPlayingRef.current = true;
      musicAudioRef.current.play().catch(error => {
        console.warn('Autoplay prevented. Music will start on user interaction:', error);
        isMusicPlayingRef.current = false;
      });
    } catch (error) {
      console.error('Error playing background music:', error);
      isMusicPlayingRef.current = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Play a sound effect from audio file
   */
  const playSound = useCallback((soundFileName) => {
    if (isMuted) return;

    try {
      // Resume AudioContext if it's suspended (required by browser autoplay policies)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(error => {
          console.warn('Failed to resume AudioContext:', error);
        });
      }

      const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${soundFileName}.wav`);
      audio.volume = sfxVolume;
      audio.play().catch(error => {
        console.warn('Sound playback prevented:', error);
      });
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
    cardDraw: () => playSound('card-draw'),
    cardDiscard: () => playSound('card-discard'),
    cardShuffle: () => playSound('card-shuffle'),
    knock: () => playSound('knock'),
    win: () => playSound('win'),
    lose: () => playSound('lose'),
    gin: () => playSound('gin'),
    undercut: () => playSound('undercut'),
    buttonClick: () => playSound('button-click'),
    achievement: () => playSound('achievement'),
    newRound: () => playSound('new-round'),
    matchWin: () => playSound('match-win'),
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
