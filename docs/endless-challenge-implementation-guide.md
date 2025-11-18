# Endless Challenge Mode - Implementation Guide
## Step-by-step code examples for dynamic AI scaling

---

## 🚀 Quick Start Implementation

This guide provides concrete code examples for implementing the endless Challenge Mode design.

---

## Step 1: Add New Difficulty Levels to Constants

**File**: `src/utils/constants.js`

```javascript
// Difficulty Levels - ADD NEW ONES
export const DIFFICULTY_LEVELS = {
  TUTORIAL: 'Tutorial',
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',         // NEW
  MASTER: 'Master',         // NEW
  LEGENDARY: 'Legendary',   // NEW
  NIGHTMARE: 'Nightmare',   // NEW
  INFINITE: 'Infinite'      // NEW
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

// NEW: Challenge Mode Tier Progression
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

// NEW: Tier Milestone XP Bonuses
export const TIER_MILESTONE_XP = {
  5: 50,    // Reaching Medium
  10: 100,  // Reaching Hard
  15: 200,  // Reaching Expert
  20: 300,  // Reaching Master
  25: 500,  // Reaching Legendary
  30: 750,  // Reaching Nightmare
  35: 1000  // Reaching Infinite
};

// NEW: Difficulty Descriptions (add to existing object)
export const DIFFICULTY_DESCRIPTIONS = {
  // ... existing entries ...
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
```

---

## Step 2: Create Difficulty Scaling Utility

**File**: `src/utils/challengeUtils.js` (NEW FILE)

```javascript
import { DIFFICULTY_LEVELS, CHALLENGE_TIERS, TIER_MILESTONE_XP } from './constants';

/**
 * Get the AI difficulty level based on current Challenge Mode win streak
 * @param {number} winStreak - Current win streak in Challenge Mode
 * @returns {string} Difficulty level
 */
export const getDifficultyForWinStreak = (winStreak) => {
  // Find the highest tier threshold the player has reached
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const threshold of tierThresholds) {
    if (winStreak >= threshold) {
      return CHALLENGE_TIERS[threshold].difficulty;
    }
  }

  // Default to Easy if below all thresholds
  return DIFFICULTY_LEVELS.EASY;
};

/**
 * Get the current tier information for a win streak
 * @param {number} winStreak - Current win streak
 * @returns {Object} Tier info {difficulty, name, icon, threshold}
 */
export const getCurrentTier = (winStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of tierThresholds) {
    if (winStreak >= threshold) {
      return {
        ...CHALLENGE_TIERS[threshold],
        threshold
      };
    }
  }

  return {
    ...CHALLENGE_TIERS[0],
    threshold: 0
  };
};

/**
 * Get the next tier information
 * @param {number} winStreak - Current win streak
 * @returns {Object|null} Next tier info or null if at max
 */
export const getNextTier = (winStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS)
    .map(Number)
    .sort((a, b) => a - b); // Sort ascending

  for (const threshold of tierThresholds) {
    if (winStreak < threshold) {
      return {
        ...CHALLENGE_TIERS[threshold],
        threshold,
        winsRequired: threshold - winStreak
      };
    }
  }

  return null; // At maximum tier
};

/**
 * Check if the player just reached a new tier milestone
 * @param {number} previousWinStreak - Win streak before this win
 * @param {number} currentWinStreak - Win streak after this win
 * @returns {Object|null} Milestone info or null if no milestone
 */
export const checkTierMilestone = (previousWinStreak, currentWinStreak) => {
  const tierThresholds = Object.keys(CHALLENGE_TIERS).map(Number);

  for (const threshold of tierThresholds) {
    if (previousWinStreak < threshold && currentWinStreak >= threshold) {
      return {
        threshold,
        tier: CHALLENGE_TIERS[threshold],
        xpBonus: TIER_MILESTONE_XP[threshold] || 0
      };
    }
  }

  return null;
};

/**
 * Calculate total XP bonuses earned from tier milestones in a run
 * @param {number} winStreak - Final win streak of the run
 * @returns {number} Total milestone XP earned
 */
export const calculateMilestoneXP = (winStreak) => {
  let totalXP = 0;

  Object.keys(TIER_MILESTONE_XP).forEach(threshold => {
    if (winStreak >= Number(threshold)) {
      totalXP += TIER_MILESTONE_XP[threshold];
    }
  });

  return totalXP;
};

/**
 * Get a descriptive message for reaching a tier
 * @param {number} threshold - Tier threshold reached
 * @returns {string} Message to display
 */
export const getTierReachedMessage = (threshold) => {
  const messages = {
    5: "The challenger grows stronger... Brace yourself!",
    10: "You face a true master now. May fortune smile upon you.",
    15: "Few have reached this height. The path narrows from here.",
    20: "The cards themselves fear you! But your opponent does not.",
    25: "You stand among legends! Prove you belong here.",
    30: "You have entered the nightmare... There is no mercy here.",
    35: "You have transcended mortal limits! How far can you go?"
  };

  return messages[threshold] || "A new challenge awaits...";
};

/**
 * Format win streak progress for display
 * @param {number} winStreak - Current win streak
 * @returns {Object} Display info {current, next, progress, percentage}
 */
export const getProgressDisplay = (winStreak) => {
  const currentTier = getCurrentTier(winStreak);
  const nextTier = getNextTier(winStreak);

  if (!nextTier) {
    // At maximum tier
    return {
      current: currentTier,
      next: null,
      progress: winStreak - currentTier.threshold,
      percentage: 100,
      isMaxTier: true
    };
  }

  const tierRange = nextTier.threshold - currentTier.threshold;
  const currentProgress = winStreak - currentTier.threshold;
  const percentage = Math.floor((currentProgress / tierRange) * 100);

  return {
    current: currentTier,
    next: nextTier,
    progress: currentProgress,
    total: tierRange,
    percentage,
    isMaxTier: false
  };
};
```

