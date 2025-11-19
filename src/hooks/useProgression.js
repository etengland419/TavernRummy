import { useState, useEffect, useCallback } from 'react';
import {
  calculateLevel,
  calculateRoundXP,
  checkLevelUp,
  calculateAP
} from '../utils/progressionUtils';
import { saveProgression, loadProgression } from '../utils/storageUtils';

/**
 * useProgression Hook
 * Manages player progression: XP, levels, and Ability Points
 *
 * @returns {Object} Progression state and methods
 */
export const useProgression = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentLevelXP, setCurrentLevelXP] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(50);
  const [abilityPoints, setAbilityPoints] = useState(0);
  const [spentAP, setSpentAP] = useState(0);
  const [gold, setGold] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);

  // Load progression from storage on mount
  useEffect(() => {
    const savedData = loadProgression();

    setTotalXP(savedData.totalXP || 0);
    setSpentAP(savedData.spentAP || 0);
    setGold(savedData.gold || 0);

    // Calculate current level and XP
    const levelData = calculateLevel(savedData.totalXP || 0);
    setLevel(levelData.level);
    setCurrentLevelXP(levelData.currentLevelXP);
    setXpToNextLevel(levelData.xpToNextLevel);

    // Calculate available AP
    const totalAP = calculateAP(levelData.level);
    setAbilityPoints(totalAP - (savedData.spentAP || 0));
  }, []);

  // Save progression whenever it changes
  useEffect(() => {
    if (totalXP > 0 || spentAP > 0 || gold > 0) {
      const savedData = loadProgression();
      saveProgression({
        ...savedData,
        totalXP,
        level,
        spentAP,
        abilityPoints,
        gold
      });
    }
  }, [totalXP, level, spentAP, abilityPoints, gold]);

  /**
   * Add XP and check for level ups
   *
   * @param {number} xpAmount - Amount of XP to add
   * @param {string} reason - Reason for XP gain (for display)
   */
  const addXP = useCallback((xpAmount, reason = '') => {
    setTotalXP(prevXP => {
      const newXP = prevXP + xpAmount;

      // Check for level up
      const levelUpInfo = checkLevelUp(prevXP, newXP);

      if (levelUpInfo.leveledUp) {
        // Update level and AP
        setLevel(levelUpInfo.newLevel);
        setAbilityPoints(prev => prev + levelUpInfo.apGained);

        // Show level up modal
        setLevelUpData({
          oldLevel: levelUpInfo.oldLevel,
          newLevel: levelUpInfo.newLevel,
          apGained: levelUpInfo.apGained
        });
        setShowLevelUpModal(true);

        // Update XP display for new level
        const newLevelData = calculateLevel(newXP);
        setCurrentLevelXP(newLevelData.currentLevelXP);
        setXpToNextLevel(newLevelData.xpToNextLevel);
      } else {
        // Just update current level XP
        const levelData = calculateLevel(newXP);
        setCurrentLevelXP(levelData.currentLevelXP);
        setXpToNextLevel(levelData.xpToNextLevel);
      }

      return newXP;
    });
  }, []);

  /**
   * Add XP from round result
   *
   * @param {Object} roundResult - Result from scoringUtils.calculateRoundResult
   */
  const addRoundXP = useCallback((roundResult) => {
    const { xp, breakdown } = calculateRoundXP(roundResult, true);
    addXP(xp, breakdown.join(', '));
    return { xp, breakdown };
  }, [addXP]);

  /**
   * Spend Ability Points
   *
   * @param {number} amount - Amount of AP to spend
   * @returns {boolean} True if successful
   */
  const spendAP = useCallback((amount) => {
    if (amount > abilityPoints) {
      return false;
    }

    setAbilityPoints(prev => prev - amount);
    setSpentAP(prev => prev + amount);
    return true;
  }, [abilityPoints]);

  /**
   * Refund Ability Points (for respec)
   *
   * @param {number} amount - Amount of AP to refund
   */
  const refundAP = useCallback((amount) => {
    setAbilityPoints(prev => prev + amount);
    setSpentAP(prev => Math.max(0, prev - amount));
  }, []);

  /**
   * Close level up modal
   */
  const closeLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
    setLevelUpData(null);
  }, []);

  /**
   * Get XP progress percentage
   */
  const getXPProgress = useCallback(() => {
    return Math.min(100, Math.floor((currentLevelXP / xpToNextLevel) * 100));
  }, [currentLevelXP, xpToNextLevel]);

  /**
   * Add gold to player's balance
   *
   * @param {number} amount - Amount of gold to add
   */
  const addGold = useCallback((amount) => {
    setGold(prev => prev + amount);
  }, []);

  /**
   * Spend gold from player's balance
   *
   * @param {number} amount - Amount of gold to spend
   * @returns {boolean} True if successful (had enough gold)
   */
  const spendGold = useCallback((amount) => {
    if (gold < amount) {
      return false;
    }

    setGold(prev => prev - amount);
    return true;
  }, [gold]);

  return {
    // State
    totalXP,
    level,
    currentLevelXP,
    xpToNextLevel,
    abilityPoints,
    spentAP,
    gold,
    showLevelUpModal,
    levelUpData,

    // Methods
    addXP,
    addRoundXP,
    spendAP,
    refundAP,
    addGold,
    spendGold,
    closeLevelUpModal,
    getXPProgress,
  };
};
