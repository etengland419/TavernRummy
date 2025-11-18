import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import PlayingCard from '../UI/PlayingCard';

const LuckyDrawModal = ({ show, cards, onSelectCard, onClose }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  if (!show || !cards || cards.length !== 2) return null;

  const handleConfirm = () => {
    if (selectedCardIndex !== null) {
      onSelectCard(cards[selectedCardIndex]);
      setSelectedCardIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-green-900 to-gray-900 p-8 rounded-lg border-4 border-green-600 shadow-2xl max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">📊</span>
            <h2 className="text-3xl font-bold text-green-400">Lucky Draw!</h2>
          </div>
          <p className="text-gray-300">
            Your Lucky Draw ability triggered! Choose one card to keep.
          </p>
        </div>

        {/* Cards Display */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {cards.map((card, index) => (
            <motion.div
              key={`${card.suit}-${card.rank}-${index}`}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCardIndex(index)}
              className={`cursor-pointer transition-all ${
                selectedCardIndex === index
                  ? 'ring-4 ring-green-400 rounded-lg'
                  : ''
              }`}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{
                opacity: 1,
                rotateY: 0,
                transition: { delay: index * 0.15 }
              }}
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
            className="bg-green-950 bg-opacity-50 rounded-lg p-4 mb-6 border-2 border-green-700"
          >
            <div className="text-green-200 text-sm text-center">
              <span className="font-semibold">✓ Selected:</span> {cards[selectedCardIndex].rank} of {cards[selectedCardIndex].suit}
              <br />
              <span className="text-xs text-green-300">The other card will be discarded</span>
            </div>
          </motion.div>
        )}

        {/* Confirm Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={selectedCardIndex === null}
            className={`px-8 py-3 font-bold rounded-lg border-2 transition-all ${
              selectedCardIndex !== null
                ? 'bg-green-600 hover:bg-green-500 text-white border-green-400 cursor-pointer shadow-lg'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            Choose This Card
          </button>
        </div>
      </motion.div>
    </div>
  );
};

LuckyDrawModal.propTypes = {
  show: PropTypes.bool.isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    suit: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })),
  onSelectCard: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default LuckyDrawModal;