---

## Step 3: Update Stats Utilities

**File**: `src/utils/statsUtils.js`

Add to the stats initialization:

```javascript
// ADD to getInitialStats() function
export const getInitialStats = () => ({
  // ... existing stats ...

  // NEW: Challenge Mode specific stats
  challengeMode: {
    currentWinStreak: 0,
    longestWinStreak: 0,
    totalChallengeWins: 0,
    totalChallengeLosses: 0,
    currentTier: 'Easy',
    highestTierReached: 'Easy',
    tierReached: {
      [DIFFICULTY_LEVELS.EASY]: 0,
      [DIFFICULTY_LEVELS.MEDIUM]: 0,
      [DIFFICULTY_LEVELS.HARD]: 0,
      [DIFFICULTY_LEVELS.EXPERT]: 0,
      [DIFFICULTY_LEVELS.MASTER]: 0,
      [DIFFICULTY_LEVELS.LEGENDARY]: 0,
      [DIFFICULTY_LEVELS.NIGHTMARE]: 0,
      [DIFFICULTY_LEVELS.INFINITE]: 0
    },
    winsPerTier: {
      [DIFFICULTY_LEVELS.EASY]: 0,
      [DIFFICULTY_LEVELS.MEDIUM]: 0,
      [DIFFICULTY_LEVELS.HARD]: 0,
      [DIFFICULTY_LEVELS.EXPERT]: 0,
      [DIFFICULTY_LEVELS.MASTER]: 0,
      [DIFFICULTY_LEVELS.LEGENDARY]: 0,
      [DIFFICULTY_LEVELS.NIGHTMARE]: 0,
      [DIFFICULTY_LEVELS.INFINITE]: 0
    },
    totalMilestoneXP: 0
  }
});

// NEW: Update Challenge Mode stats after a win
export const updateChallengeWin = (stats, currentDifficulty) => {
  const newStats = { ...stats };

  // Increment win streak
  newStats.challengeMode.currentWinStreak += 1;
  newStats.challengeMode.totalChallengeWins += 1;

  // Update longest streak
  if (newStats.challengeMode.currentWinStreak > newStats.challengeMode.longestWinStreak) {
    newStats.challengeMode.longestWinStreak = newStats.challengeMode.currentWinStreak;
  }

  // Update tier stats
  newStats.challengeMode.currentTier = currentDifficulty;
  newStats.challengeMode.winsPerTier[currentDifficulty] += 1;

  // Track tier reached
  const tierLevels = [
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD,
    DIFFICULTY_LEVELS.EXPERT,
    DIFFICULTY_LEVELS.MASTER,
    DIFFICULTY_LEVELS.LEGENDARY,
    DIFFICULTY_LEVELS.NIGHTMARE,
    DIFFICULTY_LEVELS.INFINITE
  ];

  const currentTierIndex = tierLevels.indexOf(currentDifficulty);
  const highestTierIndex = tierLevels.indexOf(newStats.challengeMode.highestTierReached);

  if (currentTierIndex > highestTierIndex) {
    newStats.challengeMode.highestTierReached = currentDifficulty;
  }

  return newStats;
};

// NEW: Update Challenge Mode stats after a loss
export const updateChallengeLoss = (stats) => {
  const newStats = { ...stats };

  // Reset win streak
  newStats.challengeMode.currentWinStreak = 0;
  newStats.challengeMode.currentTier = DIFFICULTY_LEVELS.EASY;
  newStats.challengeMode.totalChallengeLosses += 1;

  return newStats;
};

// NEW: Add milestone XP to stats
export const addMilestoneXP = (stats, xpAmount) => {
  const newStats = { ...stats };
  newStats.challengeMode.totalMilestoneXP += xpAmount;
  return newStats;
};
```

