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
  HARD: 'Hard'
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
  }
};

// AI Knock Thresholds by Difficulty
export const AI_KNOCK_THRESHOLDS = {
  [DIFFICULTY_LEVELS.TUTORIAL]: 5,
  [DIFFICULTY_LEVELS.EASY]: 5,
  [DIFFICULTY_LEVELS.MEDIUM]: 7,
  [DIFFICULTY_LEVELS.HARD]: 10
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
