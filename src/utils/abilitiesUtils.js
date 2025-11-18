/**
 * Abilities System Utilities
 * Defines all abilities (active and passive) for the roguelite progression
 */

/**
 * Ability Types
 */
export const ABILITY_TYPES = {
  ACTIVE: 'active',
  PASSIVE: 'passive'
};

/**
 * All available abilities
 * Phase 1 (V1): Only Redo Turn and Gold Magnet are implemented
 */
export const ABILITIES = {
  // ===== ACTIVE ABILITIES =====
  REDO_TURN: {
    id: 'redo_turn',
    name: 'Redo Turn',
    type: ABILITY_TYPES.ACTIVE,
    icon: '🔄',
    description: 'Undo your last discard and choose a different card',
    cost: 2, // AP cost to unlock
    usesPerRound: 1,
    cooldown: 0, // No cooldown between uses
    implemented: true, // V1 implementation
    shortDesc: 'Undo last discard',
  },

  MYSTIC_EYE: {
    id: 'mystic_eye',
    name: 'Mystic Eye',
    type: ABILITY_TYPES.ACTIVE,
    icon: '🔮',
    description: 'Reveal one random card from opponent\'s hand',
    cost: 3,
    usesPerMatch: 1,
    cooldown: 0,
    implemented: false, // Phase 2
    shortDesc: 'See opponent card',
  },

  CARD_SWAP: {
    id: 'card_swap',
    name: 'Card Swap',
    type: ABILITY_TYPES.ACTIVE,
    icon: '🎴',
    description: 'Discard a card and immediately draw a new one',
    cost: 2,
    usesPerMatch: 2,
    cooldown: 0,
    implemented: false, // Phase 2
    shortDesc: 'Instant card swap',
  },

  DECK_PEEK: {
    id: 'deck_peek',
    name: 'Deck Peek',
    type: ABILITY_TYPES.ACTIVE,
    icon: '👁️',
    description: 'Look at the top 3 cards of the deck',
    cost: 1,
    usesPerMatch: 3,
    cooldown: 0,
    implemented: false, // Phase 2
    shortDesc: 'Peek top 3 cards',
  },

  // ===== PASSIVE ABILITIES =====
  GOLD_MAGNET: {
    id: 'gold_magnet',
    name: 'Gold Magnet',
    type: ABILITY_TYPES.PASSIVE,
    icon: '💰',
    description: 'Increase gold earned from wins',
    cost: 2, // Cost for level 1
    maxLevel: 3,
    levels: [
      { level: 1, cost: 2, effect: '+10% gold', multiplier: 1.10 },
      { level: 2, cost: 2, effect: '+20% gold', multiplier: 1.20 },
      { level: 3, cost: 2, effect: '+30% gold', multiplier: 1.30 }
    ],
    implemented: true, // V1 implementation
    shortDesc: 'More gold from wins',
  },

  LUCKY_DRAW: {
    id: 'lucky_draw',
    name: 'Lucky Draw',
    type: ABILITY_TYPES.PASSIVE,
    icon: '📊',
    description: 'Chance to draw 2 cards and pick 1',
    cost: 1,
    maxLevel: 3,
    levels: [
      { level: 1, cost: 1, effect: '20% chance', chance: 0.20 },
      { level: 2, cost: 1, effect: '40% chance', chance: 0.40 },
      { level: 3, cost: 1, effect: '60% chance', chance: 0.60 }
    ],
    implemented: false, // Phase 2
    shortDesc: 'Draw 2, pick 1',
  },

  MELD_MASTER: {
    id: 'meld_master',
    name: 'Meld Master',
    type: ABILITY_TYPES.PASSIVE,
    icon: '🧠',
    description: 'Enhanced meld highlighting and hints',
    cost: 2,
    maxLevel: 3,
    levels: [
      { level: 1, cost: 2, effect: 'Show potential melds' },
      { level: 2, cost: 2, effect: 'Show best discard' },
      { level: 3, cost: 2, effect: 'Show optimal plays' }
    ],
    implemented: false, // Phase 2
    shortDesc: 'Better meld hints',
  },

  QUICK_HANDS: {
    id: 'quick_hands',
    name: 'Quick Hands',
    type: ABILITY_TYPES.PASSIVE,
    icon: '⚡',
    description: 'Speed up AI turn animations',
    cost: 1,
    maxLevel: 3,
    levels: [
      { level: 1, cost: 1, effect: '20% faster', speedMultiplier: 0.80 },
      { level: 2, cost: 1, effect: '40% faster', speedMultiplier: 0.60 },
      { level: 3, cost: 1, effect: '60% faster', speedMultiplier: 0.40 }
    ],
    implemented: false, // Phase 2
    shortDesc: 'Faster AI turns',
  },

  XP_BOOST: {
    id: 'xp_boost',
    name: 'XP Boost',
    type: ABILITY_TYPES.PASSIVE,
    icon: '🎓',
    description: 'Earn more XP from games',
    cost: 2,
    maxLevel: 2,
    levels: [
      { level: 1, cost: 2, effect: '+25% XP', multiplier: 1.25 },
      { level: 2, cost: 2, effect: '+50% XP', multiplier: 1.50 }
    ],
    implemented: false, // Phase 2
    shortDesc: 'More XP earned',
  },
};

