import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ScoreDisplay Component
 * Shows player and AI scores with animations
 *
 * @param {Object} scores - Current scores {player, ai}
 * @param {string} scoreAnimation - 'player', 'ai', or null
 */
const ScoreDisplay = ({ scores, scoreAnimation }) => {
  const [displayPlayerScore, setDisplayPlayerScore] = useState(scores.player);
  const [displayAiScore, setDisplayAiScore] = useState(scores.ai);

  useEffect(() => {
    // Animate score change
    const playerDiff = scores.player - displayPlayerScore;
    const aiDiff = scores.ai - displayAiScore;

    if (playerDiff !== 0) {
      const steps = Math.abs(playerDiff);
      const stepDuration = 300 / steps;
      let current = displayPlayerScore;

      const interval = setInterval(() => {
        current += playerDiff > 0 ? 1 : -1;
        setDisplayPlayerScore(current);
        if (current === scores.player) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }

    if (aiDiff !== 0) {
      const steps = Math.abs(aiDiff);
      const stepDuration = 300 / steps;
      let current = displayAiScore;

      const interval = setInterval(() => {
        current += aiDiff > 0 ? 1 : -1;
        setDisplayAiScore(current);
        if (current === scores.ai) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [scores.player, scores.ai, displayPlayerScore, displayAiScore]);

  return (
    <div className="flex justify-between items-center mb-6 px-8">
      <div className={`text-center transition-all duration-500 ${scoreAnimation === 'player' ? 'scale-110' : ''}`}>
        <div className="text-sm text-amber-400 uppercase font-bold">Your Gold</div>
        <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
          💰 <span>{displayPlayerScore}</span>
        </div>
      </div>

      <div className={`text-center transition-all duration-500 ${scoreAnimation === 'ai' ? 'scale-110' : ''}`}>
        <div className="text-sm text-amber-400 uppercase font-bold">Stranger's Gold</div>
        <div className="text-4xl font-bold text-pink-300 flex items-center gap-2">
          💰 <span>{displayAiScore}</span>
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
