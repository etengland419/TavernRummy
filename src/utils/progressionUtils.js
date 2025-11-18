/**
 * Progression System Utilities
 * Handles XP calculation, leveling, and Ability Points (AP)
 */

/**
 * XP Rewards for different actions
 */
export const XP_REWARDS = {
  ROUND_PARTICIPATION: 2,
  ROUND_WIN: 10,
  KNOCK_BONUS: 5,
  GIN_BONUS: 15,
  UNDERCUT_BONUS: 20,
  FIRST_MELD: 3,
  LOSS_CONSOLATION: 5,
};

/**
 * Calculate XP required for a specific level
 * Uses exponential curve: 50 * 1.5^(level-1)
 *
 * @param {number} level - Target level
 * @returns {number} XP required to reach that level
 */
export const calculateXPForLevel = (level) => {
  return Math.floor(50 * Math.pow(1.5, level - 1));
};

/**
 * Calculate total XP needed from level 1 to target level
 *
 * @param {number} targetLevel - Target level
 * @returns {number} Total cumulative XP needed
 */
export const calculateTotalXPForLevel = (targetLevel) => {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += calculateXPForLevel(i);
  }
  return total;
};

/**
 * Calculate current level based on total XP
 *
 * @param {number} totalXP - Total XP earned
 * @returns {Object} { level, currentLevelXP, xpToNextLevel }
 */
export const calculateLevel = (totalXP) => {
  let level = 1;
  let xpSoFar = 0;

  while (xpSoFar + calculateXPForLevel(level) <= totalXP) {
    xpSoFar += calculateXPForLevel(level);
    level++;
  }

  const currentLevelXP = totalXP - xpSoFar;
  const xpToNextLevel = calculateXPForLevel(level);

  return {
    level,
    currentLevelXP,
    xpToNextLevel,
    xpSoFar
  };
};

/**
 * Calculate XP rewards from a round result
 *
 * @param {Object} roundResult - Result from scoringUtils.calculateRoundResult
 * @param {boolean} isPlayer - Whether calculating for player (vs AI)
 * @returns {Object} { xp, breakdown }
 */
export const calculateRoundXP = (roundResult, isPlayer = true) => {
  let xp = XP_REWARDS.ROUND_PARTICIPATION;
  const breakdown = ['Participation: +2 XP'];

  const isWinner = (roundResult.winner === 'player' && isPlayer) ||
                   (roundResult.winner === 'ai' && !isPlayer);

  if (isWinner) {
    xp += XP_REWARDS.ROUND_WIN;
    breakdown.push('Win: +10 XP');

    // Check for special bonuses
    if (roundResult.reason.includes('GIN')) {
      xp += XP_REWARDS.GIN_BONUS;
      breakdown.push('GIN Bonus: +15 XP');
    }

    if (roundResult.reason.includes('Undercut')) {
      xp += XP_REWARDS.UNDERCUT_BONUS;
      breakdown.push('Undercut Bonus: +20 XP');
    }

    // Knock bonus (if not GIN)
    if (roundResult.knocker && !roundResult.reason.includes('GIN')) {
      xp += XP_REWARDS.KNOCK_BONUS;
      breakdown.push('Knock Bonus: +5 XP');
    }
  } else {
    // Consolation XP for losing
    xp += XP_REWARDS.LOSS_CONSOLATION;
    breakdown.push('Loss Consolation: +5 XP');
  }

  return { xp, breakdown };
};

/**
 * Calculate Ability Points (AP) for a level
 * Players get 1 AP per level
 *
 * @param {number} level - Current level
 * @returns {number} Total AP earned
 */
export const calculateAP = (level) => {
  return level - 1; // Level 1 = 0 AP, Level 2 = 1 AP, etc.
};

/**
 * Check if player leveled up
 *
 * @param {number} oldXP - XP before the round
 * @param {number} newXP - XP after the round
 * @returns {Object} { leveledUp, oldLevel, newLevel, apGained }
 */
export const checkLevelUp = (oldXP, newXP) => {
  const oldLevelData = calculateLevel(oldXP);
  const newLevelData = calculateLevel(newXP);

  const leveledUp = newLevelData.level > oldLevelData.level;
  const levelsGained = newLevelData.level - oldLevelData.level;
  const apGained = levelsGained; // 1 AP per level

  return {
    leveledUp,
    oldLevel: oldLevelData.level,
    newLevel: newLevelData.level,
    levelsGained,
    apGained
  };
};

/**
 * Format XP display string
 *
 * @param {number} currentXP - Current XP in this level
 * @param {number} requiredXP - XP needed for next level
 * @returns {string} Formatted string like "450/1000"
 */
export const formatXP = (currentXP, requiredXP) => {
  return `${currentXP}/${requiredXP}`;
};

/**
 * Calculate XP progress percentage
 *
 * @param {number} currentXP - Current XP in this level
 * @param {number} requiredXP - XP needed for next level
 * @returns {number} Percentage (0-100)
 */
export const calculateXPProgress = (currentXP, requiredXP) => {
  return Math.min(100, Math.floor((currentXP / requiredXP) * 100));
};
