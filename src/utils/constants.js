// Game Configuration Constants
export const GAME_CONFIG = {
  KNOCK_THRESHOLD: 10,
  GIN_BONUS: 25,
  UNDERCUT_BONUS: 25,
  STARTING_HAND_SIZE: 10,
  MATCH_WIN_SCORE: 100,
};

// Card Suits - Medieval themed
export const SUITS = ['⚔️', '🏆', '💰', '🔱']; // Swords, Chalices, Coins, Staves

// Suit Symbols Mapping
export const SUIT_SYMBOLS = {
  '⚔️': 'Swords',
  '🏆': 'Chalices',
  '💰': 'Coins',
  '🔱': 'Staves'
};

// Card Ranks
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Meld Border Colors for visual highlighting
export const MELD_COLORS = [
  'border-green-500',
  'border-blue-500',
  'border-purple-500',
  'border-yellow-500'
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  TUTORIAL: 'Tutorial',
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',         // NEW - Challenge Mode tier 4
  MASTER: 'Master',         // NEW - Challenge Mode tier 5
  LEGENDARY: 'Legendary',   // NEW - Challenge Mode tier 6
  NIGHTMARE: 'Nightmare',   // NEW - Challenge Mode tier 7
  INFINITE: 'Infinite'      // NEW - Challenge Mode tier 8 (max)
};

// Difficulty Descriptions and Warnings
export const DIFFICULTY_DESCRIPTIONS = {
  [DIFFICULTY_LEVELS.TUTORIAL]: {
    title: "📚 The Training Grounds",
    description: "A gentle introduction for those who've never held a hand of cards. Your mentor shall guide you through the fundamentals of the game.",
    warning: "Perfect for greenhorns and novices!"
  },
  [DIFFICULTY_LEVELS.EASY]: {
    title: "😊 The Tavern Regular",
    description: "Face a jovial opponent who enjoys their ale a bit too much. They'll make mistakes and give you chances to claim victory!",
    warning: "A pleasant game amongst friends. You might actually win this one!"
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    title: "🎯 The Seasoned Gambler",
    description: "Now you face a worthy adversary who knows their way around a deck. They'll exploit your blunders and show no mercy!",
    warning: "Things are getting serious, friend. Best keep your wits about you!"
  },
  [DIFFICULTY_LEVELS.HARD]: {
    title: "🔥 The Devil's Own Hand",
    description: "Dare you challenge the master of the cards? This fiend sees through your every stratagem and plays with supernatural cunning!",
    warning: "⚠️ WARNING: You're gonna die. Probably. A lot. Consider thy life choices!"
  },
  [DIFFICULTY_LEVELS.EXPERT]: {
    title: "⚡ The Expert Duelist",
    description: "This opponent reads your every move and never gives you an advantage. They've studied the art of cards for years.",
    warning: "⚠️ Your abilities will be tested here!"
  },
  [DIFFICULTY_LEVELS.MASTER]: {
    title: "🌟 The Master Tactician",
    description: "A grandmaster who calculates probabilities in their head and times every knock perfectly. Mistakes are not forgiven.",
    warning: "⚠️ Only the prepared survive this tier!"
  },
  [DIFFICULTY_LEVELS.LEGENDARY]: {
    title: "👑 The Legendary Champion",
    description: "Few have witnessed their prowess and lived to tell the tale. They seem to know your hand before you play it.",
    warning: "⚠️ Abilities are essential for survival!"
  },
  [DIFFICULTY_LEVELS.NIGHTMARE]: {
    title: "💀 The Nightmare Incarnate",
    description: "An entity of pure strategic perfection. Some say they've made a pact with dark forces. Every decision is flawless.",
    warning: "⚠️⚠️⚠️ EXTREME DIFFICULTY - Perfect play required!"
  },
  [DIFFICULTY_LEVELS.INFINITE]: {
    title: "♾️ The Infinite",
    description: "You've reached the peak of mortal capability. There is no stronger opponent. How long can you survive?",
    warning: "⚠️⚠️⚠️ MAXIMUM DIFFICULTY - This is the end."
  }
};

