import { RANKS, SUITS } from './constants';
import { findMelds } from './meldUtils';

/**
 * Helper: Check if hand has multiple unmatched face cards
 */
const hasMultipleUnmatchedFaceCards = (hand) => {
  const melds = findMelds(hand);
  const meldedCardIds = new Set(melds.flat().map(card => card.id));
  const unmatchedFaceCards = hand.filter(card =>
    !meldedCardIds.has(card.id) && ['J', 'Q', 'K'].includes(card.rank)
  );
  return unmatchedFaceCards.length >= 2;
};

/**
 * Helper: Get all unmatched face cards for highlighting
 */
const getUnmatchedFaceCards = (hand) => {
  const melds = findMelds(hand);
  const meldedCardIds = new Set(melds.flat().map(card => card.id));
  return hand.filter(card =>
    !meldedCardIds.has(card.id) && ['J', 'Q', 'K'].includes(card.rank)
  ).map(card => card.id);
};

/**
 * Helper: Calculate number of "outs" (possible meld completions) for a card
 */
const calculateOuts = (card, hand, deck, discardPile) => {
  if (!card) return 0;

  let outs = 0;
  const allVisibleCards = [...hand, ...(discardPile || [])];

  // Check for set potential (same rank)
  const sameRankInHand = hand.filter(c => c.rank === card.rank && c.id !== card.id).length;
  if (sameRankInHand >= 1) {
    // Need 1 more for a set (or already have 2, making a set)
    const sameRankVisible = allVisibleCards.filter(c => c.rank === card.rank).length;
    const sameRankRemaining = 4 - sameRankVisible;
    outs += sameRankRemaining;
  }

  // Check for run potential (sequential same suit)
  const cardRankIndex = RANKS.indexOf(card.rank);
  const sameSuitCards = hand.filter(c => c.suit === card.suit && c.id !== card.id);

  // Check cards that could extend to a run
  [-2, -1, 1, 2].forEach(offset => {
    const targetRankIndex = cardRankIndex + offset;
    if (targetRankIndex >= 0 && targetRankIndex < RANKS.length) {
      const targetRank = RANKS[targetRankIndex];
      const hasInHand = sameSuitCards.some(c => c.rank === targetRank);
      if (hasInHand) {
        // Check if the card needed to complete the run is available
        const neededRankIndex = offset > 0 ? cardRankIndex + offset + 1 : cardRankIndex + offset - 1;
        if (neededRankIndex >= 0 && neededRankIndex < RANKS.length) {
          const visible = allVisibleCards.filter(c =>
            c.suit === card.suit && c.rank === RANKS[neededRankIndex]
          ).length;
          if (visible < 1) outs++;
        }
      }
    }
  });

  return outs;
};

/**
 * Helper: Check if a discard is risky based on opponent's recent picks
 */
const isNearOpponentPicks = (card, opponentPicks = []) => {
  if (!card || opponentPicks.length === 0) return false;

  // Check if card is same rank as any recent opponent pick
  if (opponentPicks.some(pick => pick.rank === card.rank)) return true;

  // Check if card is same suit and close in rank
  for (const pick of opponentPicks) {
    if (pick.suit === card.suit) {
      const cardRankIndex = RANKS.indexOf(card.rank);
      const pickRankIndex = RANKS.indexOf(pick.rank);
      if (Math.abs(cardRankIndex - pickRankIndex) <= 2) return true;
    }
  }

  return false;
};

/**
 * Helper: Find safer discard alternatives
 */
const findSaferDiscards = (hand, opponentPicks = []) => {
  const melds = findMelds(hand);
  const meldedCardIds = new Set(melds.flat().map(card => card.id));
  const deadwood = hand.filter(card => !meldedCardIds.has(card));

  // Sort by safety score (lower is safer)
  const safetyScored = deadwood.map(card => {
    let score = 0;

    // Penalize cards near opponent picks
    if (isNearOpponentPicks(card, opponentPicks)) score += 10;

    // Penalize high cards
    score += card.value;

    // Prefer cards far from existing melds
    const outs = calculateOuts(card, hand);
    score += outs * 2;

    return { card, score };
  });

  safetyScored.sort((a, b) => a.score - b.score);
  return safetyScored.slice(0, 3).map(item => item.card);
};

/**
 * TIER 1: Basic Strategy Tips (5-10 tips)
 */
