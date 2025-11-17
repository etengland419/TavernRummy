import { DIFFICULTY_LEVELS } from './constants';

const STATS_STORAGE_KEY = 'tavernRummy_stats';
const STATS_VERSION = '1.0';

/**
 * Get default stats structure
 */
const getDefaultStats = () => ({
  version: STATS_VERSION,
  gamesPlayed: 0,
  gamesWon: 0,
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
      gamesWon: 0
    },
    [DIFFICULTY_LEVELS.EASY]: {
      gamesPlayed: 0,
      gamesWon: 0
    },
    [DIFFICULTY_LEVELS.MEDIUM]: {
      gamesPlayed: 0,
      gamesWon: 0
    },
    [DIFFICULTY_LEVELS.HARD]: {
      gamesPlayed: 0,
      gamesWon: 0
    }
  },
  averageDeadwood: [],
  matchesPlayed: 0,
  matchesWon: 0,
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
 * @param {Object} data - Game data {winner, difficulty, playerDeadwood, isGin, isUndercut, isKnock, playerScore}
 * @returns {Object} Updated stats
 */
export const recordGame = (stats, data) => {
  const { winner, difficulty, playerDeadwood, isGin, isUndercut, isKnock, playerScore } = data;

  const newStats = { ...stats };

  // Overall stats
  newStats.gamesPlayed++;
  if (winner === 'player') {
    newStats.gamesWon++;
    newStats.currentStreak++;
    if (newStats.currentStreak > newStats.longestStreak) {
      newStats.longestStreak = newStats.currentStreak;
    }
  } else if (winner === 'ai') {
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

  // Difficulty-specific stats
  if (difficulty && newStats.byDifficulty[difficulty]) {
    newStats.byDifficulty[difficulty].gamesPlayed++;
    if (winner === 'player') {
      newStats.byDifficulty[difficulty].gamesWon++;
    }
  }

  // Average deadwood tracking (keep last 50 games)
  if (playerDeadwood !== undefined) {
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
