/**
 * Ability Definitions and Utilities
 *
 * This module contains all ability definitions, costs, effects,
 * and helper functions for the ability system.
 */

// Ability Types
export const ABILITY_TYPES = {
  ACTIVE: 'active',
  PASSIVE: 'passive'
};

// Active Abilities
export const ACTIVE_ABILITIES = {
  DECK_PEEK: 'deck_peek',
  REDO_TURN: 'redo_turn',
  CARD_SWAP: 'card_swap',
  MYSTIC_EYE: 'mystic_eye',
  SHIELD: 'shield',
  AGGRESSIVE_KNOCK: 'aggressive_knock',
  PERFECT_VISION: 'perfect_vision',
  PHOENIX_REVIVAL: 'phoenix_revival'
};

// Passive Abilities
export const PASSIVE_ABILITIES = {
  LUCKY_DRAW: 'lucky_draw',
  GOLD_MAGNET: 'gold_magnet',
  MELD_MASTER: 'meld_master',
  QUICK_HANDS: 'quick_hands',
  XP_BOOST: 'xp_boost'
};

// Ability Definitions
export const ABILITIES = {
  // Active Abilities
  [ACTIVE_ABILITIES.DECK_PEEK]: {
    id: ACTIVE_ABILITIES.DECK_PEEK,
    name: 'Deck Peek',
    icon: '👁️',
    type: ABILITY_TYPES.ACTIVE,
    cost: 1,
    description: 'See the top 3 cards of the deck',
    detailedDescription: 'Reveals the top 3 cards in the deck, allowing you to make more informed decisions about whether to draw from the deck or discard pile.',
    usesPerMatch: 3,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.REDO_TURN]: {
    id: ACTIVE_ABILITIES.REDO_TURN,
    name: 'Redo Turn',
    icon: '🔄',
    type: ABILITY_TYPES.ACTIVE,
    cost: 2,
    description: 'Undo your last discard',
    detailedDescription: 'Takes back your last discard and returns it to your hand, allowing you to reconsider your move. Can only be used once per round.',
    usesPerRound: 1,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.CARD_SWAP]: {
    id: ACTIVE_ABILITIES.CARD_SWAP,
    name: 'Card Swap',
    icon: '🎴',
    type: ABILITY_TYPES.ACTIVE,
    cost: 2,
    description: 'Discard a card and draw a new one instantly',
    detailedDescription: 'Immediately discard one card from your hand and draw a replacement from the deck. Great for getting rid of unwanted cards without ending your turn.',
    usesPerMatch: 2,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.MYSTIC_EYE]: {
    id: ACTIVE_ABILITIES.MYSTIC_EYE,
    name: 'Mystic Eye',
    icon: '🔮',
    type: ABILITY_TYPES.ACTIVE,
    cost: 3,
    description: "See one of your opponent's cards",
    detailedDescription: "Reveals a random card from your opponent's hand for 5 seconds, giving you insight into their strategy.",
    usesPerMatch: 1,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.SHIELD]: {
    id: ACTIVE_ABILITIES.SHIELD,
    name: 'Shield',
    icon: '🛡️',
    type: ABILITY_TYPES.ACTIVE,
    cost: 3,
    description: 'Reduce gold loss by 50%',
    detailedDescription: 'When you lose a round, you only lose half the normal gold. This effect is always active once purchased.',
    passive: true
  },

  [ACTIVE_ABILITIES.AGGRESSIVE_KNOCK]: {
    id: ACTIVE_ABILITIES.AGGRESSIVE_KNOCK,
    name: 'Aggressive Knock',
    icon: '⚔️',
    type: ABILITY_TYPES.ACTIVE,
    cost: 2,
    description: 'Knock with up to 15 deadwood',
    detailedDescription: 'Allows you to knock even with higher deadwood (up to 15 instead of the normal 10). Use this to catch opponents off guard.',
    usesPerMatch: 1,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.PERFECT_VISION]: {
    id: ACTIVE_ABILITIES.PERFECT_VISION,
    name: 'Perfect Vision',
    icon: '🎯',
    type: ABILITY_TYPES.ACTIVE,
    cost: 4,
    description: 'Show the optimal card to discard',
    detailedDescription: 'Highlights the best card to discard based on your current hand and potential melds.',
    usesPerMatch: 5,
    cooldown: 0
  },

  [ACTIVE_ABILITIES.PHOENIX_REVIVAL]: {
    id: ACTIVE_ABILITIES.PHOENIX_REVIVAL,
    name: 'Phoenix Revival',
    icon: '🔥',
    type: ABILITY_TYPES.ACTIVE,
    cost: 5,
    description: 'Respawn with 50 gold if you reach 0',
    detailedDescription: 'If your gold reaches 0, automatically revive with 50 gold. Can only be used once per session.',
    usesPerSession: 1,
    cooldown: 0
  },

  // Passive Abilities
  [PASSIVE_ABILITIES.LUCKY_DRAW]: {
    id: PASSIVE_ABILITIES.LUCKY_DRAW,
    name: 'Lucky Draw',
    icon: '📊',
    type: ABILITY_TYPES.PASSIVE,
    costPerLevel: 1,
    maxLevel: 3,
    description: 'Chance to draw 2 cards and pick one',
    detailedDescription: 'When drawing from the deck, you have a chance to draw 2 cards and choose which one to keep.',
    levels: [
      { level: 1, effect: '20% chance', value: 0.20 },
      { level: 2, effect: '40% chance', value: 0.40 },
      { level: 3, effect: '60% chance', value: 0.60 }
    ]
  },

  [PASSIVE_ABILITIES.GOLD_MAGNET]: {
    id: PASSIVE_ABILITIES.GOLD_MAGNET,
    name: 'Gold Magnet',
    icon: '💰',
    type: ABILITY_TYPES.PASSIVE,
    costPerLevel: 2,
    maxLevel: 3,
    description: 'Earn extra gold from wins',
    detailedDescription: 'Increases the amount of gold you earn when you win a round.',
    levels: [
      { level: 1, effect: '+10% gold', value: 0.10 },
      { level: 2, effect: '+20% gold', value: 0.20 },
      { level: 3, effect: '+30% gold', value: 0.30 }
    ]
  },

  [PASSIVE_ABILITIES.MELD_MASTER]: {
    id: PASSIVE_ABILITIES.MELD_MASTER,
    name: 'Meld Master',
    icon: '🧠',
    type: ABILITY_TYPES.PASSIVE,
    costPerLevel: 2,
    maxLevel: 3,
    description: 'Better meld visibility and hints',
    detailedDescription: 'Highlights potential melds more clearly and suggests cards that could complete melds.',
    levels: [
      { level: 1, effect: 'Basic hints', value: 1 },
      { level: 2, effect: 'Advanced hints', value: 2 },
      { level: 3, effect: 'Expert hints', value: 3 }
    ]
  },

  [PASSIVE_ABILITIES.QUICK_HANDS]: {
    id: PASSIVE_ABILITIES.QUICK_HANDS,
    name: 'Quick Hands',
    icon: '⚡',
    type: ABILITY_TYPES.PASSIVE,
    costPerLevel: 1,
    maxLevel: 3,
    description: 'Speed up AI turn animations',
    detailedDescription: 'Reduces the time it takes for the AI to complete their turn, making games faster.',
    levels: [
      { level: 1, effect: '20% faster', value: 0.20 },
      { level: 2, effect: '40% faster', value: 0.40 },
      { level: 3, effect: '60% faster', value: 0.60 }
    ]
  },

  [PASSIVE_ABILITIES.XP_BOOST]: {
    id: PASSIVE_ABILITIES.XP_BOOST,
    name: 'XP Boost',
    icon: '🎓',
    type: ABILITY_TYPES.PASSIVE,
    costPerLevel: 2,
    maxLevel: 2,
    description: 'Earn extra XP from all sources',
    detailedDescription: 'Increases the amount of XP you earn from playing games, winning, and special actions.',
    levels: [
      { level: 1, effect: '+25% XP', value: 0.25 },
      { level: 2, effect: '+50% XP', value: 0.50 }
    ]
  }
};

