import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getCardStyling, getSuitSymbol, CARD_SKINS } from '../../utils/skinsUtils';

/**
 * PlayingCard Component
 * Displays a single playing card with medieval theme
 *
 * @param {Object} card - Card object {suit, rank, value, id}
 * @param {Function} onClick - Click handler
 * @param {boolean} hidden - Whether to show card back
 * @param {boolean} isNew - Whether card was just drawn (pulse animation)
 * @param {boolean} isDiscarding - Whether card is being discarded
 * @param {boolean} isAiDrawing - Whether AI is drawing this card
 * @param {boolean} isAiDiscarding - Whether AI is discarding this card
 * @param {boolean} shouldHighlight - Whether to highlight (tutorial)
 * @param {boolean} inMeld - Whether card is in a meld
 * @param {string} meldColor - Border color class for meld
 * @param {string} skinId - Card skin to use (defaults to CLASSIC)
 */
const PlayingCard = ({
  card,
  onClick,
  hidden = false,
  isNew = false,
  isDiscarding = false,
  isAiDrawing = false,
  isAiDiscarding = false,
  shouldHighlight = false,
  inMeld = false,
  meldColor = null,
  skinId = CARD_SKINS.CLASSIC
}) => {
  // Get skin styling
  const styling = getCardStyling(skinId, hidden);

  // Map suit names for skin symbols
  const suitMap = {
    '⚔️': 'Swords',
    '🏆': 'Chalices',
    '💰': 'Coins',
    '🔱': 'Staves'
  };
  const suitName = suitMap[card.suit] || 'Swords';
  const displaySuit = getSuitSymbol(skinId, suitName);

  const [showMeldCelebration, setShowMeldCelebration] = useState(false);
  const prevInMeld = useRef(inMeld);

  // Detect when card becomes part of a meld
  useEffect(() => {
    if (!prevInMeld.current && inMeld) {
      setShowMeldCelebration(true);
      const timer = setTimeout(() => setShowMeldCelebration(false), 600);
      return () => clearTimeout(timer);
    }
    prevInMeld.current = inMeld;
  }, [inMeld]);

  return (
    <div
      onClick={onClick}
      className={`
        relative w-20 h-28 rounded-lg flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300
        ${styling.background}
        ${styling.border}
        ${styling.shadow}
        ${styling.pixelated ? 'image-rendering-pixelated' : ''}
        ${inMeld && meldColor ? `${meldColor} border-4` : ''}
        ${isNew ? 'animate-pulse ring-2 ring-green-400' : ''}
        ${isDiscarding ? 'opacity-0 scale-90 pointer-events-none' : ''}
        ${isAiDrawing ? 'ring-4 ring-orange-400 animate-[pulse_1s_ease-in-out_3]' : ''}
        ${isAiDiscarding ? 'ring-4 ring-yellow-500 animate-[pulse_0.8s_ease-in-out_2]' : ''}
        ${shouldHighlight ? 'ring-4 ring-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}
        ${!hidden && !inMeld ? 'hover:transform hover:-translate-y-1' : ''}
        ${showMeldCelebration ? 'meld-glow' : ''}
      `}
    >
      {!hidden ? (
        <>
          <div className={`text-2xl font-bold ${styling.textColor}`}>
            {card.rank}
          </div>
          <div className="text-3xl my-1">{displaySuit}</div>
          <div className={`text-xs ${styling.textColor}`}>
            {card.value}
          </div>
          {inMeld && (
            <div className="absolute top-0 right-0 text-xs bg-white rounded-bl px-1">
              ✓
            </div>
          )}
        </>
      ) : (
        <div className="text-4xl">{styling.pattern}</div>
      )}
    </div>
  );
};

PlayingCard.propTypes = {
  card: PropTypes.shape({
    suit: PropTypes.string.isRequired,
    rank: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func,
  hidden: PropTypes.bool,
  isNew: PropTypes.bool,
  isDiscarding: PropTypes.bool,
  isAiDrawing: PropTypes.bool,
  isAiDiscarding: PropTypes.bool,
  shouldHighlight: PropTypes.bool,
  inMeld: PropTypes.bool,
  meldColor: PropTypes.string,
  skinId: PropTypes.string
};

export default PlayingCard;
