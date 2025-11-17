import React from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

/**
 * StatsModal Component
 * Displays player statistics
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Object} stats - Statistics object
 * @param {Object} derivedStats - Calculated statistics
 * @param {Function} onClose - Callback when closing
 * @param {Function} onReset - Callback when resetting stats
 */
const StatsModal = ({ show, stats, derivedStats, onClose, onReset }) => {
  if (!show || !stats || !derivedStats) return null;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      onReset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">📊 Your Statistics</h2>
          <button
            onClick={onClose}
            className="text-3xl text-amber-400 hover:text-amber-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Overall Stats */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border-2 border-amber-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Overall Performance</h3>
            <div className="space-y-3 text-amber-100">
              <div className="flex justify-between">
                <span>Games Played:</span>
                <span className="font-bold text-yellow-400">{stats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span>Games Won:</span>
                <span className="font-bold text-green-400">{stats.gamesWon}</span>
              </div>
              <div className="flex justify-between">
                <span>Games Lost:</span>
                <span className="font-bold text-red-400">{stats.gamesLost || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Games Drawn:</span>
                <span className="font-bold text-blue-400">{stats.gamesDrawn || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-bold text-yellow-400">{derivedStats.winRate}%</span>
              </div>
              <div className="flex justify-between border-t border-amber-700 pt-3">
                <span>Current Streak:</span>
                <span className="font-bold text-purple-400">{stats.currentStreak}</span>
              </div>
              <div className="flex justify-between">
                <span>Longest Streak:</span>
                <span className="font-bold text-purple-400">{stats.longestStreak}</span>
              </div>
            </div>
          </div>

          {/* Score Stats */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border-2 border-amber-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Scoring</h3>
            <div className="space-y-3 text-amber-100">
              <div className="flex justify-between">
                <span>Total Gold:</span>
                <span className="font-bold text-yellow-400">💰 {stats.totalScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Score:</span>
                <span className="font-bold text-yellow-400">💰 {stats.highestScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Score:</span>
                <span className="font-bold text-yellow-400">💰 {derivedStats.averageScore}</span>
              </div>
              <div className="flex justify-between border-t border-amber-700 pt-3">
                <span>Average Deadwood:</span>
                <span className="font-bold text-blue-400">{derivedStats.averageDeadwood}</span>
              </div>
            </div>
          </div>

          {/* Special Achievements */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border-2 border-amber-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Special Plays</h3>
            <div className="space-y-3 text-amber-100">
              <div className="flex justify-between">
                <span>🎯 Knocks:</span>
                <span className="font-bold text-green-400">{stats.knocksCount}</span>
              </div>
              <div className="flex justify-between">
                <span>✨ Gins:</span>
                <span className="font-bold text-purple-400">{stats.ginsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>⚡ Undercuts:</span>
                <span className="font-bold text-pink-400">{stats.undercutsCount}</span>
              </div>
              <div className="flex justify-between border-t border-amber-700 pt-3">
                <span>Gin Rate:</span>
                <span className="font-bold text-purple-400">{derivedStats.ginRate}%</span>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border-2 border-amber-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">🏆 Match Mode</h3>
            <div className="space-y-3 text-amber-100">
              <div className="flex justify-between">
                <span>Matches Played:</span>
                <span className="font-bold text-yellow-400">{stats.matchesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span>Matches Won:</span>
                <span className="font-bold text-green-400">{stats.matchesWon}</span>
              </div>
              <div className="flex justify-between">
                <span>Match Win Rate:</span>
                <span className="font-bold text-yellow-400">{derivedStats.matchWinRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border-2 border-amber-700 mb-6">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Performance by Difficulty</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(DIFFICULTY_LEVELS).map(([key, difficulty]) => {
              const difficultyStats = stats.byDifficulty[difficulty];
              if (!difficultyStats) return null;

              const winRate = difficultyStats.gamesPlayed > 0
                ? ((difficultyStats.gamesWon / difficultyStats.gamesPlayed) * 100).toFixed(1)
                : 0;

              const icons = {
                Tutorial: '📚',
                Easy: '😊',
                Medium: '🎯',
                Hard: '🔥'
              };

              return (
                <div key={difficulty} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <div className="text-center mb-2 text-2xl">{icons[difficulty]}</div>
                  <div className="text-center text-amber-300 font-bold mb-2">{difficulty}</div>
                  <div className="text-center space-y-1 text-sm text-amber-100">
                    <div>Played: <span className="font-bold">{difficultyStats.gamesPlayed}</span></div>
                    <div>Won: <span className="font-bold text-green-400">{difficultyStats.gamesWon}</span></div>
                    <div>Lost: <span className="font-bold text-red-400">{difficultyStats.gamesLost || 0}</span></div>
                    <div>Drawn: <span className="font-bold text-blue-400">{difficultyStats.gamesDrawn || 0}</span></div>
                    <div>Win Rate: <span className="font-bold text-yellow-400">{winRate}%</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg border-2 border-amber-400 transition-all"
          >
            Close
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold text-lg border-2 border-red-500 transition-all"
          >
            Reset Stats
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-amber-500">
          Stats tracked since: {new Date(stats.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

StatsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  stats: PropTypes.object,
  derivedStats: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default StatsModal;
