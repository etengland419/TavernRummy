import { useState, useEffect, useCallback } from 'react';
import { loadStats, saveStats, recordGame, recordMatch, calculateDerivedStats, resetStats } from '../utils/statsUtils';

/**
 * Custom hook for managing game statistics
 * @returns {Object} Stats state and methods
 */
export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [derivedStats, setDerivedStats] = useState(null);

  // Load stats on mount
  useEffect(() => {
    const loadedStats = loadStats();
    setStats(loadedStats);
    setDerivedStats(calculateDerivedStats(loadedStats));
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (stats) {
      saveStats(stats);
      setDerivedStats(calculateDerivedStats(stats));
    }
  }, [stats]);

  /**
   * Record a game result
   * @param {Object} data - Game data
   */
  const trackGame = useCallback((data) => {
    if (!stats) return;

    const newStats = recordGame(stats, data);
    setStats(newStats);
  }, [stats]);

  /**
   * Record a match result
   * @param {string} winner - 'player' or 'ai'
   */
  const trackMatch = useCallback((winner) => {
    if (!stats) return;

    const newStats = recordMatch(stats, winner);
    setStats(newStats);
  }, [stats]);

  /**
   * Reset all statistics
   */
  const resetAllStats = useCallback(() => {
    const freshStats = resetStats();
    setStats(freshStats);
    saveStats(freshStats);
  }, []);

  return {
    stats,
    derivedStats,
    trackGame,
    trackMatch,
    resetAllStats,
    isLoaded: stats !== null
  };
};