---

## Step 4: Update Main Game Component

**File**: `src/TavernRummy.jsx`

```javascript
// ADD NEW IMPORTS
import {
  getDifficultyForWinStreak,
  getCurrentTier,
  checkTierMilestone,
  getTierReachedMessage
} from './utils/challengeUtils';
import { updateChallengeWin, updateChallengeLoss, addMilestoneXP } from './utils/statsUtils';

// INSIDE TavernRummy component:

// ADD: Track if we just reached a tier milestone
const [tierMilestone, setTierMilestone] = useState(null);

// MODIFY: Get difficulty based on win streak for Challenge Mode
const getEffectiveDifficulty = () => {
  if (gameMode === GAME_MODES.CHALLENGING) {
    return getDifficultyForWinStreak(stats.challengeMode.currentWinStreak);
  }
  return difficulty; // Use selected difficulty for other modes
};

// MODIFY: handleRoundEnd function
const handleRoundEnd = (result) => {
  // ... existing code ...

  if (result.winner === 'player') {
    // ... existing score updates ...

    if (gameMode === GAME_MODES.CHALLENGING) {
      const previousStreak = stats.challengeMode.currentWinStreak;

      // Update Challenge stats
      let newStats = updateChallengeWin(stats, getEffectiveDifficulty());

      // Check for tier milestone
      const milestone = checkTierMilestone(previousStreak, newStats.challengeMode.currentWinStreak);

      if (milestone) {
        // Award milestone XP
        newStats = addMilestoneXP(newStats, milestone.xpBonus);
        addXP(milestone.xpBonus); // Also update progression XP

        // Show tier milestone notification
        setTierMilestone({
          tier: milestone.tier,
          xpBonus: milestone.xpBonus,
          message: getTierReachedMessage(milestone.threshold)
        });
      }

      setStats(newStats);
    }
  } else if (result.winner === 'ai') {
    // ... existing score updates ...

    if (gameMode === GAME_MODES.CHALLENGING) {
      // Reset win streak on loss
      const newStats = updateChallengeLoss(stats);
      setStats(newStats);
    }
  }

  // ... rest of function ...
};

// MODIFY: executeAITurn to use effective difficulty
const executeAITurn = () => {
  const effectiveDifficulty = getEffectiveDifficulty();

  const decision = aiExecuteAITurn(
    aiHand,
    deck,
    discardPile,
    effectiveDifficulty  // Use dynamic difficulty for Challenge Mode
  );

  // ... rest of AI turn logic ...
};
```

---

## Step 5: Create Tier Display Component

**File**: `src/components/UI/ChallengeTierDisplay.jsx` (NEW FILE)

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { getProgressDisplay } from '../../utils/challengeUtils';

