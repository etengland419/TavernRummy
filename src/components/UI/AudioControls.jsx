import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AudioControls Component
 * Displays mute button and volume slider for music only
 *
 * @param {boolean} isMuted - Whether audio is muted
 * @param {number} musicVolume - Current music volume level (0-1)
 * @param {Function} onToggleMute - Callback to toggle mute
 * @param {Function} onMusicVolumeChange - Callback to change music volume
 */
const AudioControls = ({
  isMuted,
  musicVolume,
  onToggleMute,
  onMusicVolumeChange
}) => {
  const [showSlider, setShowSlider] = useState(false);
  const sliderRef = useRef(null);
  const buttonRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Close slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSlider &&
        sliderRef.current &&
        buttonRef.current &&
        !sliderRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [showSlider]);

  const handleMouseLeave = () => {
    // Delay closing to allow user to move between button and slider
    closeTimerRef.current = setTimeout(() => {
      setShowSlider(false);
    }, 800);
  };

  const handleMouseEnter = () => {
    // Cancel any pending close
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMusicVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onMusicVolumeChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || musicVolume === 0) return '🔇';
    if (musicVolume < 0.3) return '🔈';
    if (musicVolume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <div
      className="fixed top-4 right-4 z-40 flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Volume Slider */}
      {showSlider && (
        <div
          ref={sliderRef}
          className="bg-gray-900 bg-opacity-95 p-4 rounded-lg border-2 border-amber-600 shadow-xl"
        >
          {/* Music Volume Slider */}
          <div className="flex items-center gap-3">
            <span className="text-amber-300 text-sm font-semibold w-16">🎵 Music</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                accentColor: '#f59e0b'
              }}
            />
            <span className="text-amber-300 text-sm font-mono w-10">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Volume Button */}
      <button
        ref={buttonRef}
        onClick={() => setShowSlider(!showSlider)}
        onMouseEnter={() => setShowSlider(true)}
        className="px-3 py-2 bg-gray-900 bg-opacity-90 border-2 border-amber-600 rounded-lg
                   hover:bg-amber-900 transition-all shadow-lg text-2xl"
        title="Volume Controls"
      >
        {getVolumeIcon()}
      </button>

      {/* Mute Toggle Button */}
      <button
        onClick={onToggleMute}
        className={`px-3 py-2 border-2 rounded-lg transition-all shadow-lg font-bold text-sm
                   ${isMuted
                     ? 'bg-red-900 bg-opacity-90 border-red-600 text-red-200 hover:bg-red-800'
                     : 'bg-gray-900 bg-opacity-90 border-amber-600 text-amber-300 hover:bg-amber-900'
                   }`}
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? 'MUTED' : 'SOUND ON'}
      </button>
    </div>
  );
};

AudioControls.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  musicVolume: PropTypes.number.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  onMusicVolumeChange: PropTypes.func.isRequired
};

export default AudioControls;
