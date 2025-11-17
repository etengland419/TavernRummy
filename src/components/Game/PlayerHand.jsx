import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import PlayingCard from '../UI/PlayingCard';
import { isCardInMeld, getMeldColor } from '../../utils/cardUtils';

/**
 * PlayerHand Component
 * Displays the player's hand with meld highlighting
 *
 * @param {Array} hand - Player's hand
 * @param {Array} melds - Current melds
 * @param {number} deadwood - Deadwood value
 * @param {Function} onCardClick - Callback when card is clicked
 * @param {boolean} canDiscard - Whether player can discard
 * @param {string} newlyDrawnCard - ID of newly drawn card
 * @param {string} discardingCard - ID of card being discarded
 * @param {string} tutorialHighlight - ID of highlighted card
 * @param {boolean} sortCards - Whether cards are auto-sorted
 * @param {Object} playerHandRef - Ref for player hand container
 * @param {string} currentTurn - Current turn ('player' or 'ai')
 */
const PlayerHand = ({
  hand,
  melds,
  deadwood,
  onCardClick,
  canDiscard,
  newlyDrawnCard,
  discardingCard,
  tutorialHighlight,
  sortCards,
  playerHandRef,
  currentTurn
}) => {
  const isPlayerTurn = currentTurn === 'player';

  return (
    <div ref={playerHandRef} className="rounded-lg p-4 transition-all duration-300">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">🛡️</span>
        <h2 className={`text-xl font-bold text-amber-400 transition-all duration-300 ${isPlayerTurn ? 'player-turn-name-glow' : ''}`}>
          Your Hand
        </h2>
        {sortCards && melds.length > 0 && (
          <span className="text-xs text-amber-500">(Melds first, then deadwood)</span>
        )}
      </div>
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        <AnimatePresence initial={false}>
          {hand.map((card, index) => {
            // Check if we're at the transition from melds to deadwood
            const isFirstDeadwood = sortCards && melds.length > 0 &&
              index === melds.flat().length;

            const inMeld = isCardInMeld(card.id, melds);
            const meldColor = getMeldColor(card.id, melds);

            return (
              <React.Fragment key={card.id}>
                {isFirstDeadwood && (
                  <motion.div
                    className="w-1 h-28 bg-amber-600 rounded mx-2 opacity-50"
                    layout
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <PlayingCard
                    card={card}
                    onClick={() => canDiscard && onCardClick(card)}
                    isNew={newlyDrawnCard === card.id}
                    isDiscarding={discardingCard === card.id}
                    shouldHighlight={tutorialHighlight === card.id}
                    inMeld={inMeld}
                    meldColor={meldColor}
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Player Info with Meld Legend */}
      <div className="text-center text-amber-300 mb-4">
        <p>Deadwood: <span className="font-bold text-yellow-400">{deadwood}</span> points</p>
        <p className="text-sm text-amber-400 mt-1">
          {melds.length > 0 ? `${melds.length} meld(s) formed` : 'No melds yet'}
        </p>
        {melds.length > 0 && (
          <div className="flex justify-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-green-500 rounded"></span>
              Meld 1
            </span>
            {melds.length > 1 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 border-2 border-blue-500 rounded"></span>
                Meld 2
              </span>
            )}
            {melds.length > 2 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 border-2 border-purple-500 rounded"></span>
                Meld 3
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PlayerHand.propTypes = {
  hand: PropTypes.array.isRequired,
  melds: PropTypes.array.isRequired,
  deadwood: PropTypes.number.isRequired,
  onCardClick: PropTypes.func.isRequired,
  canDiscard: PropTypes.bool.isRequired,
  newlyDrawnCard: PropTypes.string,
  discardingCard: PropTypes.string,
  tutorialHighlight: PropTypes.string,
  sortCards: PropTypes.bool.isRequired,
  playerHandRef: PropTypes.object,
  currentTurn: PropTypes.string
};

export default PlayerHand;
