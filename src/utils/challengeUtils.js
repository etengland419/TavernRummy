import { DIFFICULTY_LEVELS, CHALLENGE_TIERS, TIER_MILESTONE_XP } from './constants';

/**
 * Get the AI difficulty level based on current Challenge Mode win streak
 * @param {number} winStreak - Current win streak in Challenge Mode
 * @returns {string} Difficulty level
 */
export const getDifficultyForWinStreak = (winStreak) => {
  // Find the highest tier threshold the player has reached
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const threshold of tierThresholds) {
    if (winStreak >= threshold) {
      return CHALLENGE_TIERS[threshold].difficulty;
    }
  }

  // Default to Easy if below all thresholds
  return DIFFICULTY_LEVELS.EASY;
};

/**
 * Get the current tier information for a win streak
 * @param {number} winStreak - Current win streak
 * @returns {Object} Tier info {difficulty, name, icon, threshold}
 */
export const getCurrentTier = (winStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of tierThresholds) {
    if (winStreak >= threshold) {
      return {
        ...CHALLENGE_TIERS[threshold],
        threshold
      };
    }
  }

  return {
    ...CHALLENGE_TIERS[0],
    threshold: 0
  };
};

/**
 * Get the next tier information
 * @param {number} winStreak - Current win streak
 * @returns {Object|null} Next tier info or null if at max
 */
export const getNextTier = (winStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => a - b); // Sort ascending

  for (const threshold of tierThresholds) {
    if (winStreak < threshold) {
      return {
        ...CHALLENGE_TIERS[threshold],
        threshold,
        winsRequired: threshold - winStreak
      };
    }
  }

  return null; // At maximum tier
};

/**
 * Check if the player just reached a new tier milestone
 * @param {number} previousWinStreak - Win streak before this win
 * @param {number} currentWinStreak - Win streak after this win
 * @returns {Object|null} Milestone info or null if no milestone
 */
export const checkTierMilestone = (previousWinStreak, currentWinStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS).map(Number);

  for (const threshold of tierThresholds) {
    if (previousWinStreak < threshold && currentWinStreak >= threshold) {
      return {
        threshold,
        tier: CHALLENGE_TIERS[threshold],
        xpBonus: TIER_MILESTONE_XP[threshold] || 0
      };
    }
  }

  return null;
};

/**
 * Calculate total XP bonuses earned from tier milestones in a run
 * @param {number} winStreak - Final win streak of the run
 * @returns {number} Total milestone XP earned
 */
export const calculateMilestoneXP = (winStreak) => {
  let totalXP = 0;

  Object.keys(TIER_MILESTONE_XP).forEach(threshold => {
    if (winStreak >= Number(threshold)) {
      totalXP += TIER_MILESTONE_XP[threshold];
    }
  });

  return totalXP;
};

/**
 * Get a descriptive message for reaching a tier
 * @param {number} threshold - Tier threshold reached
 * @returns {string} Message to display
 */
export const getTierReachedMessage = (threshold) => {
  const messages = {
    5: "The challenger grows stronger... Brace yourself!",
    10: "You face a true master now. May fortune smile upon you.",
    15: "Few have reached this height. The path narrows from here.",
    20: "The cards themselves fear you! But your opponent does not.",
    25: "You stand among legends! Prove you belong here.",
    30: "You have entered the nightmare... There is no mercy here.",
    35: "You have transcended mortal limits! How far can you go?"
  };

  return messages[threshold] || "A new challenge awaits...";
};

/**
 * Format win streak progress for display
 * @param {number} winStreak - Current win streak
 * @returns {Object} Display info {current, next, progress, percentage}
 */
export const getProgressDisplay = (winStreak) => {
  const currentTier = getCurrentTier(winStreak);
  const nextTier = getNextTier(winStreak);

  if (!nextTier) {
    // At maximum tier
    return {
      current: currentTier,
      next: null,
      progress: winStreak - currentTier.threshold,
      percentage: 100,
      isMaxTier: true
    };
  }

  const tierRange = nextTier.threshold - currentTier.threshold;
  const currentProgress = winStreak - currentTier.threshold;
  const percentage = Math.floor((currentProgress / tierRange) * 100);

  return {
    current: currentTier,
    next: nextTier,
    progress: currentProgress,
    total: tierRange,
    percentage,
    isMaxTier: false
  };
};
