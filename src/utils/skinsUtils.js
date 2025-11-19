/**
 * Card Skins System
 * Defines visual themes for playing cards
 */

export const CARD_SKINS = {
  CLASSIC: 'classic',
  GOTHIC: 'gothic',
  STEAMPUNK: 'steampunk',
  FANTASY: 'fantasy',
  PIXEL_ART: 'pixel_art'
};

/**
 * Skin definitions with styling properties
 */
export const SKIN_DEFINITIONS = {
  [CARD_SKINS.CLASSIC]: {
    id: CARD_SKINS.CLASSIC,
    name: 'Classic Tavern',
    description: 'Traditional medieval tavern cards',
    icon: '🏛️',
    unlocked: true, // Always unlocked
    cost: 0,

    // Card styling
    cardFront: {
      background: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-2 border-amber-800',
      textColor: 'text-gray-900',
      shadow: 'shadow-lg'
    },
    cardBack: {
      background: 'bg-gradient-to-br from-amber-700 to-amber-900',
      border: 'border-2 border-amber-950',
      pattern: '🃏',
      shadow: 'shadow-lg'
    },

    // Suit symbols (medieval themed)
    suits: {
      Swords: '⚔️',
      Chalices: '🏆',
      Coins: '💰',
      Staves: '🔱'
    }
  },

  [CARD_SKINS.GOTHIC]: {
    id: CARD_SKINS.GOTHIC,
    name: 'Gothic Shadows',
    description: 'Dark and mysterious, for those who dwell in shadows',
    icon: '🦇',
    unlocked: false,
    cost: 100, // Gold cost to unlock

    cardFront: {
      background: 'bg-gradient-to-br from-purple-100 to-gray-200',
      border: 'border-2 border-purple-900',
      textColor: 'text-purple-950',
      shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]'
    },
    cardBack: {
      background: 'bg-gradient-to-br from-purple-950 to-black',
      border: 'border-2 border-purple-700',
      pattern: '🦇',
      shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]'
    },

    suits: {
      Swords: '🗡️',
      Chalices: '🍷',
      Coins: '💀',
      Staves: '🕯️'
    }
  },

  [CARD_SKINS.STEAMPUNK]: {
    id: CARD_SKINS.STEAMPUNK,
    name: 'Brass & Gears',
    description: 'Mechanical marvels from the Age of Steam',
    icon: '⚙️',
    unlocked: false,
    cost: 100,

    cardFront: {
      background: 'bg-gradient-to-br from-orange-100 to-yellow-200',
      border: 'border-2 border-orange-900',
      textColor: 'text-orange-950',
      shadow: 'shadow-[0_0_10px_rgba(234,88,12,0.3)]'
    },
    cardBack: {
      background: 'bg-gradient-to-br from-orange-800 to-amber-950',
      border: 'border-2 border-yellow-700',
      pattern: '⚙️',
      shadow: 'shadow-[0_0_10px_rgba(234,88,12,0.4)]'
    },

    suits: {
      Swords: '🔧',
      Chalices: '⚗️',
      Coins: '⚙️',
      Staves: '🔩'
    }
  },

  [CARD_SKINS.FANTASY]: {
    id: CARD_SKINS.FANTASY,
    name: 'Dragon\'s Hoard',
    description: 'Enchanted cards blessed by dragon magic',
    icon: '🐉',
    unlocked: false,
    cost: 150,

    cardFront: {
      background: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      border: 'border-2 border-indigo-900',
      textColor: 'text-indigo-950',
      shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]'
    },
    cardBack: {
      background: 'bg-gradient-to-br from-indigo-900 to-purple-950',
      border: 'border-2 border-blue-500',
      pattern: '🐉',
      shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.6)]'
    },

    suits: {
      Swords: '⚔️',
      Chalices: '🔮',
      Coins: '💎',
      Staves: '🪄'
    }
  },

  [CARD_SKINS.PIXEL_ART]: {
    id: CARD_SKINS.PIXEL_ART,
    name: 'Retro Pixels',
    description: '8-bit nostalgia from the ancient gaming taverns',
    icon: '🎮',
    unlocked: false,
    cost: 150,

    cardFront: {
      background: 'bg-gradient-to-br from-green-100 to-lime-200',
      border: 'border-4 border-green-900',
      textColor: 'text-green-950',
      shadow: 'shadow-[0_0_0_4px_rgba(22,163,74,0.3)]',
      pixelated: true // Special flag for pixel styling
    },
    cardBack: {
      background: 'bg-gradient-to-br from-green-800 to-green-950',
      border: 'border-4 border-lime-500',
      pattern: '👾',
      shadow: 'shadow-[0_0_0_4px_rgba(22,163,74,0.5)]',
      pixelated: true
    },

    suits: {
      Swords: '🗡️',
      Chalices: '🍺',
      Coins: '🪙',
      Staves: '🏹'
    }
  }
};

