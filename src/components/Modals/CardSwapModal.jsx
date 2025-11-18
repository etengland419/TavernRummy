import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import PlayingCard from '../UI/PlayingCard';

const CardSwapModal = ({ show, hand, onSwap, onClose }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  if (!show) return null;

  const handleConfirm = () => {
    if (selectedCardIndex !== null) {
      onSwap(selectedCardIndex);
      setSelectedCardIndex(null);
    }
  };

  const handleClose = () => {
    setSelectedCardIndex(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-blue-900 to-gray-900 p-8 rounded-lg border-4 border-blue-600 shadow-2xl max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🎴</span>
            <h2 className="text-3xl font-bold text-blue-400">Card Swap</h2>
          </div>
          <p className="text-gray-300">
            Select a card to discard and draw a replacement from the deck
          </p>
        </div>

        {/* Hand Display */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {hand.map((card, index) => (
            <motion.div
              key={`${card.suit}-${card.rank}-${index}`}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCardIndex(index)}
              className={`cursor-pointer transition-all ${
                selectedCardIndex === index
                  ? 'ring-4 ring-blue-400 rounded-lg'
                  : ''
              }`}
            >
              <PlayingCard
                card={card}
                faceUp={true}
                onClick={() => {}}
                isSelected={selectedCardIndex === index}
              />
            </motion.div>
          ))}
        </div>

        {/* Info */}
        {selectedCardIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-950 bg-opacity-50 rounded-lg p-4 mb-6 border-2 border-blue-700"
          >
            <div className="text-blue-200 text-sm text-center">
              <span className="font-semibold">✓ Selected:</span> {hand[selectedCardIndex].rank} of {hand[selectedCardIndex].suit}
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg border-2 border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedCardIndex === null}
            className={`px-6 py-3 font-bold rounded-lg border-2 transition-all ${
              selectedCardIndex !== null
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 cursor-pointer'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            Swap Card
          </button>
        </div>
      </motion.div>
    </div>
  );
};

CardSwapModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hand: PropTypes.arrayOf(PropTypes.shape({
    suit: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired,
  onSwap: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CardSwapModal;
