import { SUITS, RANKS } from './constants';

/**
 * Find all valid non-overlapping melds in a hand
 * Uses an optimal algorithm to find the combination that minimizes deadwood
 * @param {Array} hand - Array of card objects
 * @returns {Array} Array of melds, where each meld is an array of cards
 */
export const findMelds = (hand) => {
  // First, find all possible melds (sets and runs)
  const allPossibleMelds = [];

  // Find all possible sets (3+ same rank)
  const rankGroups = {};
  hand.forEach(card => {
    if (!rankGroups[card.rank]) rankGroups[card.rank] = [];
    rankGroups[card.rank].push(card);
  });

  Object.entries(rankGroups).forEach(([rank, group]) => {
    if (group.length >= 3) {
      // Add all possible combinations of 3+ cards
      if (group.length === 3) {
        allPossibleMelds.push({ cards: group, type: 'set', rank });
      } else if (group.length === 4) {
        allPossibleMelds.push({ cards: group, type: 'set', rank });
        // Also add all combinations of 3
        for (let i = 0; i < group.length; i++) {
          const subset = group.filter((_, idx) => idx !== i);
          allPossibleMelds.push({ cards: subset, type: 'set', rank });
        }
      }
    }
  });

  // Find all possible runs (3+ consecutive same suit)
  SUITS.forEach(suit => {
    const suitCards = hand.filter(c => c.suit === suit).sort((a, b) => {
      return RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
    });

    if (suitCards.length >= 3) {
      for (let i = 0; i <= suitCards.length - 3; i++) {
        const run = [suitCards[i]];
        for (let j = i + 1; j < suitCards.length; j++) {
          const prevRankIndex = RANKS.indexOf(run[run.length - 1].rank);
          const currRankIndex = RANKS.indexOf(suitCards[j].rank);
          if (currRankIndex === prevRankIndex + 1) {
            run.push(suitCards[j]);
          } else {
            break;
          }
        }
        if (run.length >= 3) {
          allPossibleMelds.push({ cards: run, type: 'run', suit });
        }
      }
    }
  });

  // If no possible melds, return empty array
  if (allPossibleMelds.length === 0) {
    return [];
  }

  // Find the best combination of non-overlapping melds that minimizes deadwood
  // Use backtracking to try all valid combinations
  let bestMelds = [];
  let bestDeadwood = hand.reduce((sum, card) => sum + card.value, 0);

  const findBestCombination = (meldIndex, currentMelds, usedCardIds) => {
    // Calculate current deadwood
    const deadwoodCards = hand.filter(card => !usedCardIds.has(card.id));
    const deadwoodValue = deadwoodCards.reduce((sum, card) => sum + card.value, 0);

    // Update best if this is better
    if (deadwoodValue < bestDeadwood) {
      bestDeadwood = deadwoodValue;
      bestMelds = [...currentMelds];
    }

    // Try adding more melds
    for (let i = meldIndex; i < allPossibleMelds.length; i++) {
      const meld = allPossibleMelds[i];

      // Check if this meld overlaps with already used cards
      const hasOverlap = meld.cards.some(card => usedCardIds.has(card.id));

      if (!hasOverlap) {
        // Add this meld and recurse
        const newUsedCardIds = new Set(usedCardIds);
        meld.cards.forEach(card => newUsedCardIds.add(card.id));

        findBestCombination(i + 1, [...currentMelds, meld.cards], newUsedCardIds);
      }
    }
  };

  findBestCombination(0, [], new Set());

  return bestMelds;
};

/**
 * Calculate deadwood value for a hand
 * Deadwood is the sum of card values not in melds
 * @param {Array} hand - Array of card objects
 * @returns {number} Total deadwood value
 */
export const calculateDeadwood = (hand) => {
  const melds = findMelds(hand);
  const meldedCards = new Set(melds.flat());
  const deadwood = hand.filter(card => !meldedCards.has(card));
  return deadwood.reduce((sum, card) => sum + card.value, 0);
};

/**
 * Sort hand with melds first, then deadwood
 * Within each section, sort by rank then suit
 * @param {Array} hand - Array of card objects
 * @param {boolean} shouldSort - Whether to sort
 * @returns {Array} Sorted hand
 */
export const sortHand = (hand, shouldSort = true) => {
  if (!shouldSort) return hand;

  const melds = findMelds(hand);
  const meldedCardIds = new Set(melds.flat().map(card => card.id));

  // Separate deadwood cards from melded cards
  const deadwoodCards = hand.filter(card => !meldedCardIds.has(card.id));

  // Sort function: by rank first, then by suit within rank
  const sortByRankThenSuit = (a, b) => {
    const rankDiff = RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
    if (rankDiff !== 0) return rankDiff;
    return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
  };

  // Sort melded cards (keeping meld groups together)
  const sortedMeldedCards = [];
  melds.forEach(meld => {
    const sortedMeld = [...meld].sort(sortByRankThenSuit);
    sortedMeldedCards.push(...sortedMeld);
  });

  // Sort deadwood cards
  const sortedDeadwood = [...deadwoodCards].sort(sortByRankThenSuit);

  // Return melds first, then deadwood
  return [...sortedMeldedCards, ...sortedDeadwood];
};
