import { DIFFICULTY_LEVELS, GAME_MODES } from './constants';

const STATS_STORAGE_KEY = 'tavernRummy_stats';
const STATS_VERSION = '1.2'; // Updated version for Challenge Mode endless progression

/**
 * Get default stats structure
 */
const getDefaultStats = () => ({
  version: STATS_VERSION,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesDrawn: 0,
  totalScore: 0,
  highestScore: 0,
  ginsCount: 0,
  undercutsCount: 0,
  knocksCount: 0,
  currentStreak: 0,
  longestStreak: 0,
  byDifficulty: {
    [DIFFICULTY_LEVELS.TUTORIAL]: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0
    },
    [DIFFICULTY_LEVELS.EASY]: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0
    },
    [DIFFICULTY_LEVELS.MEDIUM]: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0
    },
    [DIFFICULTY_LEVELS.HARD]: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0
    }
  },
  // NEW: Tutorial mode stats (separate from regular stats)
  tutorialStats: {
    [DIFFICULTY_LEVELS.TUTORIAL]: 0,
    [DIFFICULTY_LEVELS.EASY]: 0,
    [DIFFICULTY_LEVELS.MEDIUM]: 0,
    [DIFFICULTY_LEVELS.HARD]: 0
  },
  averageDeadwood: [],
  matchesPlayed: 0,
  matchesWon: 0,
  // Challenge Mode specific stats (Endless Mode)
  challengeMode: {
    currentWinStreak: 0,
    longestWinStreak: 0,
    totalChallengeWins: 0,
    totalChallengeLosses: 0,
    currentTier: DIFFICULTY_LEVELS.EASY,
    highestTierReached: DIFFICULTY_LEVELS.EASY,
    tierReached: {
      [DIFFICULTY_LEVELS.EASY]: 0,
      [DIFFICULTY_LEVELS.MEDIUM]: 0,
      [DIFFICULTY_LEVELS.HARD]: 0,
      [DIFFICULTY_LEVELS.EXPERT]: 0,
      [DIFFICULTY_LEVELS.MASTER]: 0,
      [DIFFICULTY_LEVELS.LEGENDARY]: 0,
      [DIFFICULTY_LEVELS.NIGHTMARE]: 0,
      [DIFFICULTY_LEVELS.INFINITE]: 0
    },
    winsPerTier: {
      [DIFFICULTY_LEVELS.EASY]: 0,
      [DIFFICULTY_LEVELS.MEDIUM]: 0,
      [DIFFICULTY_LEVELS.HARD]: 0,
      [DIFFICULTY_LEVELS.EXPERT]: 0,
      [DIFFICULTY_LEVELS.MASTER]: 0,
      [DIFFICULTY_LEVELS.LEGENDARY]: 0,
      [DIFFICULTY_LEVELS.NIGHTMARE]: 0,
      [DIFFICULTY_LEVELS.INFINITE]: 0
    },
    totalMilestoneXP: 0
  },
  createdAt: Date.now(),
  lastPlayed: Date.now()
});

/**
 * Load stats from LocalStorage
 * @returns {Object} Stats object
 */
export const loadStats = () => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (!stored) {
      return getDefaultStats();
    }

    const stats = JSON.parse(stored);

    // Validate version and migrate if needed
    if (stats.version !== STATS_VERSION) {
      return migrateStats(stats);
    }

    return stats;
  } catch (error) {
    console.error('Error loading stats:', error);
    return getDefaultStats();
  }
};

/**
 * Save stats to LocalStorage
 * @param {Object} stats - Stats object to save
 */