// AI Knock Thresholds by Difficulty
export const AI_KNOCK_THRESHOLDS = {
  [DIFFICULTY_LEVELS.TUTORIAL]: 5,
  [DIFFICULTY_LEVELS.EASY]: 5,
  [DIFFICULTY_LEVELS.MEDIUM]: 7,
  [DIFFICULTY_LEVELS.HARD]: 10,
  [DIFFICULTY_LEVELS.EXPERT]: 10,      // NEW
  [DIFFICULTY_LEVELS.MASTER]: 10,      // NEW
  [DIFFICULTY_LEVELS.LEGENDARY]: 10,   // NEW
  [DIFFICULTY_LEVELS.NIGHTMARE]: 10,   // NEW
  [DIFFICULTY_LEVELS.INFINITE]: 10     // NEW
};

// Game Modes
export const GAME_MODES = {
  TUTORIAL: 'tutorial',
  PRACTICE: 'practice',
  CHALLENGING: 'challenging'
};

// Game Mode Descriptions (initialized after difficulty levels are defined)
export const MODE_DESCRIPTIONS = {
  tutorial: {
    title: "📚 Tutorial",
    description: "Learn the basics with step-by-step guidance",
    tips: "Forced guidance",
    stats: "Tutorial stats only"
  },
  practice: {
    title: "🎯 Practice",
    description: "Hone your skills with optional strategy tips",
    tips: "Subtle hints available",
    stats: "Counts for stats & achievements"
  },
  challenging: {
    title: "⚔️ Challenge Mode",
    description: "Endless progression mode! Win streaks unlock harder AI tiers - Earn XP, level up, and unlock powerful abilities to survive!",
    tips: "No assistance",
    stats: "Full stats + XP progression & ability unlocks + endless scaling"
  }
};

// Animation Timing Constants (in milliseconds)
export const ANIMATION_TIMINGS = {
  CARD_DRAW: 500,           // Time for card to fly from deck/discard to hand
  CARD_DISCARD: 400,        // Time for card to fly from hand to discard
  CARD_HIGHLIGHT: 800,      // Duration for newly drawn card highlight
  SCORE_ANIMATION: 2000,    // Duration for score change animation
  AI_DRAW_DELAY: 750,       // Delay before AI shows drawn card
  AI_DISCARD_DELAY: 600,    // Delay before AI discards
  AI_TURN_START: 400,       // Initial delay before AI turn begins
  KNOCK_ANNOUNCEMENT: 400,  // Delay before knock announcement
  TUTORIAL_DELAY: 1500      // Delay before showing tutorial complete modal
};

// Challenge Mode Tier Progression (Endless Mode)
export const CHALLENGE_TIERS = {
  0: { difficulty: DIFFICULTY_LEVELS.EASY, name: 'Novice', icon: '🌱' },
  5: { difficulty: DIFFICULTY_LEVELS.MEDIUM, name: 'Apprentice', icon: '⚔️' },
  10: { difficulty: DIFFICULTY_LEVELS.HARD, name: 'Veteran', icon: '🛡️' },
  15: { difficulty: DIFFICULTY_LEVELS.EXPERT, name: 'Expert', icon: '🔥' },
  20: { difficulty: DIFFICULTY_LEVELS.MASTER, name: 'Master', icon: '⭐' },
  25: { difficulty: DIFFICULTY_LEVELS.LEGENDARY, name: 'Legendary', icon: '👑' },
  30: { difficulty: DIFFICULTY_LEVELS.NIGHTMARE, name: 'Nightmare', icon: '💀' },
  35: { difficulty: DIFFICULTY_LEVELS.INFINITE, name: 'Infinite', icon: '♾️' }
};

// Tier Milestone XP Bonuses
export const TIER_MILESTONE_XP = {
  5: 50,    // Reaching Medium (Apprentice)
  10: 100,  // Reaching Hard (Veteran)
  15: 200,  // Reaching Expert
  20: 300,  // Reaching Master
  25: 500,  // Reaching Legendary
  30: 750,  // Reaching Nightmare
  35: 1000  // Reaching Infinite
};
