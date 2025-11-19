import { useState, useEffect, useCallback } from 'react';
import {
  loadCosmetics,
  saveCosmetics,
  getSkin,
  isSkinUnlocked,
  unlockSkin as unlockSkinUtil,
  DEFAULT_COSMETICS
} from '../utils/skinsUtils';

/**
 * Custom hook for managing cosmetic preferences
 * Handles skin selection, unlocking, and persistence
 */
export const useCosmetics = () => {
  const [cosmetics, setCosmetics] = useState(DEFAULT_COSMETICS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cosmetics from localStorage on mount
  useEffect(() => {
    const loaded = loadCosmetics();
    setCosmetics(loaded);
    setIsLoaded(true);
  }, []);

  // Save cosmetics whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveCosmetics(cosmetics);
    }
  }, [cosmetics, isLoaded]);

  /**
   * Change the active skin
   * @param {string} skinId - ID of skin to activate
   * @returns {boolean} Success status
   */
  const setActiveSkin = useCallback((skinId) => {
    // Check if skin is unlocked
    if (!isSkinUnlocked(skinId, cosmetics.unlockedSkins)) {
      console.warn('Attempted to activate locked skin:', skinId);
      return false;
    }

    setCosmetics(prev => ({
      ...prev,
      activeSkin: skinId
    }));

    return true;
  }, [cosmetics.unlockedSkins]);

  /**
   * Unlock a skin using gold
   * @param {string} skinId - ID of skin to unlock
   * @param {number} playerGold - Player's current gold amount
   * @returns {Object} Result object
   */
  const unlockSkin = useCallback((skinId, playerGold) => {
    const result = unlockSkinUtil(skinId, playerGold);

    if (result.success && !result.alreadyUnlocked) {
      // Update unlocked skins
      setCosmetics(prev => ({
        ...prev,
        unlockedSkins: {
          ...prev.unlockedSkins,
          [skinId]: true
        }
      }));
    }

    return result;
  }, []);

  /**
   * Get the currently active skin definition
   * @returns {Object} Active skin definition
   */
  const getActiveSkin = useCallback(() => {
    return getSkin(cosmetics.activeSkin);
  }, [cosmetics.activeSkin]);

  /**
   * Check if a specific skin is currently active
   * @param {string} skinId - Skin ID to check
   * @returns {boolean} True if skin is active
   */
  const isActiveSkin = useCallback((skinId) => {
    return cosmetics.activeSkin === skinId;
  }, [cosmetics.activeSkin]);

  /**
   * Reset cosmetics to default (for testing/debugging)
   */
  const resetCosmetics = useCallback(() => {
    setCosmetics(DEFAULT_COSMETICS);
    saveCosmetics(DEFAULT_COSMETICS);
  }, []);

  return {
    // State
    activeSkin: cosmetics.activeSkin,
    unlockedSkins: cosmetics.unlockedSkins,
    isLoaded,

    // Actions
    setActiveSkin,
    unlockSkin,
    getActiveSkin,
    isActiveSkin,
    resetCosmetics,

    // Helpers
    isSkinUnlocked: (skinId) => isSkinUnlocked(skinId, cosmetics.unlockedSkins)
  };
};
