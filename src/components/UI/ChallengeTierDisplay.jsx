import React from 'react';
import PropTypes from 'prop-types';
import { getProgressDisplay } from '../../utils/challengeUtils';

/**
 * ChallengeTierDisplay Component
 * Displays the current Challenge Mode tier and win streak progress
 *
 * @param {number} winStreak - Current win streak
 * @param {boolean} compact - Whether to show compact version (default: false)
 */
const ChallengeTierDisplay = ({ winStreak, compact = false }) => {
  const progress = getProgressDisplay(winStreak);

  if (compact) {
    // Compact version for in-game display
    return (
      <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-3 rounded-lg border-2 border-purple-500 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{progress.current.icon}</span>
            <div>
              <div className="text-purple-200 text-xs">Challenge Tier</div>
              <div className="text-white font-bold">{progress.current.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-200 text-xs">Win Streak</div>
            <div className="text-yellow-400 font-bold text-xl">{winStreak}</div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for modals/screens
  return (
    <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-6 rounded-lg border-4 border-purple-500 shadow-2xl">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">{progress.current.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-1">
          {progress.current.name}
        </h2>
        <p className="text-purple-300">
          {progress.current.difficulty}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-200 mb-1">
          <span>Win Streak: {winStreak}</span>
          {!progress.isMaxTier && (
            <span>Next Tier: {progress.next.winsRequired} wins</span>
          )}
        </div>

        {!progress.isMaxTier ? (
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        ) : (
          <div className="text-center text-yellow-400 font-bold animate-pulse">
            ♾️ MAXIMUM TIER REACHED ♾️
          </div>
        )}
      </div>

      {!progress.isMaxTier && (
        <div className="text-center text-sm text-purple-300">
          Next: {progress.next.icon} {progress.next.name} ({progress.next.threshold} wins)
        </div>
      )}
    </div>
  );
};

ChallengeTierDisplay.propTypes = {
  winStreak: PropTypes.number.isRequired,
  compact: PropTypes.bool
};

export default ChallengeTierDisplay;
