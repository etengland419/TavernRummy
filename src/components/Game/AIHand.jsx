import React from 'react';
import PlayingCard from '../UI/PlayingCard';

/**
 * AIHand Component
 * Displays the AI opponent's hand
 *
 * @param {Array} hand - AI's hand
 * @param {boolean} gameOver - Whether game is over (show cards)
 * @param {string} aiDrawnCard - ID of card AI just drew
 * @param {string} aiDiscardedCard - ID of card AI is discarding
 */
const AIHand = ({ hand, gameOver, aiDrawnCard, aiDiscardedCard }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">👤</span>
        <h2 className="text-xl font-bold text-amber-400">The Hooded Stranger</h2>
      </div>
      <div className="flex justify-center gap-2">
        {hand.map((card, index) => (
          <div key={card.id} style={{ transform: `translateY(${index % 2 === 0 ? '-5px' : '5px'})` }}>
            <PlayingCard
              card={card}
              hidden={!gameOver}
              isAiDrawing={aiDrawnCard === card.id}
              isAiDiscarding={aiDiscardedCard === card.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIHand;
