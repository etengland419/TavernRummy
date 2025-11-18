import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LevelUpModal Component
 * Displays celebration when player levels up
 *
 * @param {boolean} show - Whether to show the modal
 * @param {number} newLevel - New level achieved
 * @param {number} apGained - Ability Points gained
 * @param {Function} onClose - Callback when modal is closed
 */
const LevelUpModal = ({ show, newLevel, apGained, onClose }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-800 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl max-w-md mx-4"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5, rotate: 10 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {/* Celebration Icon */}
          <motion.div
            className="text-center mb-6"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <div className="text-8xl mb-2">🎉</div>
          </motion.div>

          {/* Level Up Title */}
          <h2 className="text-4xl font-bold text-center text-yellow-300 mb-4">
            LEVEL UP!
          </h2>

          {/* New Level Display */}
          <div className="bg-black bg-opacity-40 rounded-lg p-6 mb-6 border-2 border-yellow-500">
            <div className="text-center">
              <div className="text-gray-300 text-sm mb-2">You reached</div>
              <motion.div
                className="text-6xl font-bold text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 10 }}
              >
                Level {newLevel}
              </motion.div>
            </div>
          </div>

          {/* AP Reward */}
          {apGained > 0 && (
            <motion.div
              className="bg-purple-900 bg-opacity-60 rounded-lg p-4 mb-6 border-2 border-purple-400"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-purple-200 text-sm mb-1">Ability Points Gained</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">⚡</span>
                  <span className="text-3xl font-bold text-purple-300">+{apGained} AP</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Flavor Text */}
          <p className="text-center text-amber-200 text-sm mb-6 italic">
            {newLevel <= 5 && "You're getting stronger! Visit the Abilities Shop to unlock new powers."}
            {newLevel > 5 && newLevel <= 10 && "Your skills are growing! Keep pushing forward, adventurer."}
            {newLevel > 10 && newLevel <= 15 && "Impressive progress! The taverns speak of your prowess."}
            {newLevel > 15 && "You've become a legend! Few reach this level of mastery."}
          </p>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg border-2 border-yellow-400 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{
                top: '-10%',
                left: `${Math.random() * 100}%`,
                opacity: 1
              }}
              animate={{
                top: '110%',
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                opacity: 0
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'linear'
              }}
            >
              {['🎉', '⭐', '💫', '✨', '🏆'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

LevelUpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  newLevel: PropTypes.number,
  apGained: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

LevelUpModal.defaultProps = {
  newLevel: 1,
  apGained: 0
};

export default LevelUpModal;
