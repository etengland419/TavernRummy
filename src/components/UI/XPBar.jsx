import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * XPBar Component
 * Displays player level, XP progress, and Ability Points
 *
 * @param {number} level - Current level
 * @param {number} currentXP - Current XP in this level
 * @param {number} xpToNext - XP needed for next level
 * @param {number} abilityPoints - Available Ability Points
 */
const XPBar = ({ level, currentXP, xpToNext, abilityPoints }) => {
  const progress = Math.min(100, Math.floor((currentXP / xpToNext) * 100));

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border-2 border-amber-600 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        {/* Level Display */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-600 text-white font-bold px-3 py-1 rounded-lg border-2 border-amber-400 text-sm">
            Lv {level}
          </div>

          {/* XP Text */}
          <div className="text-gray-300 text-xs sm:text-sm font-semibold">
            {currentXP} / {xpToNext} XP
          </div>
        </div>

        {/* Ability Points */}
        <div className="flex items-center gap-1 bg-purple-900 bg-opacity-50 px-3 py-1 rounded-lg border-2 border-purple-400">
          <span className="text-lg">⚡</span>
          <span className="text-purple-200 font-bold text-sm">{abilityPoints} AP</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="relative w-full h-6 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Progress Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs drop-shadow-lg z-10">
            {progress}%
          </span>
        </div>

        {/* Shimmer Effect */}
        {progress > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
};

XPBar.propTypes = {
  level: PropTypes.number.isRequired,
  currentXP: PropTypes.number.isRequired,
  xpToNext: PropTypes.number.isRequired,
  abilityPoints: PropTypes.number.isRequired
};

export default XPBar;
