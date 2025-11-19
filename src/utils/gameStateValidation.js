/**
 * Game State Validation Utilities
 *
 * Utilities for validating game state and detecting issues like duplicate cards
 */

/**
 * Check if there are any duplicate cards across all game areas
 * @param {Object} gameState - The game state to check
 * @param {Array} gameState.playerHand - Player's hand
 * @param {Array} gameState.aiHand - AI opponent's hand
 * @param {Array} gameState.deck - The deck
 * @param {Array} gameState.discardPile - The discard pile
 * @returns {Object} { hasDuplicates: boolean, duplicates: Array, report: string }
 */
export const checkForDuplicateCards = (gameState) => {
  const { playerHand = [], aiHand = [], deck = [], discardPile = [] } = gameState;

  // Collect all cards with their locations
  const cardMap = new Map();
  const duplicates = [];

  // Helper to add cards to the map
  const addCards = (cards, location) => {
    cards.forEach(card => {
      if (!card || !card.id) return; // Skip invalid cards

      if (cardMap.has(card.id)) {
        // Duplicate found!
        const existing = cardMap.get(card.id);
        duplicates.push({
          cardId: card.id,
          card: card,
          locations: [...existing.locations, location]
        });
        existing.locations.push(location);
      } else {
        cardMap.set(card.id, {
          card: card,
          locations: [location]
        });
      }
    });
  };

  // Check all game areas
  addCards(playerHand, 'playerHand');
  addCards(aiHand, 'aiHand');
  addCards(deck, 'deck');
  addCards(discardPile, 'discardPile');

  // Generate report
  let report = '';
  if (duplicates.length > 0) {
    report = `Found ${duplicates.length} duplicate card(s):\n`;
    duplicates.forEach(dup => {
      report += `  - Card ${dup.cardId} (${dup.card.rank} of ${dup.card.suit}) found in: ${dup.locations.join(', ')}\n`;
    });
  } else {
    report = 'No duplicate cards found.';
  }

  // Add card count summary
  report += `\nCard counts:\n`;
  report += `  - Player Hand: ${playerHand.length}\n`;
  report += `  - AI Hand: ${aiHand.length}\n`;
  report += `  - Deck: ${deck.length}\n`;
  report += `  - Discard Pile: ${discardPile.length}\n`;
  report += `  - Total: ${playerHand.length + aiHand.length + deck.length + discardPile.length} (should be 52)\n`;

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates: duplicates,
    report: report,
    totalCards: playerHand.length + aiHand.length + deck.length + discardPile.length
  };
};

/**
 * Validate that the game state has exactly 52 unique cards
 * @param {Object} gameState - The game state to validate
 * @returns {Object} { isValid: boolean, message: string, details: Object }
 */
export const validateGameState = (gameState) => {
  const duplicateCheck = checkForDuplicateCards(gameState);

  const isValid = !duplicateCheck.hasDuplicates && duplicateCheck.totalCards === 52;

  let message = '';
  if (duplicateCheck.hasDuplicates) {
    message = 'Game state invalid: Duplicate cards detected!';
  } else if (duplicateCheck.totalCards !== 52) {
    message = `Game state invalid: Found ${duplicateCheck.totalCards} cards (expected 52)`;
  } else {
    message = 'Game state is valid.';
  }

  return {
    isValid: isValid,
    message: message,
    details: duplicateCheck
  };
};

/**
 * Log game state validation to console
 * @param {Object} gameState - The game state to validate
 * @param {string} context - Context for the validation (e.g., "After Lucky Draw")
 */
export const logGameStateValidation = (gameState, context = '') => {
  const validation = validateGameState(gameState);

  const prefix = context ? `[${context}] ` : '';

  if (!validation.isValid) {
    console.error(`${prefix}${validation.message}`);
    console.error(validation.details.report);
  } else {
    console.log(`${prefix}${validation.message}`);
  }

  return validation;
};
