import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import PlayingCard from '../UI/PlayingCard';

const DeckPeekModal = ({ show, cards, onClose }) => {
  if (!show || !cards) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-purple-900 to-gray-900 p-8 rounded-lg border-4 border-purple-600 shadow-2xl max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">👁️</span>
            <h2 className="text-3xl font-bold text-purple-400">Deck Peek</h2>
          </div>
          <p className="text-gray-300">
            These are the top {cards.length} cards in the deck
          </p>
        </div>

        {/* Cards Display */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={`${card.suit}-${card.rank}-${index}`}
                initial={{ opacity: 0, y: -20, rotateY: 180 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                  transition: { delay: index * 0.15 }
                }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="relative">
                  {/* Position indicator */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                  <PlayingCard
                    card={card}
                    faceUp={true}
                    onClick={() => {}}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="bg-purple-950 bg-opacity-50 rounded-lg p-4 mb-6 border-2 border-purple-700">
          <div className="text-purple-200 text-sm text-center">
            <span className="font-semibold">💡 Strategy Tip:</span> Use this information to decide whether to draw from the deck or discard pile on your next turn.
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg border-2 border-purple-400 transition-all shadow-lg"
          >
            Got It
          </button>
        </div>
      </motion.div>
    </div>
  );
};

DeckPeekModal.propTypes = {
  show: PropTypes.bool.isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    suit: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })),
  onClose: PropTypes.func.isRequired
};

export default DeckPeekModal;