/**
 * Get skin definition by ID
 * @param {string} skinId - Skin identifier
 * @returns {Object} Skin definition
 */
export const getSkin = (skinId) => {
  return SKIN_DEFINITIONS[skinId] || SKIN_DEFINITIONS[CARD_SKINS.CLASSIC];
};

/**
 * Get all unlocked skins
 * @param {Object} unlockedSkins - Object mapping skin IDs to unlock status
 * @returns {Array} Array of unlocked skin definitions
 */
export const getUnlockedSkins = (unlockedSkins = {}) => {
  return Object.values(SKIN_DEFINITIONS).filter(skin =>
    skin.unlocked || unlockedSkins[skin.id]
  );
};

/**
 * Get all locked skins
 * @param {Object} unlockedSkins - Object mapping skin IDs to unlock status
 * @returns {Array} Array of locked skin definitions
 */
export const getLockedSkins = (unlockedSkins = {}) => {
  return Object.values(SKIN_DEFINITIONS).filter(skin =>
    !skin.unlocked && !unlockedSkins[skin.id]
  );
};

/**
 * Check if a skin is unlocked
 * @param {string} skinId - Skin identifier
 * @param {Object} unlockedSkins - Object mapping skin IDs to unlock status
 * @returns {boolean} True if skin is unlocked
 */
export const isSkinUnlocked = (skinId, unlockedSkins = {}) => {
  const skin = getSkin(skinId);
  return skin.unlocked || unlockedSkins[skinId] === true;
};

/**
 * Get card styling classes for a specific skin
 * @param {string} skinId - Skin identifier
 * @param {boolean} isHidden - Whether card is face-down
 * @returns {Object} Styling classes
 */
export const getCardStyling = (skinId, isHidden = false) => {
  const skin = getSkin(skinId);
  const styling = isHidden ? skin.cardBack : skin.cardFront;

  return {
    background: styling.background,
    border: styling.border,
    textColor: styling.textColor || 'text-gray-900',
    shadow: styling.shadow,
    pixelated: styling.pixelated || false,
    pattern: isHidden ? styling.pattern : null
  };
};

/**
 * Get suit symbol for a specific skin
 * @param {string} skinId - Skin identifier
 * @param {string} suit - Suit name (Swords, Chalices, Coins, Staves)
 * @returns {string} Suit emoji
 */
export const getSuitSymbol = (skinId, suit) => {
  const skin = getSkin(skinId);
  return skin.suits[suit] || suit;
};

/**
 * Default cosmetics data structure
 */
export const DEFAULT_COSMETICS = {
  activeSkin: CARD_SKINS.CLASSIC,
  unlockedSkins: {
    [CARD_SKINS.CLASSIC]: true // Classic is always unlocked
  }
};

/**
 * Load cosmetics from localStorage
 * @returns {Object} Cosmetics data
 */
export const loadCosmetics = () => {
  try {
    const saved = localStorage.getItem('tavernRummyCosmetics');
    if (saved) {
      const data = JSON.parse(saved);
      // Validate structure
      if (data && typeof data === 'object' && data.activeSkin && data.unlockedSkins) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load cosmetics:', e);
  }
  return DEFAULT_COSMETICS;
};

/**
 * Save cosmetics to localStorage
 * @param {Object} cosmetics - Cosmetics data to save
 */
export const saveCosmetics = (cosmetics) => {
  try {
    localStorage.setItem('tavernRummyCosmetics', JSON.stringify(cosmetics));
  } catch (e) {
    console.error('Failed to save cosmetics:', e);
  }
};

/**
 * Unlock a skin (if player has enough gold)
 * @param {string} skinId - Skin to unlock
 * @param {number} playerGold - Player's current gold
 * @returns {Object} Result with success status and updated gold
 */
export const unlockSkin = (skinId, playerGold) => {
  const skin = getSkin(skinId);

  if (!skin) {
    return { success: false, error: 'Invalid skin' };
  }

  if (skin.unlocked) {
    return { success: true, alreadyUnlocked: true };
  }

  if (playerGold < skin.cost) {
    return { success: false, error: 'Not enough gold', required: skin.cost };
  }

  return {
    success: true,
    newGold: playerGold - skin.cost,
    skinId: skin.id
  };
};