/**
 * Get all active abilities
 *
 * @returns {Array} Array of active ability objects
 */
export const getActiveAbilities = () => {
  return Object.values(ABILITIES).filter(ability => ability.type === ABILITY_TYPES.ACTIVE);
};

/**
 * Get all passive abilities
 *
 * @returns {Array} Array of passive ability objects
 */
export const getPassiveAbilities = () => {
  return Object.values(ABILITIES).filter(ability => ability.type === ABILITY_TYPES.PASSIVE);
};

/**
 * Get implemented abilities only (for V1)
 *
 * @returns {Array} Array of implemented ability objects
 */
export const getImplementedAbilities = () => {
  return Object.values(ABILITIES).filter(ability => ability.implemented);
};

/**
 * Get ability by ID
 *
 * @param {string} abilityId - Ability ID
 * @returns {Object|null} Ability object or null
 */
export const getAbilityById = (abilityId) => {
  return Object.values(ABILITIES).find(ability => ability.id === abilityId) || null;
};

/**
 * Calculate cost for upgrading a passive ability
 *
 * @param {string} abilityId - Ability ID
 * @param {number} currentLevel - Current level (0 if not owned)
 * @returns {number} Cost in AP
 */
export const getAbilityUpgradeCost = (abilityId, currentLevel = 0) => {
  const ability = getAbilityById(abilityId);

  if (!ability || ability.type !== ABILITY_TYPES.PASSIVE) {
    return 0;
  }

  const nextLevel = currentLevel + 1;
  if (nextLevel > ability.maxLevel) {
    return 0; // Max level reached
  }

  const levelData = ability.levels.find(l => l.level === nextLevel);
  return levelData ? levelData.cost : 0;
};

/**
 * Check if player can afford an ability
 *
 * @param {number} availableAP - Player's available AP
 * @param {string} abilityId - Ability ID
 * @param {number} currentLevel - Current level (for passive abilities)
 * @returns {boolean} True if player can afford it
 */
export const canAffordAbility = (availableAP, abilityId, currentLevel = 0) => {
  const ability = getAbilityById(abilityId);

  if (!ability) {
    return false;
  }

  if (ability.type === ABILITY_TYPES.ACTIVE) {
    return availableAP >= ability.cost;
  } else {
    const upgradeCost = getAbilityUpgradeCost(abilityId, currentLevel);
    return upgradeCost > 0 && availableAP >= upgradeCost;
  }
};

/**
 * Apply Gold Magnet passive bonus to score
 *
 * @param {number} baseScore - Base score/gold earned
 * @param {number} goldMagnetLevel - Level of Gold Magnet (0 if not owned)
 * @returns {number} Modified score with bonus applied
 */
export const applyGoldMagnetBonus = (baseScore, goldMagnetLevel = 0) => {
  if (goldMagnetLevel === 0) {
    return baseScore;
  }

  const ability = ABILITIES.GOLD_MAGNET;
  const levelData = ability.levels.find(l => l.level === goldMagnetLevel);

  if (!levelData) {
    return baseScore;
  }

  return Math.floor(baseScore * levelData.multiplier);
};

/**
 * Get formatted ability description
 *
 * @param {string} abilityId - Ability ID
 * @param {number} level - Current level (for passive abilities)
 * @returns {string} Formatted description
 */
export const getAbilityDescription = (abilityId, level = 1) => {
  const ability = getAbilityById(abilityId);

  if (!ability) {
    return '';
  }

  if (ability.type === ABILITY_TYPES.ACTIVE) {
    return ability.description;
  } else {
    const levelData = ability.levels.find(l => l.level === level);
    return levelData ? `${ability.description} (${levelData.effect})` : ability.description;
  }
};
