import React from 'react';
import PropTypes from 'prop-types';

/**
 * AchievementsModal Component
 * Displays all achievements with unlock status
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Array} achievements - List of all achievements
 * @param {Object} completionStats - Completion statistics
 * @param {Function} onClose - Callback when closing
 */
const AchievementsModal = ({ show, achievements, completionStats, onClose }) => {
  if (!show) return null;

  const sortedAchievements = [...achievements].sort((a, b) => {
    // Unlocked achievements first
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    // Then by progress
    return b.progress - a.progress;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400">🏆 Achievements</h2>
            <p className="text-amber-300 text-sm mt-1">
              {completionStats.unlocked} / {completionStats.total} ({completionStats.percentage}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-amber-400 hover:text-amber-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-4 border-2 border-amber-700">
            <div
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionStats.percentage}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-900 to-yellow-900 border-yellow-500 shadow-lg'
                  : 'bg-gray-900 bg-opacity-50 border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-1 ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    achievement.unlocked ? 'text-amber-200' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar for locked achievements */}
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${achievement.progress * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(achievement.progress * 100)}% Complete
                      </p>
                    </div>
                  )}

                  {/* Unlock date */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-amber-500 mt-2">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Checkmark for unlocked */}
                {achievement.unlocked && (
                  <div className="text-green-400 text-2xl">
                    ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg border-2 border-amber-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

AchievementsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  achievements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    unlocked: PropTypes.bool,
    progress: PropTypes.number,
    unlockedAt: PropTypes.number
  })).isRequired,
  completionStats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    unlocked: PropTypes.number.isRequired,
    percentage: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default AchievementsModal;
