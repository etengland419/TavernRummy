// Opponent Name Pools by Difficulty Level

// Tutorial - Friendly, helpful mentor types
const TUTORIAL_NAMES = [
  "Good-hearted Gareth",
  "Kindly Edmund",
  "Gentle Geoffrey",
  "Patient Thomas",
  "Friendly William",
  "Helpful Henry",
  "Cheerful Charles",
  "Benevolent Bernard",
  "Kindhearted Kenneth",
  "Gracious Gregory"
];

// Easy - Regular tavern folk, common names
const EASY_NAMES = [
  "Barkeep Bob",
  "Regular Reginald",
  "Tipsy Tom",
  "Merry Martin",
  "Jovial Jack",
  "Drunk Dennis",
  "Farmer Frank",
  "Miller Mike",
  "Simple Simon",
  "Merchant Marcus",
  "Stable-hand Steven",
  "Traveler Timothy"
];

// Medium - Rougher characters, thugs and outlaws
const MEDIUM_NAMES = [
  "Scarface Samuel",
  "One-Eyed Otto",
  "Knuckles Ned",
  "The Bruiser",
  "Cutthroat Cyril",
  "Blackjack Barry",
  "Sly Vincent",
  "The Enforcer",
  "Dagger Dan",
  "Ruthless Roland",
  "Shady Shane",
  "The Shadow"
];

// Hard - Evil knights, dark warriors, intimidating titles
const HARD_NAMES = [
  "Sir Malevolus the Cruel",
  "The Dark Knight",
  "Lord Blackheart",
  "Sir Grimwald the Merciless",
  "The Crimson Reaper",
  "Baron Von Shadowmere",
  "Sir Dreadmoor",
  "The Infernal Duke",
  "Lord Vex the Corrupted",
  "Sir Mordath the Damned",
  "The Blackened Paladin",
  "Count Nightshade"
];

const NAME_POOLS = {
  'Tutorial': TUTORIAL_NAMES,
  'Easy': EASY_NAMES,
  'Medium': MEDIUM_NAMES,
  'Hard': HARD_NAMES
};

/**
 * Gets a random opponent name based on difficulty level
 * @param {string} difficulty - The difficulty level
 * @returns {string} A random opponent name
 */
export const getRandomOpponentName = (difficulty) => {
  const pool = NAME_POOLS[difficulty] || EASY_NAMES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

/**
 * Gets all available opponent names for a difficulty
 * @param {string} difficulty - The difficulty level
 * @returns {Array<string>} Array of all possible names
 */
export const getAllOpponentNames = (difficulty) => {
  return NAME_POOLS[difficulty] || EASY_NAMES;
};