export const TIER_1_TIPS = {
  HIGH_DEADWOOD: {
    id: 'high_deadwood',
    tier: 1,
    category: 'basics',
    title: 'Reduce Your Deadwood',
    condition: (context) => {
      return context.deadwood > 30 && context.phase === 'discard';
    },
    getMessage: () => ({
      message: 'Try to form melds (3+ cards in sequence or same rank) to lower your deadwood',
      detail: 'Melds don\'t count toward your deadwood total'
    }),
    priority: 'high'
  },

  FACE_CARDS: {
    id: 'face_cards',
    tier: 1,
    category: 'basics',
    title: 'High Card Risk',
    condition: (context) => {
      return hasMultipleUnmatchedFaceCards(context.hand) && context.phase === 'discard';
    },
    getMessage: (context) => ({
      message: 'Kings, Queens, and Jacks are worth 10 points each - risky to keep unmatched',
      detail: 'Consider discarding high-value cards that aren\'t in melds',
      highlightCards: getUnmatchedFaceCards(context.hand)
    }),
    priority: 'medium'
  },

  CAN_KNOCK: {
    id: 'can_knock',
    tier: 1,
    category: 'basics',
    title: 'You Can Knock!',
    condition: (context) => {
      return context.deadwood <= 10 && context.phase === 'discard' && !context.hasKnocked;
    },
    getMessage: (context) => ({
      message: `You have ${context.deadwood} deadwood - low enough to knock and end the round!`,
      detail: 'Click the "Knock" button to end the round and score points'
    }),
    priority: 'high'
  },

  GOING_FOR_GIN: {
    id: 'going_for_gin',
    tier: 1,
    category: 'basics',
    title: 'Almost Gin!',
    condition: (context) => {
      return context.deadwood > 0 && context.deadwood <= 5 && context.phase === 'discard';
    },
    getMessage: (context) => ({
      message: 'You\'re very close to Gin (0 deadwood)!',
      detail: 'Gin earns a +25 gold bonus. Consider waiting for the perfect card.'
    }),
    priority: 'medium'
  },

  DECK_RUNNING_LOW: {
    id: 'deck_running_low',
    tier: 1,
    category: 'basics',
    title: 'Deck Running Low',
    condition: (context) => {
      return context.deckSize <= 10 && context.deckSize > 2 && context.deadwood > 10;
    },
    getMessage: (context) => ({
      message: `Only ${context.deckSize} cards left in the deck!`,
      detail: 'Try to knock soon, or the round may end in a draw'
    }),
    priority: 'high'
  }
};

/**
 * TIER 2: Intermediate Strategy Tips (10-15 tips)
 */
