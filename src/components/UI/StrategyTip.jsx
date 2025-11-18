import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * StrategyTip Component
 * Displays subtle, non-intrusive strategy tips during gameplay
 * Tips appear at the top center of the screen with smooth animations
 */
const StrategyTip = ({ tip, onDismiss, onApply }) => {
  if (!tip) return null;

  const handleApply = () => {
    onApply(tip.id);
  };

  const handleDismiss = () => {
    onDismiss(tip.id, false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full px-4"
      >
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-2 border-blue-400 rounded-lg p-4 shadow-2xl">
          {/* Header with Icon and Title */}
          <div className="flex items-center gap-2 mb-2">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              💡
            </motion.span>
            <h3 className="text-blue-200 font-bold text-lg">{tip.title}</h3>
          </div>

          {/* Main Message */}
          <p className="text-white text-sm mb-2 leading-relaxed">
            {tip.message}
          </p>

          {/* Optional Detail */}
          {tip.detail && (
            <p className="text-blue-300 text-xs mb-3 italic leading-relaxed">
              {tip.detail}
            </p>
          )}

          {/* Optional Suggestion */}
          {tip.suggestion && (
            <div className="bg-blue-800 bg-opacity-50 rounded p-2 mb-3 border border-blue-500">
              <p className="text-yellow-200 text-xs">
                <span className="font-semibold">💭 Suggestion: </span>
                {tip.suggestion}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end mt-3">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-all duration-200 border border-gray-600"
              aria-label="Dismiss tip"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-all duration-200 border border-blue-400 font-semibold"
              aria-label="Mark tip as understood"
            >
              Got it!
            </button>
          </div>

          {/* Tier Badge */}
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded ${
              tip.tier === 1
                ? 'bg-green-700 text-green-200'
                : 'bg-purple-700 text-purple-200'
            }`}>
              {tip.tier === 1 ? 'Basic' : 'Strategy'}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

StrategyTip.propTypes = {
  tip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    detail: PropTypes.string,
    suggestion: PropTypes.string,
    tier: PropTypes.number,
    category: PropTypes.string,
    priority: PropTypes.string
  }),
  onDismiss: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired
};

export default StrategyTip;
