import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AchievementNotification Component
 * Displays a toast notification when an achievement is unlocked
 *
 * @param {Object} achievement - Achievement object
 * @param {Function} onDismiss - Callback when dismissed
 */
const AchievementNotification = ({ achievement, onDismiss }) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slideInRight">
      <div className="bg-gradient-to-br from-yellow-600 to-amber-700 p-6 rounded-lg border-4 border-yellow-400 shadow-2xl max-w-sm">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="text-5xl animate-bounce">
            {achievement.icon}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="text-yellow-200 text-xs font-bold uppercase mb-1">
              Achievement Unlocked!
            </div>
            <h3 className="font-bold text-xl text-white mb-1">
              {achievement.name}
            </h3>
            <p className="text-sm text-yellow-100">
              {achievement.description}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="text-yellow-200 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

AchievementNotification.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }),
  onDismiss: PropTypes.func.isRequired
};

export default AchievementNotification;