export const TIER_2_TIPS = {
  MELD_POTENTIAL: {
    id: 'meld_potential',
    tier: 2,
    category: 'strategy',
    title: 'Strong Meld Potential',
    condition: (context) => {
      if (!context.selectedCard || context.phase !== 'discard') return false;
      const outs = calculateOuts(context.selectedCard, context.hand);
      return outs >= 4;
    },
    getMessage: (context) => {
      const outs = calculateOuts(context.selectedCard, context.hand);
      return {
        message: 'This card has strong meld potential - it could complete multiple melds',
        detail: `${outs} possible cards could help form a meld with this card`
      };
    },
    priority: 'medium'
  },

  DEFENSIVE_DISCARD: {
    id: 'defensive_discard',
    tier: 2,
    category: 'strategy',
    title: 'Risky Discard',
    condition: (context) => {
      if (!context.selectedCard || context.phase !== 'discard') return false;
      return isNearOpponentPicks(context.selectedCard, context.opponentPicks);
    },
    getMessage: (context) => {
      const safer = findSaferDiscards(context.hand, context.opponentPicks);
      return {
        message: 'Your opponent recently picked similar cards - this discard might help them',
        detail: 'Consider discarding a card less likely to help your opponent',
        suggestion: safer.length > 0 ? `Safer options: ${safer.map(c => c.rank + c.suit).join(', ')}` : null
      };
    },
    priority: 'medium'
  },

  KNOCK_TIMING_EARLY: {
    id: 'knock_timing_early',
    tier: 2,
    category: 'strategy',
    title: 'Knock Now or Wait?',
    condition: (context) => {
      return context.deadwood >= 4 && context.deadwood <= 7 &&
             context.phase === 'discard' && context.turnCount >= 5;
    },
    getMessage: (context) => ({
      message: 'Strategic decision: Knock now for a safe win, or wait for Gin?',
      detail: 'Knocking: Safe ~2-4 pts. Waiting: Chance at +25 Gin bonus, but opponent might knock first'
    }),
    priority: 'medium'
  },

  DRAW_FROM_DISCARD: {
    id: 'draw_from_discard',
    tier: 2,
    category: 'strategy',
    title: 'Draw from Discard?',
    condition: (context) => {
      if (context.phase !== 'draw' || !context.discardTop) return false;
      const outs = calculateOuts(context.discardTop, context.hand);
      return outs >= 3;
    },
    getMessage: (context) => {
      const outs = calculateOuts(context.discardTop, context.hand);
      return {
        message: 'The discard pile\'s top card has good potential for your hand',
        detail: `Drawing it gives you ${outs} ways to complete a meld`
      };
    },
    priority: 'low'
  },

  AVOID_DRAW_FROM_DISCARD: {
    id: 'avoid_draw_from_discard',
    tier: 2,
    category: 'strategy',
    title: 'Risky Draw',
    condition: (context) => {
      if (context.phase !== 'draw' || !context.discardTop) return false;
      const outs = calculateOuts(context.discardTop, context.hand);
      return outs <= 1;
    },
    getMessage: () => ({
      message: 'Drawing from discard reveals your strategy to your opponent',
      detail: 'Only draw from discard if it significantly helps your hand'
    }),
    priority: 'low'
  },

  DEADWOOD_DISTRIBUTION: {
    id: 'deadwood_distribution',
    tier: 2,
    category: 'strategy',
    title: 'Spread Your Risk',
    condition: (context) => {
      if (context.phase !== 'discard') return false;
      const melds = findMelds(context.hand);
      const meldedCardIds = new Set(melds.flat().map(card => card.id));
      const deadwood = context.hand.filter(card => !meldedCardIds.has(card));

      // Check if deadwood has multiple high cards
      const highCards = deadwood.filter(card => card.value >= 8);
      return highCards.length >= 3 && context.deadwood >= 25;
    },
    getMessage: () => ({
      message: 'You have several high-value deadwood cards',
      detail: 'Try to keep low-value cards as deadwood - they\'re safer if you lose'
    }),
    priority: 'medium'
  },

  OPPONENT_LIKELY_CLOSE: {
    id: 'opponent_likely_close',
    tier: 2,
    category: 'strategy',
    title: 'Opponent May Be Close',
    condition: (context) => {
      return context.opponentPicks && context.opponentPicks.length >= 3 &&
             context.deadwood <= 10 && context.turnCount >= 6;
    },
    getMessage: () => ({
      message: 'Your opponent has drawn from discard multiple times - they may be close to knocking',
      detail: 'Consider knocking soon if you can, before they knock first'
    }),
    priority: 'high'
  },

  MIDDLE_CARDS_VALUABLE: {
    id: 'middle_cards_valuable',
    tier: 2,
    category: 'strategy',
    title: 'Middle Cards Are Flexible',
    condition: (context) => {
      if (!context.selectedCard || context.phase !== 'discard') return false;
      const rank = context.selectedCard.rank;
      const rankIndex = RANKS.indexOf(rank);
      // Middle cards are 4-9
      return rankIndex >= 3 && rankIndex <= 8;
    },
    getMessage: () => ({
      message: 'Middle-rank cards (4-9) have more meld potential than edge cards',
      detail: 'They can form runs in both directions, making them valuable to keep'
    }),
    priority: 'low'
  },

  EDGE_CARDS_LIMITED: {
    id: 'edge_cards_limited',
    tier: 2,
    category: 'strategy',
    title: 'Edge Cards Less Flexible',
    condition: (context) => {
      if (!context.selectedCard || context.phase !== 'discard') return false;
      const rank = context.selectedCard.rank;
      const melds = findMelds(context.hand);
      const meldedCardIds = new Set(melds.flat().map(card => card.id));
      const isInMeld = meldedCardIds.has(context.selectedCard.id);

      // Aces and Kings not in melds
      return !isInMeld && (rank === 'A' || rank === 'K');
    },
    getMessage: (context) => {
      const rank = context.selectedCard.rank;
      return {
        message: `${rank}s can only form runs in one direction, limiting meld options`,
        detail: rank === 'K' ? 'Kings are worth 10 points - high risk if unmatched' : 'Aces are low risk at 1 point'
      };
    },
    priority: 'low'
  },

  CARD_COUNTING_BASIC: {
    id: 'card_counting_basic',
    tier: 2,
    category: 'strategy',
    title: 'Card Counting',
    condition: (context) => {
      if (!context.selectedCard || context.phase !== 'discard') return false;

      // Count how many of the same rank are visible
      const allVisible = [...context.hand, ...(context.discardPile || [])];
      const sameRank = allVisible.filter(c => c.rank === context.selectedCard.rank);
      return sameRank.length === 3;
    },
    getMessage: (context) => {
      const rank = context.selectedCard.rank;
      return {
        message: `3 of 4 ${rank}s are visible - the last one is likely in the deck or opponent's hand`,
        detail: 'Use this knowledge to avoid holding cards unlikely to complete melds'
      };
    },
    priority: 'low'
  },

  UNDERCUT_OPPORTUNITY: {
    id: 'undercut_opportunity',
    tier: 2,
    category: 'strategy',
    title: 'Undercut Potential',
    condition: (context) => {
      // This tip appears when opponent seems aggressive (many discard picks)
      // and player has very low deadwood
      return context.opponentPicks && context.opponentPicks.length >= 2 &&
             context.deadwood <= 6 && context.turnCount >= 4;
    },
    getMessage: () => ({
      message: 'Your deadwood is very low - if your opponent knocks, you might undercut them!',
      detail: 'Undercut: Win by having equal or less deadwood when opponent knocks (+25 bonus)'
    }),
    priority: 'low'
  },

  KEEP_OPTIONS_OPEN: {
    id: 'keep_options_open',
    tier: 2,
    category: 'strategy',
    title: 'Maintain Flexibility',
    condition: (context) => {
      if (context.phase !== 'discard') return false;

      // Check if player has connector cards (sequential cards)
      const melds = findMelds(context.hand);
      const meldedCardIds = new Set(melds.flat().map(card => card.id));
      const deadwood = context.hand.filter(card => !meldedCardIds.has(card));

      // Find pairs of sequential cards in same suit
      let connectorPairs = 0;
      SUITS.forEach(suit => {
        const suitCards = deadwood.filter(c => c.suit === suit)
          .sort((a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank));

        for (let i = 0; i < suitCards.length - 1; i++) {
          const rankDiff = RANKS.indexOf(suitCards[i + 1].rank) - RANKS.indexOf(suitCards[i].rank);
          if (rankDiff === 1) connectorPairs++;
        }
      });

      return connectorPairs >= 2;
    },
    getMessage: () => ({
      message: 'You have several connector cards - they give you flexibility for future melds',
      detail: 'Holding sequential cards (like 6-7 or 8-9) keeps multiple meld options open'
    }),
    priority: 'low'
  }
};

