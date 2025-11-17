import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * GameControls Component
 * Displays game control buttons (Knock, New Round)
 *
 * @param {Function} onKnock - Callback when knock button clicked
 * @param {Function} onNewRound - Callback when new round button clicked
 * @param {boolean} canKnock - Whether player can knock
 * @param {number} deadwood - Current deadwood value
 * @param {boolean} tutorialHighlight - Whether to highlight knock button
 */
const GameControls = ({ onKnock, onNewRound, canKnock, deadwood, tutorialHighlight }) => {
  const [isKnocking, setIsKnocking] = useState(false);

  const handleKnock = () => {
    setIsKnocking(true);
    setTimeout(() => setIsKnocking(false), 400);
    onKnock();
  };

  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={handleKnock}
        disabled={!canKnock}
        className={`
          px-6 py-3 rounded-lg font-bold text-lg border-3 transition-all transform
          ${canKnock
            ? `bg-green-700 hover:bg-green-600 border-green-500 text-white hover:scale-105 shadow-lg ${tutorialHighlight ? 'ring-4 ring-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`
            : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
          }
          ${isKnocking ? 'knock-bounce' : ''}
        `}
      >
        ⚔️ KNOCK ({deadwood})
      </button>

      <button
        onClick={onNewRound}
        className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-lg border-3 border-blue-500 transition-all hover:scale-105 shadow-lg"
      >
        🔄 NEW ROUND
      </button>
    </div>
  );
};

GameControls.propTypes = {
  onKnock: PropTypes.func.isRequired,
  onNewRound: PropTypes.func.isRequired,
  canKnock: PropTypes.bool.isRequired,
  deadwood: PropTypes.number.isRequired,
  tutorialHighlight: PropTypes.bool.isRequired
};

export default GameControls;
