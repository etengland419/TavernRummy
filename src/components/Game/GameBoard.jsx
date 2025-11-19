import React from 'react';
import PropTypes from 'prop-types';
import PlayingCard from '../UI/PlayingCard';
import { getCardStyling } from '../../utils/skinsUtils';

/**
 * GameBoard Component
 * Displays the draw pile and discard pile
 *
 * @param {Array} deck - Current deck
 * @param {Array} discardPile - Current discard pile
 * @param {Function} onDrawFromDeck - Callback when drawing from deck
 * @param {Function} onDrawFromDiscard - Callback when drawing from discard
 * @param {boolean} canDraw - Whether player can currently draw
 * @param {string} tutorialHighlight - 'deck', 'discard', or null
 * @param {Object} refs - Object with deckRef and discardRef
 * @param {string} skinId - Card skin to use
 */
const GameBoard = ({
  deck,
  discardPile,
  onDrawFromDeck,
  onDrawFromDiscard,
  canDraw,
  tutorialHighlight,
  refs,
  skinId
}) => {
  // Get card back styling for the deck
  const cardBackStyling = getCardStyling(skinId, true);
  const isDeckLow = deck.length <= 10 && deck.length > 0;

  return (
    <div className="flex justify-center gap-8 mb-8">
      {/* Draw Pile */}
      <div
        className={`relative ${tutorialHighlight === 'deck' ? 'ring-4 ring-blue-400 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
        ref={refs?.deckRef}
      >
        <div className="text-center mb-2">
          <p className={`font-bold ${isDeckLow ? 'text-red-400' : 'text-amber-300'}`}>
            Draw Pile ({deck.length})
            {isDeckLow && <span className="ml-1 text-xs">⚠️</span>}
          </p>
        </div>
        <div
          onClick={onDrawFromDeck}
          className={`
            relative w-24 h-36 rounded-lg
            ${cardBackStyling.background}
            ${cardBackStyling.border}
            ${cardBackStyling.shadow}
            flex items-center justify-center cursor-pointer
            transition-all duration-200
            ${canDraw && deck.length > 0 ? 'hover:scale-105 hover:shadow-yellow-500/50' : 'opacity-50 cursor-not-allowed'}
            ${canDraw && deck.length > 0 && !tutorialHighlight ? 'clickable-pulse' : ''}
            ${isDeckLow ? 'deck-low-glow' : ''}
          `}
        >
          <div className="text-5xl">{cardBackStyling.pattern}</div>
          {deck.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
              <span className="text-red-400 font-bold">Empty</span>
            </div>
          )}
        </div>
      </div>

      {/* Discard Pile */}
      <div
        className={`relative ${tutorialHighlight === 'discard' ? 'ring-4 ring-blue-400 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
        ref={refs?.discardRef}
      >
        <div className="text-center mb-2">
          <p className="text-amber-300 font-bold">Discard Pile</p>
        </div>
        {discardPile.length > 0 ? (
          <div
            onClick={onDrawFromDiscard}
            className={canDraw && !tutorialHighlight ? 'clickable-pulse' : ''}
          >
            <PlayingCard
              card={discardPile[discardPile.length - 1]}
              onClick={onDrawFromDiscard}
              skinId={skinId}
            />
          </div>
        ) : (
          <div className="w-24 h-36 rounded-lg border-3 border-dashed border-amber-700 flex items-center justify-center bg-amber-950 bg-opacity-50">
            <span className="text-amber-600 text-sm">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

GameBoard.propTypes = {
  deck: PropTypes.array.isRequired,
  discardPile: PropTypes.array.isRequired,
  onDrawFromDeck: PropTypes.func.isRequired,
  onDrawFromDiscard: PropTypes.func.isRequired,
  canDraw: PropTypes.bool.isRequired,
  tutorialHighlight: PropTypes.string,
  refs: PropTypes.shape({
    deckRef: PropTypes.object,
    discardRef: PropTypes.object
  }),
  skinId: PropTypes.string
};

export default GameBoard;
