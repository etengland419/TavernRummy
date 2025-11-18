import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TierMilestoneModal Component
 * Displays a celebration modal when player reaches a new Challenge Mode tier
 * Now also shows round result when advancing tiers
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Object} milestone - Milestone data {tier, xpBonus, message}
 * @param {Object} roundResult - Optional round result data {winner, playerDeadwood, aiDeadwood, scoreDiff, reason}
 * @param {Function} onClose - Callback when closing
 */
const TierMilestoneModal = ({ show, milestone, roundResult, onClose }) => {
  if (!show || !milestone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      {/* Animated background rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 overflow-hidden opacity-20"
      >
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-gradient-conic from-yellow-500 via-purple-500 to-yellow-500"></div>
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: -180, y: 100 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotateY: 0,
            y: 0,
          }}
          exit={{ scale: 0.3, opacity: 0, rotateY: 180, y: -100 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl max-w-md relative overflow-hidden"
        >
          {/* Glowing border effect */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-4 border-yellow-300 rounded-lg blur-sm"
          />

          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
            />
          ))}

          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.3, 1, 1.1, 1],
              rotate: [0, 360, 360, 360, 360]
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.3, 0.6, 0.8, 1],
              ease: "easeOut"
            }}
            className="text-center text-8xl mb-4 relative z-10 filter drop-shadow-2xl"
          >
            <motion.div
              animate={{
                textShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.8)",
                  "0 0 40px rgba(251, 191, 36, 1)",
                  "0 0 20px rgba(251, 191, 36, 0.8)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {milestone.tier.icon}
            </motion.div>
          </motion.div>

          {/* Tier reached message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-center mb-4 text-yellow-400 relative z-10"
          >
            <motion.span
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🎊 TIER UP! 🎊
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mb-6 relative z-10"
          >
            <p className="text-2xl font-bold text-white mb-2">
              {milestone.tier.name}
            </p>
            <p className="text-lg text-purple-200 mb-4">
              {milestone.tier.difficulty}
            </p>
            <p className="text-purple-300 italic">
              "{milestone.message}"
            </p>
          </motion.div>

          {/* XP Bonus */}
          {milestone.xpBonus > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: "spring" }}
              className="bg-yellow-600 bg-opacity-20 border-2 border-yellow-500 rounded-lg p-4 mb-6 relative z-10"
            >
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-center text-yellow-300 font-bold"
              >
                Milestone Bonus: +{milestone.xpBonus} XP
              </motion.p>
            </motion.div>
          )}

          {/* Round Result (if provided) */}
          {roundResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="bg-gradient-to-br from-amber-900 to-gray-900 border-2 border-amber-500 rounded-lg p-4 mb-4 relative z-10"
            >
              <h3 className="text-lg font-bold text-amber-300 mb-2 text-center">
                Round Result
              </h3>
              <div className="space-y-2 text-sm text-amber-100">
                <p className="text-center italic">{roundResult.reason}</p>
                <div className="flex justify-between border-t border-amber-700 pt-2">
                  <span>Your Deadwood:</span>
                  <span className="font-bold text-yellow-400">{roundResult.playerDeadwood}</span>
                </div>
                <div className="flex justify-between">
                  <span>Opponent Deadwood:</span>
                  <span className="font-bold text-pink-400">{roundResult.aiDeadwood}</span>
                </div>
                <div className="flex justify-between border-t border-amber-700 pt-2 font-bold">
                  <span>Gold Won:</span>
                  <span className="text-yellow-400">{roundResult.scoreDiff}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: roundResult ? 1.1 : 0.9, duration: 0.4 }}
            className="bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-3 mb-6 relative z-10"
          >
            <p className="text-center text-red-200 text-sm">
              ⚠️ The AI grows stronger...
            </p>
          </motion.div>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: roundResult ? 1.3 : 1.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg border-2 border-yellow-400 font-bold text-gray-900 transition-all relative z-10"
          >
            Continue Challenge
          </motion.button>
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
  roundResult: PropTypes.shape({
    winner: PropTypes.string,
    playerDeadwood: PropTypes.number,
    aiDeadwood: PropTypes.number,
    scoreDiff: PropTypes.number,
    reason: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default TierMilestoneModal;
