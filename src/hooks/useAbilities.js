import { useState, useCallback, useEffect } from 'react';
import {
  initializeAbilities,
  resetRoundAbilityUses,
  resetMatchAbilityUses,
  canUseAbility,
  useAbility as markAbilityUsed,
  getRemainingUses,
  getPassiveEffect,
  PASSIVE_ABILITIES,
  ACTIVE_ABILITIES
} from '../utils/abilitiesUtils';

/**
 * Custom hook for managing player abilities
 * @returns {Object} Ability state and functions
 */
export const useAbilities = () => {
  // Player's unlocked abilities
  const [unlockedAbilities, setUnlockedAbilities] = useState(initializeAbilities());

  // Current ability uses (resets per round/match)
  const [abilityUses, setAbilityUses] = useState({});

  // Temporary state for abilities
  const [deckPeekCards, setDeckPeekCards] = useState(null);
  const [showDeckPeekModal, setShowDeckPeekModal] = useState(false);
  const [showCardSwapModal, setShowCardSwapModal] = useState(false);
  const [luckyDrawCards, setLuckyDrawCards] = useState(null);
  const [showLuckyDrawModal, setShowLuckyDrawModal] = useState(false);
  const [savedGameState, setSavedGameState] = useState(null);

  /**
   * Load abilities from localStorage
   */
  useEffect(() => {
    const saved = localStorage.getItem('tavernRummyAbilities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUnlockedAbilities(parsed);
      } catch (e) {
        console.error('Failed to load abilities:', e);
      }
    }
  }, []);

  /**
   * Save abilities to localStorage
   */
  useEffect(() => {
    localStorage.setItem('tavernRummyAbilities', JSON.stringify(unlockedAbilities));
  }, [unlockedAbilities]);

  /**
   * Unlock an active ability
   */
  const unlockActiveAbility = useCallback((abilityId) => {
    setUnlockedAbilities(prev => ({
      ...prev,
      active: [...(prev.active || []), abilityId]
    }));
  }, []);

  /**
   * Upgrade a passive ability
   */
  const upgradePassiveAbility = useCallback((abilityId) => {
    setUnlockedAbilities(prev => ({
      ...prev,
      passive: {
        ...prev.passive,
        [abilityId]: (prev.passive[abilityId] || 0) + 1
      }
    }));
  }, []);

  /**
   * Check if an ability can be used
   */
  const checkCanUseAbility = useCallback((abilityId) => {
    return canUseAbility(abilityId, abilityUses, unlockedAbilities);
  }, [abilityUses, unlockedAbilities]);

  /**
   * Get remaining uses for an ability
   */
  const getAbilityRemainingUses = useCallback((abilityId) => {
    return getRemainingUses(abilityId, abilityUses);
  }, [abilityUses]);

  /**
   * Activate Deck Peek ability
   */
  const activateDeckPeek = useCallback((deck) => {
    const { canUse } = checkCanUseAbility(ACTIVE_ABILITIES.DECK_PEEK);
    if (!canUse) return false;

    // Get top 3 cards
    const topCards = deck.slice(0, 3);
    setDeckPeekCards(topCards);
    setShowDeckPeekModal(true);

    // Mark as used
    setAbilityUses(prev => markAbilityUsed(ACTIVE_ABILITIES.DECK_PEEK, prev));

    return true;
  }, [checkCanUseAbility]);

  /**
   * Activate Redo Turn ability
   */
  const activateRedoTurn = useCallback(() => {
    const { canUse } = checkCanUseAbility(ACTIVE_ABILITIES.REDO_TURN);
    if (!canUse || !savedGameState) return null;

    // Mark as used
    setAbilityUses(prev => markAbilityUsed(ACTIVE_ABILITIES.REDO_TURN, prev));

    // Return the saved state
    const state = savedGameState;
    setSavedGameState(null);
    return state;
  }, [checkCanUseAbility, savedGameState]);

  /**
   * Save game state for Redo Turn ability
   */
  const saveGameStateForRedo = useCallback((gameState) => {
    // Only save if ability is unlocked
    if (unlockedAbilities.active?.includes(ACTIVE_ABILITIES.REDO_TURN)) {
      setSavedGameState(gameState);
    }
  }, [unlockedAbilities]);

  /**
   * Activate Card Swap ability
   */
  const activateCardSwap = useCallback((selectedCardIndex, playerHand, deck) => {
    const { canUse } = checkCanUseAbility(ACTIVE_ABILITIES.CARD_SWAP);
    if (!canUse) return null;

    if (selectedCardIndex === null || selectedCardIndex === undefined) {
      setShowCardSwapModal(true);
      return null;
    }

    // Mark as used
    setAbilityUses(prev => markAbilityUsed(ACTIVE_ABILITIES.CARD_SWAP, prev));

    // Perform the swap
    const newHand = [...playerHand];
    const discardedCard = newHand[selectedCardIndex];
    const newCard = deck[0];
    newHand[selectedCardIndex] = newCard;

    return {
      newHand,
      newDeck: deck.slice(1),
      discardedCard,
      newCard
    };
  }, [checkCanUseAbility]);

  /**
   * Check Lucky Draw passive ability
   * Returns cards if lucky draw triggers, null otherwise
   */
  const checkLuckyDraw = useCallback((deck) => {
    const level = unlockedAbilities.passive?.[PASSIVE_ABILITIES.LUCKY_DRAW] || 0;
    if (level === 0) return null;

    const chance = getPassiveEffect(PASSIVE_ABILITIES.LUCKY_DRAW, level);
    const triggered = Math.random() < chance;

    if (triggered && deck.length >= 2) {
      const cards = [deck[0], deck[1]];
      setLuckyDrawCards(cards);
      setShowLuckyDrawModal(true);
      return cards;
    }

    return null;
  }, [unlockedAbilities]);

  /**
   * Apply Lucky Draw selection
   */
  const selectLuckyDrawCard = useCallback((selectedCard) => {
    setLuckyDrawCards(null);
    setShowLuckyDrawModal(false);
    return selectedCard;
  }, []);

  /**
   * Get Quick Hands speed multiplier
   */
  const getQuickHandsMultiplier = useCallback(() => {
    const level = unlockedAbilities.passive?.[PASSIVE_ABILITIES.QUICK_HANDS] || 0;
    if (level === 0) return 1.0;

    const speedBoost = getPassiveEffect(PASSIVE_ABILITIES.QUICK_HANDS, level);
    return 1.0 - speedBoost; // Reduces animation time
  }, [unlockedAbilities]);

  /**
   * Get Gold Magnet multiplier
   */
  const getGoldMagnetMultiplier = useCallback(() => {
    const level = unlockedAbilities.passive?.[PASSIVE_ABILITIES.GOLD_MAGNET] || 0;
    if (level === 0) return 1.0;

    const bonus = getPassiveEffect(PASSIVE_ABILITIES.GOLD_MAGNET, level);
    return 1.0 + bonus;
  }, [unlockedAbilities]);

  /**
   * Get Meld Master level
   */
  const getMeldMasterLevel = useCallback(() => {
    return unlockedAbilities.passive?.[PASSIVE_ABILITIES.MELD_MASTER] || 0;
  }, [unlockedAbilities]);

  /**
   * Get XP Boost multiplier
   */
  const getXPBoostMultiplier = useCallback(() => {
    const level = unlockedAbilities.passive?.[PASSIVE_ABILITIES.XP_BOOST] || 0;
    if (level === 0) return 1.0;

    const bonus = getPassiveEffect(PASSIVE_ABILITIES.XP_BOOST, level);
    return 1.0 + bonus;
  }, [unlockedAbilities]);

  /**
   * Reset abilities for new round
   */
  const resetForNewRound = useCallback(() => {
    setAbilityUses(prev => resetRoundAbilityUses(prev));
    setSavedGameState(null);
  }, []);

  /**
   * Reset abilities for new match
   */
  const resetForNewMatch = useCallback(() => {
    setAbilityUses(resetMatchAbilityUses());
    setSavedGameState(null);
  }, []);

  /**
   * Reset all abilities (for testing)
   */
  const resetAllAbilities = useCallback(() => {
    setUnlockedAbilities(initializeAbilities());
    setAbilityUses({});
    setSavedGameState(null);
  }, []);

  return {
    // State
    unlockedAbilities,
    abilityUses,
    deckPeekCards,
    showDeckPeekModal,
    setShowDeckPeekModal,
    showCardSwapModal,
    setShowCardSwapModal,
    luckyDrawCards,
    showLuckyDrawModal,

    // Unlock functions
    unlockActiveAbility,
    upgradePassiveAbility,

    // Check functions
    checkCanUseAbility,
    getAbilityRemainingUses,

    // Active ability functions
    activateDeckPeek,
    activateRedoTurn,
    saveGameStateForRedo,
    activateCardSwap,

    // Passive ability functions
    checkLuckyDraw,
    selectLuckyDrawCard,
    getQuickHandsMultiplier,
    getGoldMagnetMultiplier,
    getMeldMasterLevel,
    getXPBoostMultiplier,

    // Reset functions
    resetForNewRound,
    resetForNewMatch,
    resetAllAbilities
  };
};
