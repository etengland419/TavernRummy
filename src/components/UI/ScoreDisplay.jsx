import React from 'react';
import PropTypes from 'prop-types';

/**
 * ScoreDisplay Component
 * Shows player and AI scores with animations
 *
 * @param {Object} scores - Current scores {player, ai}
 * @param {string} scoreAnimation - 'player', 'ai', or null
 */
const ScoreDisplay = ({ scores, scoreAnimation }) => {
  return (
    <div className="flex justify-between items-center mb-6 px-8">
      <div className={`text-center transition-all duration-500 ${scoreAnimation === 'player' ? 'scale-110' : ''}`}>
        <div className="text-sm text-amber-400 uppercase font-bold">Your Gold</div>
        <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
          💰 {scores.player}
        </div>
      </div>

      <div className={`text-center transition-all duration-500 ${scoreAnimation === 'ai' ? 'scale-110' : ''}`}>
        <div className="text-sm text-amber-400 uppercase font-bold">Stranger's Gold</div>
        <div className="text-4xl font-bold text-pink-300 flex items-center gap-2">
          💰 {scores.ai}
        </div>
      </div>
    </div>
  );
};

ScoreDisplay.propTypes = {
  scores: PropTypes.shape({
    player: PropTypes.number.isRequired,
    ai: PropTypes.number.isRequired
  }).isRequired,
  scoreAnimation: PropTypes.string
};

export default ScoreDisplay;
