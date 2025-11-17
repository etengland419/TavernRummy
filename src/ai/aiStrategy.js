import { DIFFICULTY_LEVELS, AI_KNOCK_THRESHOLDS, GAME_CONFIG } from '../utils/constants';
import { findMelds, calculateDeadwood } from '../utils/meldUtils';

/**
 * Decide whether AI should take from discard pile
 * @param {Object} topDiscard - Top card of discard pile
 * @param {Array} aiHand - AI's current hand
 * @param {string} difficulty - Current difficulty level
 * @returns {boolean} Whether AI should take from discard
 */
export const shouldTakeFromDiscard = (topDiscard, aiHand, difficulty) => {
  if (!topDiscard) return false;

  const testHand = [...aiHand, topDiscard];
  const currentDeadwood = calculateDeadwood(aiHand);
  const testDeadwood = calculateDeadwood(testHand);

  let shouldTake = false;

  if (difficulty === DIFFICULTY_LEVELS.HARD) {
    // Hard AI: Always takes if it reduces deadwood OR forms new meld
    const currentMelds = findMelds(aiHand).length;
    const testMelds = findMelds(testHand).length;
    shouldTake = testDeadwood < currentDeadwood || testMelds > currentMelds;
  } else if (difficulty === DIFFICULTY_LEVELS.MEDIUM) {
    // Medium AI: Takes if significantly reduces deadwood (70% chance)
    shouldTake = testDeadwood < currentDeadwood && Math.random() > 0.3;
  } else {
    // Easy/Tutorial AI: Takes if greatly reduces deadwood (50% chance)
    shouldTake = testDeadwood < currentDeadwood - 2 && Math.random() > 0.5;
  }

  return shouldTake;
};

/**
 * Choose which card AI should discard
 * @param {Array} aiHand - AI's current hand
 * @returns {Object} Card to discard
 */
export const chooseDiscardCard = (aiHand) => {
  const melds = findMelds(aiHand);
  const meldedCards = new Set(melds.flat());
  const deadwoodCards = aiHand.filter(c => !meldedCards.has(c));

  let cardToDiscard;
  if (deadwoodCards.length > 0) {
    // Sort deadwood by value (highest first)
    deadwoodCards.sort((a, b) => b.value - a.value);
    cardToDiscard = deadwoodCards[0];
  } else {
    // All cards are in melds, discard first card
    cardToDiscard = aiHand[0];
  }

  return cardToDiscard;
};

/**
 * Decide whether AI should knock
 * @param {Array} aiHand - AI's current hand (after discarding)
 * @param {string} difficulty - Current difficulty level
 * @returns {boolean} Whether AI should knock
 */
export const shouldKnock = (aiHand, difficulty) => {
  const aiDeadwood = calculateDeadwood(aiHand);
  const threshold = AI_KNOCK_THRESHOLDS[difficulty] || GAME_CONFIG.KNOCK_THRESHOLD;
  return aiDeadwood <= threshold;
};

/**
 * Execute full AI turn logic
 * Returns an object with AI's decision
 * @param {Array} aiHand - AI's current hand
 * @param {Array} deck - Current deck
 * @param {Array} discardPile - Current discard pile
 * @param {string} difficulty - Current difficulty level
 * @returns {Object} AI decision {drawSource, drawnCard, discardCard, shouldKnock}
 */
export const executeAITurn = (aiHand, deck, discardPile, difficulty) => {
  if (deck.length === 0) {
    return { deckEmpty: true };
  }

  const topDiscard = discardPile[discardPile.length - 1];
  let drawSource;
  let drawnCard;

  // Decide where to draw from
  if (shouldTakeFromDiscard(topDiscard, aiHand, difficulty)) {
    drawSource = 'discard';
    drawnCard = topDiscard;
  } else {
    drawSource = 'deck';
    drawnCard = deck[deck.length - 1];
  }

  // Add drawn card to hand
  const newHand = [...aiHand, drawnCard];

  // Choose card to discard
  const cardToDiscard = chooseDiscardCard(newHand);

  // Final hand after discard
  const finalHand = newHand.filter(c => c.id !== cardToDiscard.id);

  // Decide whether to knock
  const willKnock = shouldKnock(finalHand, difficulty);

  return {
    drawSource,
    drawnCard,
    discardCard: cardToDiscard,
    shouldKnock: willKnock,
    finalHand
  };
};
