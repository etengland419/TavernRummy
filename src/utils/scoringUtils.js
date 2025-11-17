import { GAME_CONFIG } from './constants';
import { calculateDeadwood } from './meldUtils';

/**
 * Calculate round end results
 * @param {string} knocker - 'player' or 'ai'
 * @param {Array} playerHand - Player's hand
 * @param {Array} aiHand - AI's hand
 * @returns {Object} Round result with winner, scoreDiff, and reason
 */
export const calculateRoundResult = (knocker, playerHand, aiHand) => {
  const playerDeadwood = calculateDeadwood(playerHand);
  const aiDeadwood = calculateDeadwood(aiHand);

  let winner, scoreDiff, reason;

  // Handle draw case
  if (playerDeadwood === aiDeadwood) {
    winner = 'draw';
    scoreDiff = 0;
    reason = `Both players knocked with ${playerDeadwood} deadwood. It's a draw!`;
  } else if (knocker === 'player') {
    if (playerDeadwood < aiDeadwood) {
      winner = 'player';
      scoreDiff = aiDeadwood - playerDeadwood;
      if (playerDeadwood === 0) {
        scoreDiff += GAME_CONFIG.GIN_BONUS;
        reason = `GIN! You win ${scoreDiff} gold (${GAME_CONFIG.GIN_BONUS} bonus for 0 deadwood)!`;
      } else {
        reason = `You win ${scoreDiff} gold!`;
      }
    } else {
      winner = 'ai';
      scoreDiff = playerDeadwood - aiDeadwood + GAME_CONFIG.UNDERCUT_BONUS;
      reason = `Undercut! The Stranger wins ${scoreDiff} gold (${GAME_CONFIG.UNDERCUT_BONUS} undercut bonus)!`;
    }
  } else {
    if (aiDeadwood < playerDeadwood) {
      winner = 'ai';
      scoreDiff = playerDeadwood - aiDeadwood;
      if (aiDeadwood === 0) {
        scoreDiff += GAME_CONFIG.GIN_BONUS;
        reason = `The Stranger got GIN! They win ${scoreDiff} gold (${GAME_CONFIG.GIN_BONUS} bonus)!`;
      } else {
        reason = `The Stranger wins ${scoreDiff} gold!`;
      }
    } else {
      winner = 'player';
      scoreDiff = aiDeadwood - playerDeadwood + GAME_CONFIG.UNDERCUT_BONUS;
      reason = `Undercut! You win ${scoreDiff} gold (${GAME_CONFIG.UNDERCUT_BONUS} undercut bonus)!`;
    }
  }

  return {
    winner,
    scoreDiff,
    reason,
    playerDeadwood,
    aiDeadwood
  };
};

/**
 * Check if match is over
 * @param {Object} scores - Current scores {player, ai}
 * @param {boolean} matchMode - Whether in match mode
 * @returns {string|null} Winner of match or null if not over
 */
export const checkMatchWinner = (scores, matchMode) => {
  if (!matchMode) return null;

  const playerWon = scores.player >= GAME_CONFIG.MATCH_WIN_SCORE;
  const aiWon = scores.ai >= GAME_CONFIG.MATCH_WIN_SCORE;

  // If both have reached the win score, the higher score wins
  if (playerWon && aiWon) {
    return scores.player > scores.ai ? 'player' : 'ai';
  }

  if (playerWon) return 'player';
  if (aiWon) return 'ai';
  return null;
};
