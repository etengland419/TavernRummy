import { SUITS, RANKS } from './constants';

/**
 * Get the numeric value of a card rank
 * @param {string} rank - Card rank (A, 2-10, J, Q, K)
 * @returns {number} Numeric value of the rank
 */
export const getRankValue = (rank) => {
  if (rank === 'A') return 1;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

/**
 * Create a new deck of cards
 * @returns {Array} Shuffled deck of 52 cards
 */
export const createDeck = () => {
  const newDeck = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      newDeck.push({
        suit,
        rank,
        value: getRankValue(rank),
        id: `${rank}-${suit}-${Math.random()}`
      });
    });
  });
  return shuffleDeck(newDeck);
};

/**
 * Shuffle a deck using Fisher-Yates algorithm
 * @param {Array} deck - Deck to shuffle
 * @returns {Array} Shuffled deck
 */
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Check if a card is in a meld
 * @param {string} cardId - Card ID to check
 * @param {Array} melds - Array of melds
 * @returns {boolean} True if card is in a meld
 */
export const isCardInMeld = (cardId, melds) => {
  return melds.some(meld => meld.some(card => card.id === cardId));
};

/**
 * Get the meld color for visual highlighting
 * @param {string} cardId - Card ID
 * @param {Array} melds - Array of melds
 * @returns {string|null} CSS class for border color or null
 */
export const getMeldColor = (cardId, melds) => {
  const colors = ['border-green-500', 'border-blue-500', 'border-purple-500', 'border-yellow-500'];
  for (let i = 0; i < melds.length; i++) {
    if (melds[i].some(card => card.id === cardId)) {
      return colors[i % colors.length];
    }
  }
  return null;
};
