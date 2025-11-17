import { calculateRoundResult, checkMatchWinner } from './scoringUtils';
import { GAME_CONFIG } from './constants';

describe('scoringUtils', () => {
  describe('calculateRoundResult', () => {
    const createHand = (deadwoodValue) => {
      // Create a hand with specific deadwood value
      const cards = [];
      let remaining = deadwoodValue;

      while (remaining > 0) {
        const value = Math.min(remaining, 10);
        cards.push({
          suit: '⚔️',
          rank: value === 10 ? 'K' : value.toString(),
          value: value,
          id: `card-${cards.length}`
        });
        remaining -= value;
      }

      return cards;
    };

    test('player wins when player knocks with lower deadwood', () => {
      const playerHand = createHand(5);
      const aiHand = createHand(8);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(result.winner).toBe('player');
      expect(result.scoreDiff).toBe(3); // 8 - 5
      expect(result.playerDeadwood).toBe(5);
      expect(result.aiDeadwood).toBe(8);
    });

    test('player gets GIN bonus with 0 deadwood', () => {
      const playerHand = [
        // Perfect melds, no deadwood
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        { suit: '⚔️', rank: '2', value: 2, id: '4' },
        { suit: '🏆', rank: '2', value: 2, id: '5' },
        { suit: '💰', rank: '2', value: 2, id: '6' },
        { suit: '⚔️', rank: '3', value: 3, id: '7' },
        { suit: '🏆', rank: '3', value: 3, id: '8' },
        { suit: '💰', rank: '3', value: 3, id: '9' },
        { suit: '⚔️', rank: '4', value: 4, id: '10' }
      ];
      const aiHand = createHand(10);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(result.winner).toBe('player');
      expect(result.scoreDiff).toBeGreaterThanOrEqual(GAME_CONFIG.GIN_BONUS);
      expect(result.reason).toContain('GIN');
    });

    test('player gets undercut when knocking with higher deadwood', () => {
      const playerHand = createHand(10);
      const aiHand = createHand(7);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(result.winner).toBe('ai');
      expect(result.scoreDiff).toBe(3 + GAME_CONFIG.UNDERCUT_BONUS); // (10-7) + 25
      expect(result.reason).toContain('Undercut');
    });

    test('AI wins when AI knocks with lower deadwood', () => {
      const playerHand = createHand(9);
      const aiHand = createHand(6);
      const result = calculateRoundResult('ai', playerHand, aiHand);

      expect(result.winner).toBe('ai');
      expect(result.scoreDiff).toBe(3); // 9 - 6
    });

    test('AI gets GIN bonus with 0 deadwood', () => {
      const playerHand = createHand(10);
      const aiHand = [
        // Perfect melds, no deadwood
        { suit: '⚔️', rank: 'A', value: 1, id: '1' },
        { suit: '🏆', rank: 'A', value: 1, id: '2' },
        { suit: '💰', rank: 'A', value: 1, id: '3' },
        { suit: '⚔️', rank: '2', value: 2, id: '4' },
        { suit: '🏆', rank: '2', value: 2, id: '5' },
        { suit: '💰', rank: '2', value: 2, id: '6' },
        { suit: '⚔️', rank: '3', value: 3, id: '7' },
        { suit: '🏆', rank: '3', value: 3, id: '8' },
        { suit: '💰', rank: '3', value: 3, id: '9' },
        { suit: '⚔️', rank: '4', value: 4, id: '10' }
      ];
      const result = calculateRoundResult('ai', playerHand, aiHand);

      expect(result.winner).toBe('ai');
      expect(result.scoreDiff).toBeGreaterThanOrEqual(GAME_CONFIG.GIN_BONUS);
      expect(result.reason).toContain('GIN');
    });

    test('player gets undercut bonus when AI knocks with higher deadwood', () => {
      const playerHand = createHand(5);
      const aiHand = createHand(8);
      const result = calculateRoundResult('ai', playerHand, aiHand);

      expect(result.winner).toBe('player');
      expect(result.scoreDiff).toBe(3 + GAME_CONFIG.UNDERCUT_BONUS); // (8-5) + 25
      expect(result.reason).toContain('Undercut');
    });

    test('returns draw when both have equal deadwood', () => {
      const playerHand = createHand(7);
      const aiHand = createHand(7);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(result.winner).toBe('draw');
      expect(result.scoreDiff).toBe(0);
    });

    test('result includes all required fields', () => {
      const playerHand = createHand(5);
      const aiHand = createHand(8);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('scoreDiff');
      expect(result).toHaveProperty('reason');
      expect(result).toHaveProperty('playerDeadwood');
      expect(result).toHaveProperty('aiDeadwood');
    });

    test('reason string describes the outcome', () => {
      const playerHand = createHand(5);
      const aiHand = createHand(8);
      const result = calculateRoundResult('player', playerHand, aiHand);

      expect(typeof result.reason).toBe('string');
      expect(result.reason.length).toBeGreaterThan(0);
    });
  });

  describe('checkMatchWinner', () => {
    test('returns null when not in match mode', () => {
      const scores = { player: 150, ai: 50 };
      const winner = checkMatchWinner(scores, false);
      expect(winner).toBeNull();
    });

    test('returns null when neither player has reached win score', () => {
      const scores = { player: 50, ai: 60 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBeNull();
    });

    test('returns player when player reaches win score', () => {
      const scores = { player: 100, ai: 50 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('player');
    });

    test('returns ai when AI reaches win score', () => {
      const scores = { player: 50, ai: 100 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('ai');
    });

    test('returns player when player exceeds win score', () => {
      const scores = { player: 125, ai: 50 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('player');
    });

    test('returns player when both exceed win score but player is higher', () => {
      const scores = { player: 110, ai: 105 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('player');
    });

    test('returns ai when both exceed win score but AI is higher', () => {
      const scores = { player: 105, ai: 110 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('ai');
    });

    test('handles exactly at win score', () => {
      const scores = { player: GAME_CONFIG.MATCH_WIN_SCORE, ai: 50 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBe('player');
    });

    test('returns null with 0 scores', () => {
      const scores = { player: 0, ai: 0 };
      const winner = checkMatchWinner(scores, true);
      expect(winner).toBeNull();
    });
  });
});
