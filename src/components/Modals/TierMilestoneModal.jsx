import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TierMilestoneModal Component
 * Displays a celebration modal when player reaches a new Challenge Mode tier
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Object} milestone - Milestone data {tier, xpBonus, message}
 * @param {Function} onClose - Callback when closing
 */
const TierMilestoneModal = ({ show, milestone, onClose }) => {
  if (!show || !milestone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl max-w-md"
        >
          {/* Animated icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center text-8xl mb-4"
          >
            {milestone.tier.icon}
          </motion.div>

          {/* Tier reached message */}
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-400">
            🎊 TIER UP! 🎊
          </h2>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-white mb-2">
              {milestone.tier.name}
            </p>
            <p className="text-lg text-purple-200 mb-4">
              {milestone.tier.difficulty}
            </p>
            <p className="text-purple-300 italic">
              "{milestone.message}"
            </p>
          </div>

          {/* XP Bonus */}
          {milestone.xpBonus > 0 && (
            <div className="bg-yellow-600 bg-opacity-20 border-2 border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-center text-yellow-300 font-bold">
                Milestone Bonus: +{milestone.xpBonus} XP
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-3 mb-6">
            <p className="text-center text-red-200 text-sm">
              ⚠️ The AI grows stronger...
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg border-2 border-yellow-400 font-bold text-gray-900 transition-all transform hover:scale-105"
          >
            Continue Challenge
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

TierMilestoneModal.propTypes = {
  show: PropTypes.bool.isRequired,
  milestone: PropTypes.shape({
    tier: PropTypes.shape({
      name: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    }),
    xpBonus: PropTypes.number,
    message: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default TierMilestoneModal;
