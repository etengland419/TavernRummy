import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * AudioControls Component
 * Displays mute button and volume slider for game audio
 *
 * @param {boolean} isMuted - Whether audio is muted
 * @param {number} volume - Current volume level (0-1)
 * @param {Function} onToggleMute - Callback to toggle mute
 * @param {Function} onVolumeChange - Callback to change volume
 */
const AudioControls = ({ isMuted, volume, onToggleMute, onVolumeChange }) => {
  const [showSlider, setShowSlider] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {/* Volume Slider */}
      {showSlider && (
        <div className="bg-gray-900 bg-opacity-90 p-3 rounded-lg border-2 border-amber-600 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-amber-300 text-sm font-semibold">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                accentColor: '#f59e0b'
              }}
            />
            <span className="text-amber-300 text-sm font-mono w-10">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Mute/Volume Button */}
      <button
        onClick={() => setShowSlider(!showSlider)}
        onMouseEnter={() => setShowSlider(true)}
        className="px-3 py-2 bg-gray-900 bg-opacity-90 border-2 border-amber-600 rounded-lg
                   hover:bg-amber-900 transition-all shadow-lg text-2xl"
        title={isMuted ? 'Unmute' : 'Mute'}
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

      {/* Close slider when mouse leaves the area */}
      {showSlider && (
        <div
          className="fixed inset-0 z-30"
          onMouseEnter={() => setShowSlider(false)}
        />
      )}
    </div>
  );
};

AudioControls.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired
};

export default AudioControls;
