import { getRankValue, createDeck, shuffleDeck, isCardInMeld, getMeldColor } from './cardUtils';
import { SUITS, RANKS } from './constants';

describe('cardUtils', () => {
  describe('getRankValue', () => {
    test('returns 1 for Ace', () => {
      expect(getRankValue('A')).toBe(1);
    });

    test('returns 10 for face cards', () => {
      expect(getRankValue('J')).toBe(10);
      expect(getRankValue('Q')).toBe(10);
      expect(getRankValue('K')).toBe(10);
    });

    test('returns numeric value for number cards', () => {
      expect(getRankValue('2')).toBe(2);
      expect(getRankValue('5')).toBe(5);
      expect(getRankValue('10')).toBe(10);
    });
  });

  describe('createDeck', () => {
    test('creates a deck with 52 cards', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    test('creates a deck with correct structure', () => {
      const deck = createDeck();
      const card = deck[0];
      expect(card).toHaveProperty('suit');
      expect(card).toHaveProperty('rank');
      expect(card).toHaveProperty('value');
      expect(card).toHaveProperty('id');
    });

    test('deck contains all suits and ranks', () => {
      const deck = createDeck();
      const suits = new Set(deck.map(c => c.suit));
      const ranks = new Set(deck.map(c => c.rank));

      expect(suits.size).toBe(SUITS.length);
      expect(ranks.size).toBe(RANKS.length);
    });

    test('creates unique IDs for each card', () => {
      const deck = createDeck();
      const ids = deck.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(52);
    });

    test('deck is shuffled (not in original order)', () => {
      const deck1 = createDeck();
      const deck2 = createDeck();
      // Very unlikely to get same shuffle twice
      const deck1Ids = deck1.map(c => c.id).join(',');
      const deck2Ids = deck2.map(c => c.id).join(',');
      expect(deck1Ids).not.toBe(deck2Ids);
    });
  });

  describe('shuffleDeck', () => {
    test('returns array of same length', () => {
      const deck = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: '2', value: 2, id: '2' },
        { suit: '💰', rank: '3', value: 3, id: '3' }
      ];
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(3);
    });

    test('contains all original cards', () => {
      const deck = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: '2', value: 2, id: '2' },
        { suit: '💰', rank: '3', value: 3, id: '3' }
      ];
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toEqual(expect.arrayContaining(deck));
    });

    test('does not mutate original array', () => {
      const deck = [
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: '2', value: 2, id: '2' }
      ];
      const originalFirstCard = deck[0];
      shuffleDeck(deck);
      expect(deck[0]).toBe(originalFirstCard);
    });
  });

  describe('isCardInMeld', () => {
    const melds = [
      [
        { suit: '⚔️', rank: 'A', value: 1, id: 'card-1' },
        { suit: '🏆', rank: 'A', value: 1, id: 'card-2' },
        { suit: '💰', rank: 'A', value: 1, id: 'card-3' }
      ],
      [
        { suit: '⚔️', rank: '2', value: 2, id: 'card-4' },
        { suit: '⚔️', rank: '3', value: 3, id: 'card-5' },
        { suit: '⚔️', rank: '4', value: 4, id: 'card-6' }
      ]
    ];

    test('returns true for card in meld', () => {
      expect(isCardInMeld('card-1', melds)).toBe(true);
      expect(isCardInMeld('card-5', melds)).toBe(true);
    });

    test('returns false for card not in meld', () => {
      expect(isCardInMeld('card-99', melds)).toBe(false);
    });

    test('returns false for empty melds array', () => {
      expect(isCardInMeld('card-1', [])).toBe(false);
    });
  });

  describe('getMeldColor', () => {
    const melds = [
      [
        { suit: '⚔️', rank: 'A', value: 1, id: 'card-1' },
        { suit: '🏆', rank: 'A', value: 1, id: 'card-2' }
      ],
      [
        { suit: '⚔️', rank: '2', value: 2, id: 'card-3' },
        { suit: '⚔️', rank: '3', value: 3, id: 'card-4' }
      ],
      [
        { suit: '💰', rank: '5', value: 5, id: 'card-5' },
        { suit: '💰', rank: '6', value: 6, id: 'card-6' }
      ]
    ];

    test('returns correct color for first meld', () => {
      expect(getMeldColor('card-1', melds)).toBe('border-green-500');
    });

    test('returns correct color for second meld', () => {
      expect(getMeldColor('card-3', melds)).toBe('border-blue-500');
    });

    test('returns correct color for third meld', () => {
      expect(getMeldColor('card-5', melds)).toBe('border-purple-500');
    });

    test('returns null for card not in meld', () => {
      expect(getMeldColor('card-99', melds)).toBeNull();
    });

    test('returns null for empty melds array', () => {
      expect(getMeldColor('card-1', [])).toBeNull();
    });

    test('cycles colors for many melds', () => {
      const manyMelds = [
        [{ id: '1' }, { id: '2' }],
        [{ id: '3' }, { id: '4' }],
        [{ id: '5' }, { id: '6' }],
        [{ id: '7' }, { id: '8' }],
        [{ id: '9' }, { id: '10' }]  // 5th meld should cycle back to first color
      ];
      expect(getMeldColor('9', manyMelds)).toBe('border-green-500'); // Cycles back
    });
  });
});
