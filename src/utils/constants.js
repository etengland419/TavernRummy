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

// AI Knock Thresholds by Difficulty
export const AI_KNOCK_THRESHOLDS = {
  [DIFFICULTY_LEVELS.TUTORIAL]: 5,
  [DIFFICULTY_LEVELS.EASY]: 5,
  [DIFFICULTY_LEVELS.MEDIUM]: 7,
  [DIFFICULTY_LEVELS.HARD]: 10
};
