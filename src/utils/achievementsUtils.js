import { DIFFICULTY_LEVELS, GAME_CONFIG } from './constants';

const ACHIEVEMENTS_STORAGE_KEY = 'tavernRummy_achievements';

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
  TUTORIAL_COMPLETE: {
    id: 'tutorial_complete',
    name: 'Learning the Ropes',
    description: 'Complete the tutorial',
    icon: '📚',
    condition: (stats) => stats.byDifficulty[DIFFICULTY_LEVELS.TUTORIAL]?.gamesWon >= 1
  },
  FIRST_WIN: {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🎉',
    condition: (stats) => stats.gamesWon >= 1
  },
  PERFECT_GIN: {
    id: 'perfect_gin',
    name: 'Perfect Hand',
    description: 'Win with Gin (0 deadwood)',
    icon: '✨',
    condition: (stats) => stats.ginsCount >= 1
  },
  UNDERDOG: {
    id: 'underdog',
    name: 'Undercut Master',
    description: 'Successfully undercut your opponent 5 times',
    icon: '⚡',
    condition: (stats) => stats.undercutsCount >= 5
  },
  WIN_STREAK_3: {
    id: 'win_streak_3',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 3
  },
  WIN_STREAK_5: {
    id: 'win_streak_5',
    name: 'Unstoppable',
    description: 'Win 5 games in a row',
    icon: '💪',
    condition: (stats) => stats.longestStreak >= 5
  },
  WIN_STREAK_10: {
    id: 'win_streak_10',
    name: 'Legendary',
    description: 'Win 10 games in a row',
    icon: '👑',
    condition: (stats) => stats.longestStreak >= 10
  },
  GAMES_10: {
    id: 'games_10',
    name: 'Tavern Regular',
    description: 'Play 10 games',
    icon: '🍺',
    condition: (stats) => stats.gamesPlayed >= 10
  },
  GAMES_50: {
    id: 'games_50',
    name: 'Card Shark',
    description: 'Play 50 games',
    icon: '🦈',
    condition: (stats) => stats.gamesPlayed >= 50
  },
  GAMES_100: {
    id: 'games_100',
    name: 'Master of the Tavern',
    description: 'Play 100 games',
    icon: '🏛️',
    condition: (stats) => stats.gamesPlayed >= 100
  },
  HIGH_SCORE: {
    id: 'high_score',
    name: 'Gold Hoarder',
    description: `Score ${GAME_CONFIG.MATCH_WIN_SCORE} gold in a single game`,
    icon: '💰',
    condition: (stats) => stats.highestScore >= GAME_CONFIG.MATCH_WIN_SCORE
  },
  MATCH_WINNER: {
    id: 'match_winner',
    name: 'Match Victor',
    description: 'Win your first match',
    icon: '🏆',
    condition: (stats) => stats.matchesWon >= 1
  },
  EASY_CONQUEROR: {
    id: 'easy_conqueror',
    name: 'Easy Conqueror',
    description: 'Win 10 games on Easy difficulty',
    icon: '😊',
    condition: (stats) => stats.byDifficulty[DIFFICULTY_LEVELS.EASY]?.gamesWon >= 10
  },
  MEDIUM_MASTER: {
    id: 'medium_master',
    name: 'Medium Master',
    description: 'Win 10 games on Medium difficulty',
    icon: '🎯',
    condition: (stats) => stats.byDifficulty[DIFFICULTY_LEVELS.MEDIUM]?.gamesWon >= 10
  },
  HARD_HERO: {
    id: 'hard_hero',
    name: 'Hard Hero',
    description: 'Win 10 games on Hard difficulty',
    icon: '🔥',
    condition: (stats) => stats.byDifficulty[DIFFICULTY_LEVELS.HARD]?.gamesWon >= 10
  },
  DIFFICULTY_MASTER: {
    id: 'difficulty_master',
    name: 'Difficulty Master',
    description: 'Win at least one game on each difficulty',
    icon: '🎖️',
    condition: (stats) => {
      return stats.byDifficulty[DIFFICULTY_LEVELS.EASY]?.gamesWon >= 1 &&
             stats.byDifficulty[DIFFICULTY_LEVELS.MEDIUM]?.gamesWon >= 1 &&
             stats.byDifficulty[DIFFICULTY_LEVELS.HARD]?.gamesWon >= 1;
    }
  },
  GIN_MASTER: {
    id: 'gin_master',
    name: 'Gin Master',
    description: 'Get Gin 10 times',
    icon: '💎',
    condition: (stats) => stats.ginsCount >= 10
  },

  // Challenge Mode Win Streak Achievements
  CHALLENGE_STREAK_5: {
    id: 'challenge_streak_5',
    name: 'Warming Up',
    description: 'Reach a 5 win streak in Challenge Mode',
    icon: '🔥',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 5
  },
  CHALLENGE_STREAK_10: {
    id: 'challenge_streak_10',
    name: 'On Fire',
    description: 'Reach a 10 win streak in Challenge Mode',
    icon: '🔥🔥',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 10
  },
  CHALLENGE_STREAK_15: {
    id: 'challenge_streak_15',
    name: 'Unstoppable Force',
    description: 'Reach a 15 win streak in Challenge Mode',
    icon: '⚡',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 15
  },
  CHALLENGE_STREAK_20: {
    id: 'challenge_streak_20',
    name: 'Legendary Run',
    description: 'Reach a 20 win streak in Challenge Mode',
    icon: '👑',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 20
  },
  CHALLENGE_STREAK_25: {
    id: 'challenge_streak_25',
    name: 'Nightmare Fuel',
    description: 'Reach a 25 win streak in Challenge Mode',
    icon: '💀',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 25
  },
  CHALLENGE_STREAK_30: {
    id: 'challenge_streak_30',
    name: 'Infinite Power',
    description: 'Reach a 30 win streak in Challenge Mode',
    icon: '♾️',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 30
  },
  CHALLENGE_STREAK_35: {
    id: 'challenge_streak_35',
    name: 'Transcendent',
    description: 'Reach a 35 win streak in Challenge Mode',
    icon: '✨',
    condition: (stats) => stats.challengeMode?.longestWinStreak >= 35
  },

  // Challenge Mode Tier Achievements
  REACH_EXPERT: {
    id: 'reach_expert',
    name: 'Expert Challenger',
    description: 'Reach Expert tier in Challenge Mode',
    icon: '⚡',
    condition: (stats) => {
      const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
      const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
      return highestIndex >= 3;
    }
  },
  REACH_MASTER: {
    id: 'reach_master',
    name: 'Master Challenger',
    description: 'Reach Master tier in Challenge Mode',
    icon: '⭐',
    condition: (stats) => {
      const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'];
      const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
      return highestIndex >= 4;
    }
  },
  REACH_LEGENDARY: {
    id: 'reach_legendary',
    name: 'Legendary Challenger',
    description: 'Reach Legendary tier in Challenge Mode',
    icon: '👑',
    condition: (stats) => {
      const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Legendary'];
      const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
      return highestIndex >= 5;
    }
  },
  REACH_NIGHTMARE: {
    id: 'reach_nightmare',
    name: 'Nightmare Conqueror',
    description: 'Reach Nightmare tier in Challenge Mode',
    icon: '💀',
    condition: (stats) => {
      const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Legendary', 'Nightmare'];
      const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
      return highestIndex >= 6;
    }
  },
  REACH_INFINITE: {
    id: 'reach_infinite',
    name: 'The Infinite',
    description: 'Reach Infinite tier in Challenge Mode',
    icon: '♾️',
    condition: (stats) => stats.challengeMode?.highestTierReached === 'Infinite'
  }
};