export const saveStats = (stats) => {
  try {
    stats.lastPlayed = Date.now();
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

/**
 * Migrate stats from older version
 * @param {Object} oldStats - Old stats object
 * @returns {Object} Migrated stats
 */
const migrateStats = (oldStats) => {
  const newStats = getDefaultStats();

  // Preserve data that exists in old format
  Object.keys(newStats).forEach(key => {
    if (oldStats[key] !== undefined) {
      newStats[key] = oldStats[key];
    }
  });

  newStats.version = STATS_VERSION;
  return newStats;
};

/**
 * Record a game completion
 * @param {Object} stats - Current stats
 * @param {Object} data - Game data {winner, difficulty, playerDeadwood, isGin, isUndercut, isKnock, playerScore, gameMode}
 * @returns {Object} Updated stats
 */
export const recordGame = (stats, data) => {
  const { winner, difficulty, playerDeadwood, isGin, isUndercut, isKnock, playerScore, gameMode } = data;

  const newStats = { ...stats };

  // Initialize tutorialStats if it doesn't exist (for migration)
  if (!newStats.tutorialStats) {
    newStats.tutorialStats = {
      [DIFFICULTY_LEVELS.TUTORIAL]: 0,
      [DIFFICULTY_LEVELS.EASY]: 0,
      [DIFFICULTY_LEVELS.MEDIUM]: 0,
      [DIFFICULTY_LEVELS.HARD]: 0
    };
  }

  // If in TUTORIAL mode, only update tutorial stats
  if (gameMode === GAME_MODES.TUTORIAL) {
    if (difficulty && newStats.tutorialStats[difficulty] !== undefined) {
      newStats.tutorialStats[difficulty]++;
    }
    return newStats;
  }

  // For PRACTICE and CHALLENGING modes, update regular stats
  // (Old code path for backwards compatibility if gameMode is undefined)
  const isTutorialDifficulty = difficulty === DIFFICULTY_LEVELS.TUTORIAL;

  // Overall stats (skip for tutorial difficulty only if no gameMode specified)
  if (!isTutorialDifficulty || gameMode) {
    newStats.gamesPlayed++;
    if (winner === 'player') {
      newStats.gamesWon++;
      newStats.currentStreak++;
      if (newStats.currentStreak > newStats.longestStreak) {
        newStats.longestStreak = newStats.currentStreak;
      }
    } else if (winner === 'ai') {
      newStats.gamesLost++;
      newStats.currentStreak = 0;
    } else if (winner === 'draw') {
      newStats.gamesDrawn++;
      newStats.currentStreak = 0;
    }

    // Score tracking
    if (playerScore !== undefined) {
      newStats.totalScore += playerScore;
      if (playerScore > newStats.highestScore) {
        newStats.highestScore = playerScore;
      }
    }

    // Special events
    if (isGin) {
      newStats.ginsCount++;
    }
    if (isUndercut && winner === 'player') {
      newStats.undercutsCount++;
    }
    if (isKnock && winner === 'player') {
      newStats.knocksCount++;
    }
  }

  // Difficulty-specific stats
  if (difficulty && newStats.byDifficulty[difficulty]) {
    newStats.byDifficulty[difficulty].gamesPlayed++;
    if (winner === 'player') {
      newStats.byDifficulty[difficulty].gamesWon++;
    } else if (winner === 'ai') {
      newStats.byDifficulty[difficulty].gamesLost++;
    } else if (winner === 'draw') {
      newStats.byDifficulty[difficulty].gamesDrawn++;
    }
  }

  // Average deadwood tracking (keep last 50 games, skip tutorial difficulty)
  if (playerDeadwood !== undefined && !isTutorialDifficulty) {
    newStats.averageDeadwood.push(playerDeadwood);
    if (newStats.averageDeadwood.length > 50) {
      newStats.averageDeadwood.shift();
    }
  }

  return newStats;
};

/**
 * Record a match completion
 * @param {Object} stats - Current stats
 * @param {string} winner - 'player' or 'ai'
 * @returns {Object} Updated stats
 */
export const recordMatch = (stats, winner) => {
  const newStats = { ...stats };
  newStats.matchesPlayed++;
  if (winner === 'player') {
    newStats.matchesWon++;
  }
  return newStats;
};

/**
 * Calculate derived statistics
 * @param {Object} stats - Stats object
 * @returns {Object} Calculated stats
 */
export const calculateDerivedStats = (stats) => {
  const winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed * 100).toFixed(1) : 0;
  const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;
  const averageDeadwood = stats.averageDeadwood.length > 0
    ? (stats.averageDeadwood.reduce((a, b) => a + b, 0) / stats.averageDeadwood.length).toFixed(1)
    : 0;
  const ginRate = stats.knocksCount > 0 ? ((stats.ginsCount / stats.knocksCount) * 100).toFixed(1) : 0;
  const matchWinRate = stats.matchesPlayed > 0 ? (stats.matchesWon / stats.matchesPlayed * 100).toFixed(1) : 0;

  return {
    winRate,
    averageScore,
    averageDeadwood,
    ginRate,
    matchWinRate
  };
};

/**
 * Reset all stats
 * @returns {Object} Fresh stats object
 */
export const resetStats = () => {
  return getDefaultStats();
};

/**
 * Export stats as JSON string
 * @param {Object} stats - Stats object
 * @returns {string} JSON string
 */
export const exportStats = (stats) => {
  return JSON.stringify(stats, null, 2);
};

/**
 * Import stats from JSON string
 * @param {string} jsonString - JSON stats data
 * @returns {Object} Stats object or null if invalid
 */
export const importStats = (jsonString) => {
  try {
    const stats = JSON.parse(jsonString);
    if (stats.version) {
      return migrateStats(stats);
    }
    return null;
  } catch (error) {
    console.error('Error importing stats:', error);
    return null;
  }
};

/**
 * Update Challenge Mode stats after a win
 * @param {Object} stats - Current stats
 * @param {string} currentDifficulty - Current difficulty tier
 * @returns {Object} Updated stats
 */
export const updateChallengeWin = (stats, currentDifficulty) => {
  const newStats = { ...stats };

  // Initialize challengeMode if it doesn't exist (for migration)
  if (!newStats.challengeMode) {
    newStats.challengeMode = getDefaultStats().challengeMode;
  }

  // Increment win streak
  newStats.challengeMode.currentWinStreak += 1;
  newStats.challengeMode.totalChallengeWins += 1;

  // Update longest streak
  if (newStats.challengeMode.currentWinStreak > newStats.challengeMode.longestWinStreak) {
    newStats.challengeMode.longestWinStreak = newStats.challengeMode.currentWinStreak;
  }

  // Update tier stats
  newStats.challengeMode.currentTier = currentDifficulty;
  if (newStats.challengeMode.winsPerTier[currentDifficulty] !== undefined) {
    newStats.challengeMode.winsPerTier[currentDifficulty] += 1;
  }

  // Track tier reached
  const tierLevels = [
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD,
    DIFFICULTY_LEVELS.EXPERT,
    DIFFICULTY_LEVELS.MASTER,
    DIFFICULTY_LEVELS.LEGENDARY,
    DIFFICULTY_LEVELS.NIGHTMARE,
    DIFFICULTY_LEVELS.INFINITE
  ];

  const currentTierIndex = tierLevels.indexOf(currentDifficulty);
  const highestTierIndex = tierLevels.indexOf(newStats.challengeMode.highestTierReached);

  if (currentTierIndex > highestTierIndex) {
    newStats.challengeMode.highestTierReached = currentDifficulty;
  }

  // Increment tier reached count
  if (newStats.challengeMode.tierReached[currentDifficulty] !== undefined) {
    newStats.challengeMode.tierReached[currentDifficulty] += 1;
  }

  return newStats;
};

/**
 * Update Challenge Mode stats after a loss
 * @param {Object} stats - Current stats
 * @returns {Object} Updated stats
 */
export const updateChallengeLoss = (stats) => {
  const newStats = { ...stats };

  // Initialize challengeMode if it doesn't exist (for migration)
  if (!newStats.challengeMode) {
    newStats.challengeMode = getDefaultStats().challengeMode;
  }

  // Reset win streak
  newStats.challengeMode.currentWinStreak = 0;
  newStats.challengeMode.currentTier = DIFFICULTY_LEVELS.EASY;
  newStats.challengeMode.totalChallengeLosses += 1;

  return newStats;
};

/**
 * Add milestone XP to Challenge Mode stats
 * @param {Object} stats - Current stats
 * @param {number} xpAmount - XP to add
 * @returns {Object} Updated stats
 */
export const addMilestoneXP = (stats, xpAmount) => {
  const newStats = { ...stats };

  // Initialize challengeMode if it doesn't exist (for migration)
  if (!newStats.challengeMode) {
    newStats.challengeMode = getDefaultStats().challengeMode;
  }

  newStats.challengeMode.totalMilestoneXP += xpAmount;
  return newStats;
};
