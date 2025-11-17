import React from 'react';

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
  meldColor = null
}) => {
  const isRed = ['♥', '♦', '🏆', '💰'].includes(card.suit);

  return (
    <div
      onClick={onClick}
      className={`
        relative w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300 shadow-lg
        ${hidden ? 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-800'}
        ${inMeld && meldColor ? `${meldColor} border-4` : ''}
        ${isNew ? 'animate-pulse ring-2 ring-green-400' : ''}
        ${isDiscarding ? 'opacity-50 scale-90' : ''}
        ${isAiDrawing ? 'ring-4 ring-purple-400 animate-[pulse_1s_ease-in-out_3]' : ''}
        ${isAiDiscarding ? 'ring-4 ring-red-400 animate-[pulse_0.8s_ease-in-out_2]' : ''}
        ${shouldHighlight ? 'ring-4 ring-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}
        ${!hidden && !inMeld ? 'hover:transform hover:-translate-y-1' : ''}
      `}
    >
      {!hidden ? (
        <>
          <div className={`text-2xl font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
            {card.rank}
          </div>
          <div className="text-3xl my-1">{card.suit}</div>
          <div className={`text-xs ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
            {card.value}
          </div>
          {inMeld && (
            <div className="absolute top-0 right-0 text-xs bg-white rounded-bl px-1">
              ✓
            </div>
          )}
        </>
      ) : (
        <div className="text-amber-600 text-4xl">🃏</div>
      )}
    </div>
  );
};

export default PlayingCard;