/**
 * Load unlocked achievements from LocalStorage
 * @returns {Object} Unlocked achievements with timestamps
 */
export const loadUnlockedAchievements = () => {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading achievements:', error);
    return {};
  }
};

/**
 * Save unlocked achievements to LocalStorage
 * @param {Object} unlockedAchievements - Achievements object
 */
export const saveUnlockedAchievements = (unlockedAchievements) => {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(unlockedAchievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

/**
 * Check which achievements should be unlocked based on stats
 * @param {Object} stats - Current statistics
 * @param {Object} currentlyUnlocked - Currently unlocked achievements
 * @returns {Array} Newly unlocked achievement IDs
 */
export const checkAchievements = (stats, currentlyUnlocked) => {
  const newlyUnlocked = [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Skip if already unlocked
    if (currentlyUnlocked[achievement.id]) {
      return;
    }

    // Check if condition is met
    if (achievement.condition(stats)) {
      newlyUnlocked.push(achievement.id);
    }
  });

  return newlyUnlocked;
};

/**
 * Unlock an achievement
 * @param {Object} unlockedAchievements - Current unlocked achievements
 * @param {string} achievementId - ID of achievement to unlock
 * @returns {Object} Updated unlocked achievements
 */
export const unlockAchievement = (unlockedAchievements, achievementId) => {
  return {
    ...unlockedAchievements,
    [achievementId]: {
      unlockedAt: Date.now()
    }
  };
};

/**
 * Get achievement progress
 * @param {Object} stats - Current statistics
 * @returns {Object} Progress for each achievement
 */
export const getAchievementProgress = (stats) => {
  const progress = {};

  // Custom progress calculators for specific achievements
  const progressCalculators = {
    tutorial_complete: () => Math.min(stats.byDifficulty[DIFFICULTY_LEVELS.TUTORIAL]?.gamesWon || 0, 1),
    first_win: () => Math.min(stats.gamesWon, 1),
    perfect_gin: () => Math.min(stats.ginsCount, 1),
    underdog: () => Math.min(stats.undercutsCount / 5, 1),
    win_streak_3: () => Math.min(stats.longestStreak / 3, 1),
    win_streak_5: () => Math.min(stats.longestStreak / 5, 1),
    win_streak_10: () => Math.min(stats.longestStreak / 10, 1),
    games_10: () => Math.min(stats.gamesPlayed / 10, 1),
    games_50: () => Math.min(stats.gamesPlayed / 50, 1),
    games_100: () => Math.min(stats.gamesPlayed / 100, 1),
    high_score: () => Math.min(stats.highestScore / GAME_CONFIG.MATCH_WIN_SCORE, 1),
    match_winner: () => Math.min(stats.matchesWon, 1),
    easy_conqueror: () => Math.min((stats.byDifficulty[DIFFICULTY_LEVELS.EASY]?.gamesWon || 0) / 10, 1),
    medium_master: () => Math.min((stats.byDifficulty[DIFFICULTY_LEVELS.MEDIUM]?.gamesWon || 0) / 10, 1),
    hard_hero: () => Math.min((stats.byDifficulty[DIFFICULTY_LEVELS.HARD]?.gamesWon || 0) / 10, 1),
    difficulty_master: () => {
      const easyWon = (stats.byDifficulty[DIFFICULTY_LEVELS.EASY]?.gamesWon || 0) >= 1 ? 1 : 0;
      const mediumWon = (stats.byDifficulty[DIFFICULTY_LEVELS.MEDIUM]?.gamesWon || 0) >= 1 ? 1 : 0;
      const hardWon = (stats.byDifficulty[DIFFICULTY_LEVELS.HARD]?.gamesWon || 0) >= 1 ? 1 : 0;
      return (easyWon + mediumWon + hardWon) / 3;
    },
    gin_master: () => Math.min(stats.ginsCount / 10, 1)
  };

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const calculator = progressCalculators[achievement.id];
    if (calculator) {
      progress[achievement.id] = calculator();
    } else {
      progress[achievement.id] = achievement.condition(stats) ? 1 : 0;
    }
  });

  return progress;
};

/**
 * Reset all achievements
 * @returns {Object} Empty achievements object
 */
export const resetAchievements = () => {
  return {};
};
