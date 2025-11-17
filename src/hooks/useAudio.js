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
  const soundPoolRef = useRef(new Map());
  const saveTimerRef = useRef(null);

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
    const soundPool = soundPoolRef.current;

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

      // Pre-load all sound effects into a pool for instant playback
      const soundFiles = [
        'card-draw',
        'card-discard',
        'card-shuffle',
        'knock',
        'win',
        'lose',
        'gin',
        'undercut',
        'button-click',
        'achievement',
        'new-round',
        'match-win'
      ];

      soundFiles.forEach(soundName => {
        // Create multiple instances of each sound for overlapping playback
        const instances = [];
        for (let i = 0; i < 3; i++) {
          const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${soundName}.wav`);
          audio.preload = 'auto';
          audio.volume = sfxVolume;
          instances.push({
            audio,
            isPlaying: false
          });
        }
        soundPool.set(soundName, instances);
      });
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }

    return () => {
      stopBackgroundMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Cleanup sound pool
      soundPool.forEach(instances => {
        instances.forEach(({ audio }) => {
          audio.pause();
          audio.src = '';
        });
      });
      soundPool.clear();
    };
  }, [stopBackgroundMusic, musicVolume, sfxVolume]);

  // Save preferences to localStorage (debounced to prevent lag)
  useEffect(() => {
    localStorage.setItem('tavernRummy_audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    // Clear any pending save
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    // Debounce localStorage writes to prevent slider lag
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem('tavernRummy_musicVolume', musicVolume.toString());
    }, 300);
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [musicVolume]);

  useEffect(() => {
    // Clear any pending save
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    // Debounce localStorage writes to prevent slider lag
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem('tavernRummy_sfxVolume', sfxVolume.toString());
    }, 300);
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [sfxVolume]);

  // Update music volume in real-time
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = isMuted ? 0 : musicVolume;
    }
  }, [musicVolume, isMuted]);

  // Update SFX volume in real-time for all pooled sounds
  useEffect(() => {
    const volume = isMuted ? 0 : sfxVolume;
    soundPoolRef.current.forEach(instances => {
      instances.forEach(({ audio }) => {
        audio.volume = volume;
      });
    });
  }, [sfxVolume, isMuted]);

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
   * Play a sound effect from pre-loaded audio pool
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

      // Get sound instances from pool
      const instances = soundPoolRef.current.get(soundFileName);
      if (!instances || instances.length === 0) {
        console.warn(`Sound ${soundFileName} not found in pool`);
        return;
      }

      // Find an available instance or use the first one
      let availableInstance = instances.find(inst => !inst.isPlaying);
      if (!availableInstance) {
        // All instances are playing, use the first one and restart it
        availableInstance = instances[0];
      }

      const { audio } = availableInstance;

      // Reset and play the sound
      audio.currentTime = 0;
      audio.volume = sfxVolume;

      availableInstance.isPlaying = true;

      audio.play().then(() => {
        // Mark as not playing after it finishes
        setTimeout(() => {
          availableInstance.isPlaying = false;
        }, audio.duration * 1000);
      }).catch(error => {
        console.warn('Sound playback prevented:', error);
        availableInstance.isPlaying = false;
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