/**
 * Get ability definition by ID
 * @param {string} abilityId - The ability ID
 * @returns {Object|null} The ability definition or null
 */
export const getAbility = (abilityId) => {
  return ABILITIES[abilityId] || null;
};

/**
 * Check if an ability is active type
 * @param {string} abilityId - The ability ID
 * @returns {boolean} True if active ability
 */
export const isActiveAbility = (abilityId) => {
  const ability = getAbility(abilityId);
  return ability && ability.type === ABILITY_TYPES.ACTIVE;
};

/**
 * Check if an ability is passive type
 * @param {string} abilityId - The ability ID
 * @returns {boolean} True if passive ability
 */
export const isPassiveAbility = (abilityId) => {
  const ability = getAbility(abilityId);
  return ability && ability.type === ABILITY_TYPES.PASSIVE;
};

/**
 * Calculate total AP cost for a passive ability at a given level
 * @param {string} abilityId - The passive ability ID
 * @param {number} level - The target level
 * @returns {number} Total AP cost
 */
export const calculatePassiveCost = (abilityId, level) => {
  const ability = getAbility(abilityId);
  if (!ability || !isPassiveAbility(abilityId)) return 0;

  return ability.costPerLevel * level;
};

/**
 * Get the effect value for a passive ability at a given level
 * @param {string} abilityId - The passive ability ID
 * @param {number} level - The ability level
 * @returns {number} The effect value
 */
