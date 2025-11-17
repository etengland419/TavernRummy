import { useState, useEffect, useCallback } from 'react';
import {
  loadUnlockedAchievements,
  saveUnlockedAchievements,
  checkAchievements,
  unlockAchievement,
  getAchievementProgress,
  ACHIEVEMENTS
} from '../utils/achievementsUtils';

/**
 * Custom hook for managing achievements
 * @param {Object} stats - Current game statistics
 * @returns {Object} Achievement state and methods
 */
export const useAchievements = (stats) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [progress, setProgress] = useState({});

  // Load achievements on mount
  useEffect(() => {
    const loaded = loadUnlockedAchievements();
    setUnlockedAchievements(loaded);
  }, []);

  // Check for new achievements whenever stats change
  useEffect(() => {
    if (!stats || !unlockedAchievements) return;

    const newAchievements = checkAchievements(stats, unlockedAchievements);

    if (newAchievements.length > 0) {
      let updatedUnlocked = { ...unlockedAchievements };

      newAchievements.forEach(achievementId => {
        updatedUnlocked = unlockAchievement(updatedUnlocked, achievementId);
      });

      setUnlockedAchievements(updatedUnlocked);
      saveUnlockedAchievements(updatedUnlocked);
      setNewlyUnlocked(newAchievements);

      // Clear newly unlocked after showing notification
      setTimeout(() => {
        setNewlyUnlocked([]);
      }, 10000); // Clear after 10 seconds
    }

    // Update progress for all achievements
    const currentProgress = getAchievementProgress(stats);
    setProgress(currentProgress);
  }, [stats, unlockedAchievements]);

  /**
   * Dismiss a newly unlocked achievement notification
   * @param {string} achievementId - ID of achievement to dismiss
   */
  const dismissNotification = useCallback((achievementId) => {
    setNewlyUnlocked(prev => prev.filter(id => id !== achievementId));
  }, []);

  /**
   * Get achievement by ID
   * @param {string} achievementId - Achievement ID
   * @returns {Object} Achievement object
   */
  const getAchievement = useCallback((achievementId) => {
    return ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(
      key => ACHIEVEMENTS[key].id === achievementId
    )];
  }, []);

  /**
   * Check if achievement is unlocked
   * @param {string} achievementId - Achievement ID
   * @returns {boolean} True if unlocked
   */
  const isUnlocked = useCallback((achievementId) => {
    return unlockedAchievements ? !!unlockedAchievements[achievementId] : false;
  }, [unlockedAchievements]);

  /**
   * Get all achievements with unlock status
   * @returns {Array} Array of achievements with unlock status
   */
  const getAllAchievements = useCallback(() => {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: isUnlocked(achievement.id),
      progress: progress[achievement.id] || 0,
      unlockedAt: unlockedAchievements?.[achievement.id]?.unlockedAt
    }));
  }, [isUnlocked, progress, unlockedAchievements]);

  /**
   * Get total achievement completion
   * @returns {Object} Completion stats
   */
  const getCompletionStats = useCallback(() => {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = Object.keys(unlockedAchievements || {}).length;
    const percentage = total > 0 ? ((unlocked / total) * 100).toFixed(1) : 0;

    return {
      total,
      unlocked,
      percentage
    };
  }, [unlockedAchievements]);

  return {
    unlockedAchievements,
    newlyUnlocked,
    progress,
    dismissNotification,
    getAchievement,
    isUnlocked,
    getAllAchievements,
    getCompletionStats,
    isLoaded: unlockedAchievements !== null
  };
};
