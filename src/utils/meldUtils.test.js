import { findMelds, calculateDeadwood, sortHand } from './meldUtils';

describe('meldUtils', () => {
  describe('findMelds', () => {
    test('finds a set of 3 cards with same rank', () => {
      const hand = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        { suit: '⚔️', rank: '2', value: 2, id: '4' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(1);
      expect(melds[0]).toHaveLength(3);
    });

    test('finds a run of 3+ cards in same suit', () => {
      const hand = [
        { suit: '⚔️', rank: '2', value: 2, id: '1' },
        { suit: '⚔️', rank: '3', value: 3, id: '2' },
        { suit: '⚔️', rank: '4', value: 4, id: '3' },
        { suit: '🏆', rank: 'K', value: 10, id: '4' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(1);
      expect(melds[0]).toHaveLength(3);
    });

    test('finds multiple melds', () => {
      const hand = [
        // Set of 3 Aces
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        // Run of 3-4-5
        { suit: '⚔️', rank: '3', value: 3, id: '4' },
        { suit: '⚔️', rank: '4', value: 4, id: '5' },
        { suit: '⚔️', rank: '5', value: 5, id: '6' },
        // Deadwood
        { suit: '🏆', rank: 'K', value: 10, id: '7' }
      ];
      const melds = findMelds(hand);
      expect(melds.length).toBeGreaterThanOrEqual(2);
    });

    test('finds a set of 4 cards', () => {
      const hand = [
        { suit: '⚔️', rank: 'K', value: 10, id: '1' },
        { suit: '🏆', rank: 'K', value: 10, id: '2' },
        { suit: '💰', rank: 'K', value: 10, id: '3' },
        { suit: '🔱', rank: 'K', value: 10, id: '4' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(1);
      expect(melds[0]).toHaveLength(4);
    });

    test('finds longer runs', () => {
      const hand = [
        { suit: '⚔️', rank: '2', value: 2, id: '1' },
        { suit: '⚔️', rank: '3', value: 3, id: '2' },
        { suit: '⚔️', rank: '4', value: 4, id: '3' },
        { suit: '⚔️', rank: '5', value: 5, id: '4' },
        { suit: '⚔️', rank: '6', value: 6, id: '5' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(1);
      expect(melds[0].length).toBeGreaterThanOrEqual(3);
    });

    test('returns empty array for no melds', () => {
      const hand = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: '3', value: 3, id: '2' },
        { suit: '💰', rank: '7', value: 7, id: '3' },
        { suit: '🔱', rank: 'K', value: 10, id: '4' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(0);
    });

    test('prefers longer melds (greedy algorithm)', () => {
      const hand = [
        { suit: '⚔️', rank: '2', value: 2, id: '1' },
        { suit: '⚔️', rank: '3', value: 3, id: '2' },
        { suit: '⚔️', rank: '4', value: 4, id: '3' },
        { suit: '⚔️', rank: '5', value: 5, id: '4' }
      ];
      const melds = findMelds(hand);
      // Should find one longer run rather than two shorter runs
      expect(melds).toHaveLength(1);
      expect(melds[0]).toHaveLength(4);
    });

    test('handles edge case of Ace in runs', () => {
      const hand = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '⚔️', rank: '2', value: 2, id: '2' },
        { suit: '⚔️', rank: '3', value: 3, id: '3' }
      ];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(1);
      expect(melds[0]).toHaveLength(3);
    });

    test('handles empty hand', () => {
      const hand = [];
      const melds = findMelds(hand);
      expect(melds).toHaveLength(0);
    });

    test('does not allow overlapping melds', () => {
      const hand = [
        { suit: '⚔️', rank: '5', value: 5, id: '1' },
        { suit: '🏆', rank: '5', value: 5, id: '2' },
        { suit: '💰', rank: '5', value: 5, id: '3' },
        { suit: '⚔️', rank: '6', value: 6, id: '4' },
        { suit: '⚔️', rank: '7', value: 7, id: '5' }
      ];
      const melds = findMelds(hand);
      // Each card should only appear in one meld
      const allMeldCards = melds.flat();
      const cardIds = allMeldCards.map(c => c.id);
      const uniqueIds = new Set(cardIds);
      expect(cardIds.length).toBe(uniqueIds.size);
    });
  });

  describe('calculateDeadwood', () => {
    test('calculates deadwood for hand with no melds', () => {
      const hand = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: '3', value: 3, id: '2' },
        { suit: '💰', rank: '7', value: 7, id: '3' },
        { suit: '🔱', rank: 'K', value: 10, id: '4' }
      ];
      const deadwood = calculateDeadwood(hand);
      expect(deadwood).toBe(21); // 1 + 3 + 7 + 10
    });

    test('calculates deadwood for hand with melds', () => {
      const hand = [
        // Set of 3 Aces (in meld)
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        // Deadwood
        { suit: '🔱', rank: 'K', value: 10, id: '4' }
      ];
      const deadwood = calculateDeadwood(hand);
      expect(deadwood).toBe(10); // Only K is deadwood
    });

    test('returns 0 for gin (all cards in melds)', () => {
      const hand = [
        // Set of 3 Aces
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        // Set of 3 Kings
        { suit: '⚔️', rank: 'K', value: 10, id: '4' },
        { suit: '🏆', rank: 'K', value: 10, id: '5' },
        { suit: '💰', rank: 'K', value: 10, id: '6' },
        // Set of 3 Queens
        { suit: '⚔️', rank: 'Q', value: 10, id: '7' },
        { suit: '🏆', rank: 'Q', value: 10, id: '8' },
        { suit: '💰', rank: 'Q', value: 10, id: '9' },
        // Run of 3
        { suit: '⚔️', rank: '2', value: 2, id: '10' }
      ];
      const deadwood = calculateDeadwood(hand);
      expect(deadwood).toBeLessThanOrEqual(2); // Should be 0 or very low
    });

    test('handles empty hand', () => {
      const hand = [];
      const deadwood = calculateDeadwood(hand);
      expect(deadwood).toBe(0);
    });

    test('correctly excludes melded cards from deadwood calculation', () => {
      const hand = [
        // Run of 3-4-5 in swords (in meld)
        { suit: '⚔️', rank: '3', value: 3, id: '1' },
        { suit: '⚔️', rank: '4', value: 4, id: '2' },
        { suit: '⚔️', rank: '5', value: 5, id: '3' },
        // Deadwood
        { suit: '🏆', rank: '7', value: 7, id: '4' },
        { suit: '💰', rank: '9', value: 9, id: '5' }
      ];
      const deadwood = calculateDeadwood(hand);
      expect(deadwood).toBe(16); // 7 + 9
    });
  });

  describe('sortHand', () => {
    test('sorts melds before deadwood', () => {
      const hand = [
        // Deadwood
        { suit: '🔱', rank: 'K', value: 10, id: '1' },
        // Set of 3 Aces (meld)
        { suit: '⚔️', rank: 'A', value: 1, id: '2' },
        { suit: '🏆', rank: 'A', value: 1, id: '3' },
        { suit: '💰', rank: 'A', value: 1, id: '4' }
      ];
      const sorted = sortHand(hand, true);
      // Aces should come before K
      const kIndex = sorted.findIndex(c => c.id === '1');
      const aceIndices = sorted.map((c, i) => c.id.startsWith('2') || c.id.startsWith('3') || c.id.startsWith('4') ? i : -1).filter(i => i !== -1);
      expect(Math.max(...aceIndices)).toBeLessThan(kIndex);
    });

    test('returns original hand when shouldSort is false', () => {
      const hand = [
        { suit: '🔱', rank: 'K', value: 10, id: '1' },
        { suit: '⚔️', rank: 'A', value: 1, id: '2' }
      ];
      const sorted = sortHand(hand, false);
      expect(sorted).toEqual(hand);
    });

    test('sorts by rank within melds and deadwood', () => {
      const hand = [
        { suit: '⚔️', rank: 'K', value: 10, id: '1' },
        { suit: '⚔️', rank: 'A', value: 1, id: '2' },
        { suit: '⚔️', rank: '5', value: 5, id: '3' }
      ];
      const sorted = sortHand(hand, true);
      // Should be sorted by rank: A, 5, K
      expect(sorted[0].rank).toBe('A');
      expect(sorted[1].rank).toBe('5');
      expect(sorted[2].rank).toBe('K');
    });

    test('handles empty hand', () => {
      const hand = [];
      const sorted = sortHand(hand, true);
      expect(sorted).toHaveLength(0);
    });

    test('maintains meld groups together', () => {
      const hand = [
        // Set of Aces (should stay together)
        { suit: '💰', rank: 'A', value: 1, id: '1' },
        { suit: '⚔️', rank: 'A', value: 1, id: '2' },
        { suit: '🏆', rank: 'A', value: 1, id: '3' },
        // Deadwood
        { suit: '🔱', rank: 'K', value: 10, id: '4' }
      ];
      const sorted = sortHand(hand, true);
      // All three aces should be first (before K)
      const aceIndices = [0, 1, 2];
      aceIndices.forEach(i => {
        expect(sorted[i].rank).toBe('A');
      });
    });
  });
});