export const getPassiveEffect = (abilityId, level) => {
  const ability = getAbility(abilityId);
  if (!ability || !isPassiveAbility(abilityId)) return 0;

  const levelData = ability.levels.find(l => l.level === level);
  return levelData ? levelData.value : 0;
};

/**
 * Get all unlocked abilities from player data
 * @param {Object} playerAbilities - Player's ability data
 * @returns {Array} Array of unlocked ability IDs
 */
export const getUnlockedAbilities = (playerAbilities) => {
  if (!playerAbilities) return [];

  const unlocked = [];

  // Active abilities
  if (playerAbilities.active) {
    unlocked.push(...playerAbilities.active);
  }

  // Passive abilities (check for level > 0)
  if (playerAbilities.passive) {
    Object.entries(playerAbilities.passive).forEach(([abilityId, level]) => {
      if (level > 0) {
        unlocked.push(abilityId);
      }
    });
  }

  return unlocked;
};

/**
 * Initialize default ability state
 * @returns {Object} Default ability state
 */
export const initializeAbilities = () => {
  return {
    active: [],
    passive: {
      [PASSIVE_ABILITIES.LUCKY_DRAW]: 0,
      [PASSIVE_ABILITIES.GOLD_MAGNET]: 0,
      [PASSIVE_ABILITIES.MELD_MASTER]: 0,
      [PASSIVE_ABILITIES.QUICK_HANDS]: 0,
      [PASSIVE_ABILITIES.XP_BOOST]: 0
    },
    uses: {}
  };
};

/**
 * Reset ability uses for a new round
 * @param {Object} abilityUses - Current ability uses
 * @returns {Object} Updated ability uses
 */
export const resetRoundAbilityUses = (abilityUses) => {
  const resetUses = { ...abilityUses };

  // Reset round-based abilities
  if (resetUses[ACTIVE_ABILITIES.REDO_TURN]) {
    resetUses[ACTIVE_ABILITIES.REDO_TURN] = 0;
  }

  return resetUses;
};

/**
 * Reset ability uses for a new match
 * @returns {Object} Fresh ability uses object
 */
export const resetMatchAbilityUses = () => {
  return {};
};

/**
 * Check if ability can be used
 * @param {string} abilityId - The ability ID
 * @param {Object} abilityUses - Current ability uses
 * @param {Object} playerAbilities - Player's unlocked abilities
 * @returns {Object} { canUse: boolean, reason: string }
 */
export const canUseAbility = (abilityId, abilityUses, playerAbilities) => {
  const ability = getAbility(abilityId);

  if (!ability) {
    return { canUse: false, reason: 'Ability not found' };
  }

  // Check if unlocked
  const isUnlocked = playerAbilities?.active?.includes(abilityId);
  if (!isUnlocked) {
    return { canUse: false, reason: 'Ability not unlocked' };
  }

  const currentUses = abilityUses[abilityId] || 0;

  // Check uses per round
  if (ability.usesPerRound !== undefined) {
    if (currentUses >= ability.usesPerRound) {
      return { canUse: false, reason: 'No uses remaining this round' };
    }
  }

  // Check uses per match
  if (ability.usesPerMatch !== undefined) {
    if (currentUses >= ability.usesPerMatch) {
      return { canUse: false, reason: 'No uses remaining this match' };
    }
  }

  // Check uses per session
  if (ability.usesPerSession !== undefined) {
    if (currentUses >= ability.usesPerSession) {
      return { canUse: false, reason: 'No uses remaining this session' };
    }
  }

  return { canUse: true, reason: '' };
};

/**
 * Use an ability (increment usage counter)
 * @param {string} abilityId - The ability ID
 * @param {Object} abilityUses - Current ability uses
 * @returns {Object} Updated ability uses
 */
export const useAbility = (abilityId, abilityUses) => {
  return {
    ...abilityUses,
    [abilityId]: (abilityUses[abilityId] || 0) + 1
  };
};

/**
 * Get remaining uses for an ability
 * @param {string} abilityId - The ability ID
 * @param {Object} abilityUses - Current ability uses
 * @returns {number|string} Remaining uses or 'unlimited'
 */
export const getRemainingUses = (abilityId, abilityUses) => {
  const ability = getAbility(abilityId);
  if (!ability) return 0;

  const currentUses = abilityUses[abilityId] || 0;

  if (ability.usesPerRound !== undefined) {
    return ability.usesPerRound - currentUses;
  }

  if (ability.usesPerMatch !== undefined) {
    return ability.usesPerMatch - currentUses;
  }

  if (ability.usesPerSession !== undefined) {
    return ability.usesPerSession - currentUses;
  }

  return 'unlimited';
};