const ChallengeTierDisplay = ({ winStreak, compact = false }) => {
  const progress = getProgressDisplay(winStreak);

  if (compact) {
    // Compact version for in-game display
    return (
      <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-3 rounded-lg border-2 border-purple-500 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{progress.current.icon}</span>
            <div>
              <div className="text-purple-200 text-xs">Challenge Tier</div>
              <div className="text-white font-bold">{progress.current.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-200 text-xs">Win Streak</div>
            <div className="text-yellow-400 font-bold text-xl">{winStreak}</div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for modals/screens
  return (
    <div className="bg-gradient-to-br from-purple-900 to-gray-900 p-6 rounded-lg border-4 border-purple-500 shadow-2xl">
      <div className="text-center mb-4">
        <div className="text-6xl mb-2">{progress.current.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-1">
          {progress.current.name}
        </h2>
        <p className="text-purple-300">
          {progress.current.difficulty}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-200 mb-1">
          <span>Win Streak: {winStreak}</span>
          {!progress.isMaxTier && (
            <span>Next Tier: {progress.next.winsRequired} wins</span>
          )}
        </div>

        {!progress.isMaxTier ? (
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        ) : (
          <div className="text-center text-yellow-400 font-bold animate-pulse">
            ♾️ MAXIMUM TIER REACHED ♾️
          </div>
        )}
      </div>

      {!progress.isMaxTier && (
        <div className="text-center text-sm text-purple-300">
          Next: {progress.next.icon} {progress.next.name} ({progress.next.threshold} wins)
        </div>
      )}
    </div>
  );
};

ChallengeTierDisplay.propTypes = {
  winStreak: PropTypes.number.isRequired,
  compact: PropTypes.bool
};

export default ChallengeTierDisplay;
```

---

## Step 6: Create Tier Milestone Modal

**File**: `src/components/Modals/TierMilestoneModal.jsx` (NEW FILE)

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const TierMilestoneModal = ({ show, milestone, onClose }) => {
  if (!show || !milestone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl max-w-md"
        >
          {/* Animated icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center text-8xl mb-4"
          >
            {milestone.tier.icon}
          </motion.div>

          {/* Tier reached message */}
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-400">
            🎊 TIER UP! 🎊
          </h2>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-white mb-2">
              {milestone.tier.name}
            </p>
            <p className="text-lg text-purple-200 mb-4">
              {milestone.tier.difficulty}
            </p>
            <p className="text-purple-300 italic">
              "{milestone.message}"
            </p>
          </div>

          {/* XP Bonus */}
          {milestone.xpBonus > 0 && (
            <div className="bg-yellow-600 bg-opacity-20 border-2 border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-center text-yellow-300 font-bold">
                Milestone Bonus: +{milestone.xpBonus} XP
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-3 mb-6">
            <p className="text-center text-red-200 text-sm">
              ⚠️ The AI grows stronger...
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg border-2 border-yellow-400 font-bold text-gray-900 transition-all transform hover:scale-105"
          >
            Continue Challenge
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

TierMilestoneModal.propTypes = {
  show: PropTypes.bool.isRequired,
  milestone: PropTypes.shape({
    tier: PropTypes.shape({
      name: PropTypes.string.isRequired,
      difficulty: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    }),
    xpBonus: PropTypes.number,
    message: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default TierMilestoneModal;
```

---

## Step 7: Update Loss Modal for Challenge Mode

**File**: `src/components/Modals/MatchWinnerModal.jsx` (or create dedicated loss modal)

Add display for Challenge run summary when player loses:

```javascript
// INSIDE the modal, add this section for Challenge Mode losses:

{gameMode === GAME_MODES.CHALLENGING && result.winner === 'ai' && (
  <div className="mt-6 bg-purple-900 bg-opacity-50 border-2 border-purple-500 rounded-lg p-4">
    <h3 className="text-xl font-bold text-purple-200 mb-3 text-center">
      Challenge Run Ended
    </h3>

    <div className="space-y-2 text-purple-200">
      <div className="flex justify-between">
        <span>Final Win Streak:</span>
        <span className="font-bold text-yellow-400">{stats.challengeMode.currentWinStreak}</span>
      </div>

      <div className="flex justify-between">
        <span>Highest Tier:</span>
        <span className="font-bold">{getCurrentTier(stats.challengeMode.currentWinStreak).name}</span>
      </div>

      <div className="flex justify-between">
        <span>Total XP Earned:</span>
        <span className="font-bold text-green-400">
          +{calculateMilestoneXP(stats.challengeMode.currentWinStreak)} XP
        </span>
      </div>
    </div>

    {stats.challengeMode.currentWinStreak >= 10 && (
      <div className="mt-4 text-center text-purple-300 italic">
        "A valiant effort! Try again to reach even greater heights."
      </div>
    )}
  </div>
)}
```

---

## Step 8: Update Achievements

**File**: `src/utils/achievementsUtils.js`

Add new Challenge Mode achievements:

```javascript
// ADD to ACHIEVEMENTS array:

// Challenge Mode Win Streaks
{
  id: 'challenge_streak_5',
  title: 'Warming Up',
  description: 'Reach a 5 win streak in Challenge Mode',
  icon: '🔥',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 5
},
{
  id: 'challenge_streak_10',
  title: 'On Fire',
  description: 'Reach a 10 win streak in Challenge Mode',
  icon: '🔥🔥',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 10
},
{
  id: 'challenge_streak_15',
  title: 'Unstoppable',
  description: 'Reach a 15 win streak in Challenge Mode',
  icon: '⚡',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 15
},
{
  id: 'challenge_streak_20',
  title: 'Legendary Run',
  description: 'Reach a 20 win streak in Challenge Mode',
  icon: '👑',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 20
},
{
  id: 'challenge_streak_25',
  title: 'Nightmare Fuel',
  description: 'Reach a 25 win streak in Challenge Mode',
  icon: '💀',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 25
},
{
  id: 'challenge_streak_30',
  title: 'Infinite Power',
  description: 'Reach a 30 win streak in Challenge Mode',
  icon: '♾️',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 30
},
{
  id: 'challenge_streak_35',
  title: 'Transcendent',
  description: 'Reach a 35 win streak in Challenge Mode',
  icon: '✨',
  condition: (stats) => stats.challengeMode?.longestWinStreak >= 35
},

// Tier Reached Achievements
{
  id: 'reach_expert',
  title: 'Expert Challenger',
  description: 'Reach Expert tier in Challenge Mode',
  icon: '⚡',
  condition: (stats) => {
    const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
    const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
    return highestIndex >= 3;
  }
},
{
  id: 'reach_master',
  title: 'Master Challenger',
  description: 'Reach Master tier in Challenge Mode',
  icon: '⭐',
  condition: (stats) => {
    const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'];
    const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
    return highestIndex >= 4;
  }
},
{
  id: 'reach_legendary',
  title: 'Legendary Challenger',
  description: 'Reach Legendary tier in Challenge Mode',
  icon: '👑',
  condition: (stats) => {
    const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Legendary'];
    const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
    return highestIndex >= 5;
  }
},
{
  id: 'reach_nightmare',
  title: 'Nightmare Conqueror',
  description: 'Reach Nightmare tier in Challenge Mode',
  icon: '💀',
  condition: (stats) => {
    const tierLevels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Legendary', 'Nightmare'];
    const highestIndex = tierLevels.indexOf(stats.challengeMode?.highestTierReached);
    return highestIndex >= 6;
  }
},
{
  id: 'reach_infinite',
  title: 'The Infinite',
  description: 'Reach Infinite tier in Challenge Mode',
  icon: '♾️',
  condition: (stats) => stats.challengeMode?.highestTierReached === 'Infinite'
}
```

---

## Summary Checklist

- [x] Step 1: Add new difficulty levels to `constants.js`
- [x] Step 2: Create `challengeUtils.js` with scaling logic
- [x] Step 3: Update `statsUtils.js` with Challenge tracking
- [x] Step 4: Modify `TavernRummy.jsx` for dynamic difficulty
- [x] Step 5: Create `ChallengeTierDisplay.jsx` component
- [x] Step 6: Create `TierMilestoneModal.jsx` component
- [x] Step 7: Update loss/win modals with Challenge summary
- [x] Step 8: Add Challenge Mode achievements

## Next Steps (Advanced AI - Phase 2)

After implementing the foundation above, proceed to enhance AI for new difficulty levels:

1. **Expert AI**: Implement smart discard (avoid giving player useful cards)
2. **Master AI**: Add probabilistic knock timing
3. **Legendary AI**: Implement basic opponent hand modeling
4. **Nightmare AI**: Perfect play with full opponent modeling

See `docs/endless-challenge-mode-design.md` for detailed AI enhancement specifications.

---

**Last Updated**: January 2025
**Implementation Status**: Ready to Code
