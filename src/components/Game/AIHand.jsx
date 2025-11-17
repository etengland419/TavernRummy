import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import PlayingCard from '../UI/PlayingCard';

/**
 * AIHand Component
 * Displays the AI opponent's hand
 *
 * @param {Array} hand - AI's hand
 * @param {boolean} gameOver - Whether game is over (show cards)
 * @param {string} aiDrawnCard - ID of card AI just drew
 * @param {string} aiDiscardedCard - ID of card AI is discarding
 * @param {string} currentTurn - Current turn ('player' or 'ai')
 */
const AIHand = ({ hand, gameOver, aiDrawnCard, aiDiscardedCard, currentTurn }) => {
  const isAiTurn = currentTurn === 'ai';

  return (
    <div className={`mb-8 rounded-lg p-4 transition-all duration-300 ${isAiTurn ? 'ai-turn-glow' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">👤</span>
        <h2 className="text-xl font-bold text-amber-400">The Hooded Stranger</h2>
      </div>
      <div className="flex justify-center gap-2">
        <AnimatePresence initial={false}>
          {hand.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: index % 2 === 0 ? -5 : 5 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <PlayingCard
                card={card}
                hidden={!gameOver}
                isAiDrawing={aiDrawnCard === card.id}
                isAiDiscarding={aiDiscardedCard === card.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

AIHand.propTypes = {
  hand: PropTypes.array.isRequired,
  gameOver: PropTypes.bool.isRequired,
  aiDrawnCard: PropTypes.string,
  aiDiscardedCard: PropTypes.string,
  currentTurn: PropTypes.string
};

export default AIHand;