/**
 * Combine all tips
 */
export const ALL_TIPS = {
  ...TIER_1_TIPS,
  ...TIER_2_TIPS
};

/**
 * Evaluate which tips are applicable based on game context
 * @param {Object} context - Game state context
 * @returns {Array} Array of applicable tips with their messages
 */
export const evaluateTips = (context) => {
  const applicableTips = [];

  Object.values(ALL_TIPS).forEach(tip => {
    try {
      if (tip.condition(context)) {
        const messageData = tip.getMessage(context);
        applicableTips.push({
          ...tip,
          ...messageData
        });
      }
    } catch (error) {
      // Silently skip tips that error out
      console.debug(`Tip ${tip.id} evaluation error:`, error);
    }
  });

  return applicableTips;
};

/**
 * Get tip priority based on mastery and context
 * @param {Array} tips - Array of applicable tips
 * @param {Object} tipMastery - Mastery data for each tip
 * @returns {Object|null} Single prioritized tip or null
 */
export const getPrioritizedTip = (tips, tipMastery = {}) => {
  if (tips.length === 0) return null;

  // Score each tip
  const scoredTips = tips.map(tip => {
    let score = 0;

    // Priority weight (high = 3, medium = 2, low = 1)
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    score += priorityWeights[tip.priority || 'medium'];

    // Mastery weight (prefer low mastery tips)
    const mastery = tipMastery[tip.id];
    if (!mastery || mastery.seen === 0) {
      // Never seen before - high priority
      score += 5;
    } else {
      const masteryPercent = mastery.applied / mastery.seen;
      if (masteryPercent < 0.3) {
        // Low mastery - needs reinforcement
        score += 3;
      } else if (masteryPercent < 0.6) {
        // Medium mastery
        score += 1;
      } else {
        // High mastery - deprioritize
        score -= 2;
      }
    }

    // Tier weight (prefer showing Tier 1 before Tier 2)
    score += tip.tier === 1 ? 2 : 0;

    return { tip, score };
  });

  // Sort by score (highest first)
  scoredTips.sort((a, b) => b.score - a.score);

  // Return highest scoring tip
  return scoredTips[0].tip;
};
