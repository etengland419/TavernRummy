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
 * Check if a card could be useful to the player based on recent discards
 * Expert+ AI uses this to avoid helping the player
 * @param {Object} card - Card to check
 * @param {Array} discardPile - Current discard pile
 * @returns {boolean} Whether card might help player
 */
const couldHelpPlayer = (card, discardPile) => {
  if (!discardPile || discardPile.length === 0) return false;

  // Check last few discards for patterns
  const recentDiscards = discardPile.slice(-5);

  // Check if player has been discarding this rank (unlikely they want it)
  const playerDiscardedThisRank = recentDiscards.some(c => c.rank === card.rank);
  if (playerDiscardedThisRank) return false;

  // Check if player has been keeping cards near this rank/suit
  const sameSuitCount = recentDiscards.filter(c => c.suit === card.suit).length;
  const sameRankCount = recentDiscards.filter(c => c.rank === card.rank).length;

  // If player discarded many cards of this suit/rank, they probably don't want it
  if (sameSuitCount >= 3 || sameRankCount >= 2) return false;

  // Otherwise, might be useful
  return true;
};

/**
 * Choose which card AI should discard
 * @param {Array} aiHand - AI's current hand
 * @param {string} difficulty - Current difficulty level
 * @param {Array} discardPile - Current discard pile (for Expert+ AI)
 * @returns {Object} Card to discard
 */
export const chooseDiscardCard = (aiHand, difficulty = DIFFICULTY_LEVELS.HARD, discardPile = []) => {
  const melds = findMelds(aiHand);
  const meldedCards = new Set(melds.flat());
  const deadwoodCards = aiHand.filter(c => !meldedCards.has(c));

  let cardToDiscard;
  if (deadwoodCards.length > 0) {
    // Sort deadwood by value (highest first)
    deadwoodCards.sort((a, b) => b.value - a.value);

    // Expert+ AI: Try to avoid giving player useful cards
    if (
      difficulty === DIFFICULTY_LEVELS.EXPERT ||
      difficulty === DIFFICULTY_LEVELS.MASTER ||
      difficulty === DIFFICULTY_LEVELS.LEGENDARY ||
      difficulty === DIFFICULTY_LEVELS.NIGHTMARE ||
      difficulty === DIFFICULTY_LEVELS.INFINITE
    ) {
      // Find a card that's high value but unlikely to help player
      const safeCards = deadwoodCards.filter(c => !couldHelpPlayer(c, discardPile));

      if (safeCards.length > 0) {
        cardToDiscard = safeCards[0];
      } else {
        // All cards might help player, discard lowest value instead
        cardToDiscard = deadwoodCards[deadwoodCards.length - 1];
      }
    } else {
      // Standard AI: Just discard highest deadwood
      cardToDiscard = deadwoodCards[0];
    }
  } else {
    // All cards are in melds, discard first card
    cardToDiscard = aiHand[0];
  }

  return cardToDiscard;
};

/**
 * Calculate estimated player deadwood based on their discards
 * Legendary+ AI uses this for opponent modeling
 * @param {Array} discardPile - Current discard pile
 * @param {number} deckSize - Remaining deck size
 * @returns {number} Estimated player deadwood (0-50)
 */
const estimatePlayerDeadwood = (discardPile, deckSize) => {
  if (!discardPile || discardPile.length === 0) return 30; // Mid-range estimate

  // Look at player's recent discards
  const playerDiscards = discardPile.filter((_, i) => i % 2 === 1); // Assuming player discards on odd turns

  // If player is discarding high value cards, they probably have a good hand
  const recentHighCards = playerDiscards.slice(-3).filter(c => c.value >= 8).length;
  if (recentHighCards >= 2) return 15; // Likely low deadwood

  // If player is discarding low value cards, they might have deadwood
  const recentLowCards = playerDiscards.slice(-3).filter(c => c.value <= 3).length;
  if (recentLowCards >= 2) return 25; // Likely medium deadwood

  // Early game estimate based on deck size
  if (deckSize > 30) return 35; // Early game, probably high deadwood
  if (deckSize > 15) return 25; // Mid game
  return 20; // Late game, probably improving hand
};

/**
 * Decide whether AI should knock
 * @param {Array} aiHand - AI's current hand (after discarding)
 * @param {string} difficulty - Current difficulty level
 * @param {Array} discardPile - Current discard pile (for Master+ AI)
 * @param {number} deckSize - Remaining deck size (for Master+ AI)
 * @returns {boolean} Whether AI should knock
 */
export const shouldKnock = (aiHand, difficulty, discardPile = [], deckSize = 0) => {
  const aiDeadwood = calculateDeadwood(aiHand);
  const threshold = AI_KNOCK_THRESHOLDS[difficulty] || GAME_CONFIG.KNOCK_THRESHOLD;

  // Basic check
  if (aiDeadwood > threshold) return false;
  if (aiDeadwood === 0) return true; // Always knock on GIN

  // Master+ AI: Probabilistic knock timing
  if (
    difficulty === DIFFICULTY_LEVELS.MASTER ||
    difficulty === DIFFICULTY_LEVELS.LEGENDARY ||
    difficulty === DIFFICULTY_LEVELS.NIGHTMARE ||
    difficulty === DIFFICULTY_LEVELS.INFINITE
  ) {
    // Calculate risk of being undercut
    const estimatedPlayerDeadwood = estimatePlayerDeadwood(discardPile, deckSize);

    // If we estimate player has higher deadwood, knock
    if (aiDeadwood < estimatedPlayerDeadwood - 5) return true;

    // If deck is running low, be more aggressive
    if (deckSize < 10 && aiDeadwood <= threshold) return true;

    // If we have very low deadwood (1-3), knock aggressively
    if (aiDeadwood <= 3) return true;

    // If we have medium deadwood (4-7) and player seems to have high deadwood, knock
    if (aiDeadwood <= 7 && estimatedPlayerDeadwood > 15) return true;

    // Otherwise, wait for better opportunity
    return aiDeadwood <= threshold - 3; // Be more conservative
  }

  // Standard AI: Simple threshold check
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

  // Choose card to discard (pass difficulty and discardPile for Expert+ AI)
  const cardToDiscard = chooseDiscardCard(newHand, difficulty, discardPile);

  // Final hand after discard
  const finalHand = newHand.filter(c => c.id !== cardToDiscard.id);

  // Decide whether to knock (pass discardPile and deck size for Master+ AI)
  const willKnock = shouldKnock(finalHand, difficulty, discardPile, deck.length);

  return {
    drawSource,
    drawnCard,
    discardCard: cardToDiscard,
    shouldKnock: willKnock,
    finalHand
  };
};
