import { useState, useEffect, useCallback } from 'react';
import {
  ABILITIES,
  getAbilityById,
  getAbilityUpgradeCost,
  canAffordAbility,
  applyGoldMagnetBonus
} from '../utils/abilitiesUtils';
import { saveProgression, loadProgression } from '../utils/storageUtils';

/**
 * useAbilities Hook
 * Manages player abilities: unlocking, upgrading, and using abilities
 *
 * @param {Object} progression - Progression object from useProgression
 * @returns {Object} Abilities state and methods
 */
export const useAbilities = (progression) => {
  const [unlockedAbilities, setUnlockedAbilities] = useState([]);
  const [abilityLevels, setAbilityLevels] = useState({});
  const [equippedAbilities, setEquippedAbilities] = useState([]);
  const [abilityUses, setAbilityUses] = useState({}); // Track uses per match/round
  const [previousGameState, setPreviousGameState] = useState(null); // For Redo Turn

  // Load abilities from storage on mount
  useEffect(() => {
    const savedData = loadProgression();
    setUnlockedAbilities(savedData.unlockedAbilities || []);
    setAbilityLevels(savedData.abilityLevels || {});
    setEquippedAbilities(savedData.equippedAbilities || []);
  }, []);

  // Save abilities whenever they change
  useEffect(() => {
    const savedData = loadProgression();
    saveProgression({
      ...savedData,
      unlockedAbilities,
      abilityLevels,
      equippedAbilities
    });
  }, [unlockedAbilities, abilityLevels, equippedAbilities]);

  /**
   * Unlock or upgrade an ability
   *
   * @param {string} abilityId - Ability ID to unlock/upgrade
   * @returns {boolean} True if successful
   */
  const unlockAbility = useCallback((abilityId) => {
    const ability = getAbilityById(abilityId);

    if (!ability) {
      return false;
    }

    if (ability.type === 'active') {
      // Active ability - simple unlock
      if (unlockedAbilities.includes(abilityId)) {
        return false; // Already unlocked
      }

      if (!canAffordAbility(progression.abilityPoints, abilityId)) {
        return false; // Can't afford
      }

      // Spend AP and unlock
      if (progression.spendAP(ability.cost)) {
        setUnlockedAbilities(prev => [...prev, abilityId]);
        return true;
      }
    } else {
      // Passive ability - upgrade level
      const currentLevel = abilityLevels[abilityId] || 0;
      const upgradeCost = getAbilityUpgradeCost(abilityId, currentLevel);

      if (currentLevel >= ability.maxLevel) {
        return false; // Max level
      }

      if (!canAffordAbility(progression.abilityPoints, abilityId, currentLevel)) {
        return false; // Can't afford
      }

      // Spend AP and upgrade
      if (progression.spendAP(upgradeCost)) {
        setAbilityLevels(prev => ({
          ...prev,
          [abilityId]: currentLevel + 1
        }));

        // Add to unlocked if first time
        if (!unlockedAbilities.includes(abilityId)) {
          setUnlockedAbilities(prev => [...prev, abilityId]);
        }

        return true;
      }
    }

    return false;
  }, [unlockedAbilities, abilityLevels, progression]);

  /**
   * Equip an active ability
   *
   * @param {string} abilityId - Ability ID to equip
   * @returns {boolean} True if successful
   */
  const equipAbility = useCallback((abilityId) => {
    if (!unlockedAbilities.includes(abilityId)) {
      return false; // Not unlocked
    }

    const ability = getAbilityById(abilityId);
    if (ability.type !== 'active') {
      return false; // Only active abilities can be equipped
    }

    if (equippedAbilities.includes(abilityId)) {
      return false; // Already equipped
    }

    // Limit to 3 equipped abilities (V1 has only 1, but prepare for future)
    if (equippedAbilities.length >= 3) {
      return false;
    }

    setEquippedAbilities(prev => [...prev, abilityId]);
    return true;
  }, [unlockedAbilities, equippedAbilities]);

  /**
   * Unequip an active ability
   *
   * @param {string} abilityId - Ability ID to unequip
   */
  const unequipAbility = useCallback((abilityId) => {
    setEquippedAbilities(prev => prev.filter(id => id !== abilityId));
  }, []);

  /**
   * Check if ability can be used
   *
   * @param {string} abilityId - Ability ID
   * @returns {boolean} True if ability can be used
   */
  const canUseAbility = useCallback((abilityId) => {
    const ability = getAbilityById(abilityId);

    if (!ability || !equippedAbilities.includes(abilityId)) {
      return false;
    }

    const uses = abilityUses[abilityId] || 0;

    if (ability.usesPerRound !== undefined) {
      return uses < ability.usesPerRound;
    }

    if (ability.usesPerMatch !== undefined) {
      return uses < ability.usesPerMatch;
    }

    return true;
  }, [equippedAbilities, abilityUses]);

  /**
   * Use an ability (increment use counter)
   *
   * @param {string} abilityId - Ability ID
   * @returns {boolean} True if successful
   */
  const activateAbility = useCallback((abilityId) => {
    if (!canUseAbility(abilityId)) {
      return false;
    }

    setAbilityUses(prev => ({
      ...prev,
      [abilityId]: (prev[abilityId] || 0) + 1
    }));

    return true;
  }, [canUseAbility]);

  /**
   * Reset ability uses (call at end of round/match)
   *
   * @param {string} scope - 'round' or 'match'
   */
  const resetAbilityUses = useCallback((scope = 'round') => {
    setAbilityUses(prev => {
      const newUses = { ...prev };

      equippedAbilities.forEach(abilityId => {
        const ability = getAbilityById(abilityId);

        if (scope === 'round' && ability.usesPerRound !== undefined) {
          newUses[abilityId] = 0;
        } else if (scope === 'match' && ability.usesPerMatch !== undefined) {
          newUses[abilityId] = 0;
        }
      });

      return newUses;
    });
  }, [equippedAbilities]);

  /**
   * Save game state for Redo Turn ability
   *
   * @param {Object} gameState - Current game state
   */
  const saveGameState = useCallback((gameState) => {
    setPreviousGameState(gameState);
  }, []);

  /**
   * Use Redo Turn ability
   *
   * @returns {Object|null} Previous game state or null if not available
   */
  const executeRedoTurn = useCallback(() => {
    if (!canUseAbility(ABILITIES.REDO_TURN.id)) {
      return null;
    }

    if (!previousGameState) {
      return null;
    }

    activateAbility(ABILITIES.REDO_TURN.id);
    const state = previousGameState;
    setPreviousGameState(null); // Clear after use
    return state;
  }, [canUseAbility, activateAbility, previousGameState]);

  /**
   * Apply Gold Magnet bonus to score
   *
   * @param {number} baseScore - Base score
   * @returns {number} Modified score
   */
  const applyGoldMagnet = useCallback((baseScore) => {
    const goldMagnetLevel = abilityLevels[ABILITIES.GOLD_MAGNET.id] || 0;
    return applyGoldMagnetBonus(baseScore, goldMagnetLevel);
  }, [abilityLevels]);

  /**
   * Get ability level
   *
   * @param {string} abilityId - Ability ID
   * @returns {number} Current level (0 if not unlocked)
   */
  const getAbilityLevel = useCallback((abilityId) => {
    return abilityLevels[abilityId] || 0;
  }, [abilityLevels]);

  /**
   * Check if ability is unlocked
   *
   * @param {string} abilityId - Ability ID
   * @returns {boolean} True if unlocked
   */
  const isAbilityUnlocked = useCallback((abilityId) => {
    return unlockedAbilities.includes(abilityId);
  }, [unlockedAbilities]);

  /**
   * Get remaining uses for an ability
   *
   * @param {string} abilityId - Ability ID
   * @returns {number} Remaining uses
   */
  const getRemainingUses = useCallback((abilityId) => {
    const ability = getAbilityById(abilityId);
    if (!ability) return 0;

    const used = abilityUses[abilityId] || 0;

    if (ability.usesPerRound !== undefined) {
      return Math.max(0, ability.usesPerRound - used);
    }

    if (ability.usesPerMatch !== undefined) {
      return Math.max(0, ability.usesPerMatch - used);
    }

    return Infinity;
  }, [abilityUses]);

  return {
    // State
    unlockedAbilities,
    abilityLevels,
    equippedAbilities,
    abilityUses,

    // Methods
    unlockAbility,
    equipAbility,
    unequipAbility,
    canUseAbility,
    activateAbility,
    resetAbilityUses,
    saveGameState,
    executeRedoTurn,
    applyGoldMagnet,
    getAbilityLevel,
    isAbilityUnlocked,
    getRemainingUses,
  };
};
