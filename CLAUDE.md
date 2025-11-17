# Claude Development Guidelines for Tavern Rummy

## Project Overview

**Tavern Rummy** is a medieval-themed Gin Rummy game built with React. The codebase is architected for maintainability, scalability, and future expansion into a roguelite card game experience.

**Code Quality Score: 9/10** - Production-ready with excellent architecture

---

## 📁 Codebase Structure

### Directory Organization

```
src/
├── components/     # React components (UI, Modals, Game)
├── hooks/          # Custom React hooks
├── utils/          # Pure utility functions (no React)
├── ai/             # AI opponent strategy
└── styles/         # CSS and styling
```

### Key Principles

1. **Separation of Concerns**
   - Utils contain pure functions (no React dependencies)
   - Components handle presentation only
   - Hooks manage state and side effects
   - AI logic is isolated for easy modification

2. **File Naming Conventions**
   - Components: `PascalCase.jsx` (e.g., `PlayerHand.jsx`)
   - Hooks: `camelCase.js` with `use` prefix (e.g., `useTutorial.js`)
   - Utils: `camelCase.js` (e.g., `meldUtils.js`)
   - Constants: `camelCase.js` (e.g., `constants.js`)

3. **Import Order**
   ```javascript
   // 1. React imports
   import React, { useState, useEffect } from 'react';

   // 2. Constants
   import { GAME_CONFIG } from './utils/constants';

   // 3. Utilities
   import { createDeck } from './utils/cardUtils';

   // 4. Components
   import PlayerHand from './components/Game/PlayerHand';

   // 5. Hooks
   import { useTutorial } from './hooks/useTutorial';
   ```

---

## 🎯 Core Systems

### 1. Game Logic (Utils)

**Location**: `src/utils/`

- **`cardUtils.js`** - Card creation, shuffling, value calculations
- **`meldUtils.js`** - Meld detection algorithm (backtracking with memoization)
- **`scoringUtils.js`** - Round scoring, match winner determination
- **`statsUtils.js`** - Statistics tracking and persistence
- **`achievementsUtils.js`** - Achievement definitions and unlocking logic
- **`constants.js`** - Game configuration, difficulty settings, animation timings

**Important**: Utils must remain pure functions with no React dependencies. This ensures:
- Easy unit testing
- Reusability across different UIs
- Clear separation of business logic

### 2. Component Architecture

**Location**: `src/components/`

#### UI Components (`components/UI/`)
Reusable, presentational components:
- `PlayingCard.jsx` - Card display (used 30+ times)
- `ScoreDisplay.jsx` - Score visualization with animations
- `AnimatedCard.jsx` - Flying card animations
- `AudioControls.jsx` - Music/sound controls

#### Modal Components (`components/Modals/`)
Dialog overlays with consistent structure:
- Fixed overlay with backdrop
- Centered card-style content
- Smooth entry/exit animations
- Clear action buttons

**Modal Pattern**:
```javascript
const Modal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600">
        {/* Content */}
      </div>
    </div>
  );
};
```

#### Game Components (`components/Game/`)
Game-specific components:
- `GameBoard.jsx` - Deck and discard piles
- `PlayerHand.jsx` - Player's hand with meld highlighting
- `AIHand.jsx` - AI opponent's hand display
- `GameControls.jsx` - Knock/new round buttons
- `ErrorBoundary.jsx` - Error handling wrapper

**Best Practice**: Always use PropTypes for type safety:
```javascript
Component.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCardClick: PropTypes.func.isRequired
};
```

### 3. Custom Hooks

**Location**: `src/hooks/`

- **`useTutorial.js`** - Tutorial guidance system with smart suggestions
- **`useStats.js`** - Statistics management with LocalStorage persistence
- **`useAchievements.js`** - Achievement tracking and notifications
- **`useAudio.js`** - Audio/music management
- **`useCardAnimation.js`** - Card animation state and logic

**Hook Pattern**:
```javascript
export const useCustomHook = (dependencies) => {
  const [state, setState] = useState(initialValue);

  // Logic here

  return {
    state,
    actions
  };
};
```

### 4. AI System

**Location**: `src/ai/aiStrategy.js`

Difficulty-based AI with strategic decision making:

```javascript
export const executeAITurn = (hand, deck, discardPile, difficulty) => {
  // 1. Decide draw source (deck vs discard)
  // 2. Draw card
  // 3. Decide which card to discard
  // 4. Determine if AI should knock

  return {
    drawSource,
    drawnCard,
    discardCard,
    finalHand,
    shouldKnock
  };
};
```

**Difficulty Levels**:
- Tutorial: 5 deadwood threshold (weak)
- Easy: 5 deadwood threshold (weak)
- Medium: 7 deadwood threshold (moderate)
- Hard: 10 deadwood threshold (optimal)

**Future Enhancement Ideas**:
- Probabilistic knock decisions
- Opponent hand modeling
- Bluffing mechanics
- Minimax or Monte Carlo tree search

---

## 🎨 Styling Guidelines

### Tailwind CSS Usage

**Color Palette**:
- **Amber** (`amber-*`) - Primary UI color, tavern theme
- **Gray** (`gray-*`) - Backgrounds, neutral elements
- **Yellow** (`yellow-*`) - Player colors, highlights
- **Pink** (`pink-*`) - AI opponent colors
- **Blue** (`blue-*`) - Tutorial guidance
- **Green/Purple** (`green-*/purple-*`) - Meld highlighting

**Common Patterns**:
```javascript
// Buttons
className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg border-2 border-amber-400 transition-all"

// Cards
className="bg-white rounded-lg border-2 shadow-lg"

// Modals
className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
```

### Animation Guidelines

**Using Framer Motion**:
```javascript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
  >
    {/* Content */}
  </motion.div>
</AnimatePresence>
```

**Animation Constants**:
Always use `ANIMATION_TIMINGS` from `constants.js` instead of hardcoded values:

```javascript
import { ANIMATION_TIMINGS } from './utils/constants';

setTimeout(() => action(), ANIMATION_TIMINGS.CARD_DRAW);
```

---

## 🧪 Testing Strategy

### Current Test Coverage

**Unit Tests** (3 suites):
- ✅ `cardUtils.test.js` - Card operations
- ✅ `meldUtils.test.js` - Meld detection algorithm
- ✅ `scoringUtils.test.js` - Scoring logic

### Testing Guidelines

1. **Test Pure Functions First**
   - All utils should have comprehensive unit tests
   - Test edge cases and error conditions
   - Use descriptive test names

2. **Test Structure**:
```javascript
describe('functionName', () => {
  it('should handle normal case', () => {
    // Arrange
    const input = createTestData();

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('should handle edge case', () => {
    // Test edge case
  });
});
```

### Future Testing Improvements

1. **Component Tests** (React Testing Library)
   - Test user interactions
   - Verify state changes
   - Check accessibility

2. **Integration Tests**
   - Test complete game flows
   - Verify component interactions
   - Test state management

3. **E2E Tests** (Cypress/Playwright)
   - Full game playthrough
   - Tutorial completion
   - Achievement unlocking

---

## 📊 State Management

### Current Approach

**Main Component** (`TavernRummy.jsx`):
- Uses React `useState` for all game state
- 94 instances of React hooks
- Refs for DOM element positioning
- Local state management (no Redux/Context)

### State Categories

1. **Game State**
   ```javascript
   const [deck, setDeck] = useState([]);
   const [playerHand, setPlayerHand] = useState([]);
   const [aiHand, setAiHand] = useState([]);
   const [currentTurn, setCurrentTurn] = useState('player');
   const [phase, setPhase] = useState('draw');
   ```

2. **UI State**
   ```javascript
   const [showModal, setShowModal] = useState(false);
   const [newlyDrawnCard, setNewlyDrawnCard] = useState(null);
   const [flyingCards, setFlyingCards] = useState([]);
   ```

3. **Settings State**
   ```javascript
   const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.TUTORIAL);
   const [matchMode, setMatchMode] = useState(false);
   ```

### Performance Optimization

**Use `useMemo` for expensive calculations**:
```javascript
const playerMelds = useMemo(() => findMelds(playerHand), [playerHand]);
const playerDeadwood = useMemo(() => calculateDeadwood(playerHand), [playerHand]);
const sortedHand = useMemo(() => sortHand(playerHand, true), [playerHand]);
```

**Use `useCallback` for stable function references**:
```javascript
const addFlyingCard = useCallback((card, fromRef, toRef) => {
  // Animation logic
}, [/* dependencies */]);
```

### Future State Management

For roguelite expansion, consider:
- **React Context** for global state (progression, abilities)
- **Zustand** for simpler state management
- **Redux Toolkit** for complex state interactions

---

## 🚀 Development Workflow

### Adding New Features

1. **Plan the Feature**
   - Document in `docs/` if significant
   - Identify affected files
   - Consider backward compatibility

2. **Implement Utilities First**
   - Write pure functions in `utils/`
   - Add comprehensive unit tests
   - Document complex logic

3. **Create Components**
   - Build presentational components
   - Add PropTypes for type safety
   - Keep components focused (single responsibility)

4. **Add Custom Hooks** (if needed)
   - Extract reusable logic
   - Manage side effects
   - Provide clean API

5. **Integrate into Main Component**
   - Update `TavernRummy.jsx`
   - Wire up state and events
   - Test thoroughly

6. **Add Documentation**
   - Update README.md
   - Add code comments
   - Document configuration options

### Code Review Checklist

Before committing:
- [ ] All components have PropTypes
- [ ] No hardcoded values (use constants)
- [ ] Logic separated from presentation
- [ ] Unit tests for new utilities
- [ ] No console.logs or debug code
- [ ] Responsive design tested
- [ ] Accessibility considerations
- [ ] Performance optimized (memoization)

---

## 🎮 Game Logic Deep Dive

### Meld Detection Algorithm

**Location**: `src/utils/meldUtils.js`

The meld detection uses backtracking to find optimal meld combinations:

```javascript
export const findMelds = (hand) => {
  // 1. Group cards by rank and suit
  // 2. Find all possible sets (3+ same rank)
  // 3. Find all possible runs (3+ sequential, same suit)
  // 4. Use backtracking to find best combination
  // 5. Return melds that minimize deadwood
};
```

**Key Functions**:
- `findMelds(hand)` - Returns array of meld objects
- `calculateDeadwood(hand)` - Returns deadwood value
- `sortHand(hand, showMeldsFirst)` - Auto-sort with melds first

### Scoring System

**Location**: `src/utils/scoringUtils.js`

```javascript
export const calculateRoundResult = (knocker, playerHand, aiHand) => {
  const playerDeadwood = calculateDeadwood(playerHand);
  const aiDeadwood = calculateDeadwood(aiHand);

  // Determine winner
  // Apply bonuses (Gin: +25, Undercut: +25)
  // Calculate score difference

  return { winner, scoreDiff, reason, ... };
};
```

**Scoring Rules**:
- Regular win: Difference in deadwood
- Gin (0 deadwood): +25 gold bonus
- Undercut (opponent knocks with higher deadwood): +25 gold bonus
- Draw (deck empty): No score change

### Statistics & Achievements

**Statistics Tracked**:
- Games played/won/lost/drawn (per difficulty)
- Win streaks (current and longest)
- Gins and undercuts
- Average deadwood
- Match completions

**Achievement Types**:
- First Steps (tutorial, first win)
- Special Plays (gin, undercuts)
- Milestones (10, 50, 100 games)
- Streaks (3, 5, 10 wins)
- Difficulty Mastery
- Match Mode victories

**Persistence**: All stats saved to LocalStorage with JSON serialization

---

## 🔮 Roguelite Expansion Architecture

### Planned Systems

#### 1. Progression System
```javascript
// Future hook: useProgression.js
const useProgression = () => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [ap, setAp] = useState(0); // Ability Points

  const addXP = (amount) => {
    // XP gain and level-up logic
  };

  return { level, xp, ap, addXP, ... };
};
```

#### 2. Ability System
```javascript
// Future: src/utils/abilitiesUtils.js
export const ABILITIES = {
  REDO_TURN: { cost: 1, cooldown: 3, effect: 'Undo last turn' },
  MYSTIC_EYE: { cost: 1, cooldown: 2, effect: 'Peek at top 3 cards' },
  CARD_SWAP: { cost: 2, cooldown: 4, effect: 'Swap 1 card with deck' },
  // ... more abilities
};
```

#### 3. Campaign System
```javascript
// Future: src/utils/campaignUtils.js
export const TAVERNS = {
  THE_RUSTY_NAIL: { difficulty: 'easy', boss: 'Drunkard Pete' },
  THE_SILVER_STAG: { difficulty: 'medium', boss: 'Lady Elara' },
  THE_DRAGON_S_DEN: { difficulty: 'hard', boss: 'Scarred Veteran' },
  THE_VOID_TAVERN: { difficulty: 'nightmare', boss: 'The Dealer' },
};
```

### Integration Strategy

1. **Create `src/features/` directory**
   ```
   src/features/
   ├── progression/
   │   ├── progressionUtils.js
   │   ├── useProgression.js
   │   └── components/
   ├── abilities/
   │   ├── abilitiesUtils.js
   │   ├── useAbilities.js
   │   └── components/
   └── campaign/
       ├── campaignUtils.js
       └── components/
   ```

2. **Extend Save System**
   ```javascript
   const saveData = {
     version: '2.0',
     stats: { /* existing */ },
     progression: { level, xp, ap },
     abilities: { unlocked, upgrades },
     campaign: { currentTavern, progress },
     cosmetics: { cardSkins }
   };
   ```

3. **Maintain Backward Compatibility**
   - Version save files
   - Migrate old saves
   - Graceful fallbacks

---

## 🛡️ Best Practices

### Code Quality

1. **Always Use PropTypes**
   ```javascript
   Component.propTypes = {
     requiredProp: PropTypes.string.isRequired,
     optionalProp: PropTypes.number,
     callbackProp: PropTypes.func.isRequired
   };
   ```

2. **Avoid Magic Numbers**
   ```javascript
   // Bad
   setTimeout(() => action(), 500);

   // Good
   import { ANIMATION_TIMINGS } from './utils/constants';
   setTimeout(() => action(), ANIMATION_TIMINGS.CARD_DRAW);
   ```

3. **Document Complex Logic**
   ```javascript
   /**
    * Finds all possible melds in a hand using backtracking
    * @param {Array} hand - Array of card objects
    * @returns {Array} Array of meld objects
    */
   export const findMelds = (hand) => {
     // Implementation
   };
   ```

4. **Keep Components Small**
   - Single responsibility principle
   - Aim for <150 lines per component
   - Extract logic into hooks or utils

5. **Use Consistent Naming**
   - Boolean props: `isActive`, `hasError`, `canSubmit`
   - Event handlers: `onClick`, `onSubmit`, `onCardClick`
   - State setters: `setActiveState`, `setIsLoading`

### Performance

1. **Memoize Expensive Calculations**
   - Use `useMemo` for complex computations
   - Use `useCallback` for stable function references
   - Profile before optimizing

2. **Optimize Re-renders**
   - Use `React.memo()` for pure components
   - Split large components into smaller ones
   - Avoid inline function definitions in JSX

3. **Efficient State Updates**
   ```javascript
   // Bad: Multiple state updates
   setState1(value1);
   setState2(value2);
   setState3(value3);

   // Good: Batch state updates
   React.unstable_batchedUpdates(() => {
     setState1(value1);
     setState2(value2);
     setState3(value3);
   });
   ```

### Security

1. **Sanitize LocalStorage Data**
   ```javascript
   try {
     const data = JSON.parse(localStorage.getItem('key'));
     // Validate data structure
   } catch (e) {
     // Handle corrupt data
     return defaultValue;
   }
   ```

2. **Validate Input**
   - Check prop types
   - Validate user input
   - Handle edge cases

### Accessibility

1. **Use Semantic HTML**
   ```javascript
   <button onClick={action}>Click</button>  // Good
   <div onClick={action}>Click</div>        // Bad
   ```

2. **Add ARIA Labels**
   ```javascript
   <button aria-label="Draw card from deck" onClick={drawFromDeck}>
     Draw
   </button>
   ```

3. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Add `tabIndex` where needed
   - Handle Enter/Space key events

---

## 📝 Common Tasks

### Adding a New Modal

1. Create modal component in `src/components/Modals/`:
```javascript
import React from 'react';
import PropTypes from 'prop-types';

const NewModal = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600">
        {/* Content */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

NewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default NewModal;
```

2. Import and use in `TavernRummy.jsx`:
```javascript
import NewModal from './components/Modals/NewModal';

// Add state
const [showNewModal, setShowNewModal] = useState(false);

// Add to JSX
<NewModal
  show={showNewModal}
  onClose={() => setShowNewModal(false)}
  data={modalData}
/>
```

### Adding a New Achievement

1. Add achievement definition to `src/utils/achievementsUtils.js`:
```javascript
{
  id: 'new_achievement',
  title: 'Achievement Title',
  description: 'Description of what the achievement is',
  icon: '🏆',
  condition: (stats) => stats.someCondition >= 10
}
```

2. Achievement will automatically:
   - Check condition after each game
   - Show notification when unlocked
   - Persist to LocalStorage
   - Display in Achievements modal

### Adding a New Difficulty Level

1. Add to `src/utils/constants.js`:
```javascript
export const DIFFICULTY_LEVELS = {
  // ... existing
  NIGHTMARE: 'Nightmare'
};

export const DIFFICULTY_DESCRIPTIONS = {
  [DIFFICULTY_LEVELS.NIGHTMARE]: {
    title: "💀 The Nightmare",
    description: "Face impossible odds...",
    warning: "Only for the bravest!"
  }
};

export const AI_KNOCK_THRESHOLDS = {
  // ... existing
  [DIFFICULTY_LEVELS.NIGHTMARE]: 10
};
```

2. Update `DifficultySelector.jsx` to include new button

3. Update statistics tracking to include new difficulty

### Modifying Animation Speed

Edit `src/utils/constants.js`:
```javascript
export const ANIMATION_TIMINGS = {
  CARD_DRAW: 300,  // Changed from 500ms to 300ms (faster)
  // ... other timings
};
```

All animations using this constant will update automatically.

---

## 🐛 Debugging Tips

### Common Issues

1. **Cards Not Animating**
   - Check that refs are properly assigned
   - Verify element is mounted before animation
   - Check console for "Animation refs not ready" warnings

2. **Stats Not Saving**
   - Check LocalStorage quota
   - Verify JSON serialization
   - Check browser console for errors

3. **AI Making Invalid Moves**
   - Check `aiStrategy.js` logic
   - Verify deck/discard state
   - Log decision-making process

### Debug Tools

**React Developer Tools**:
- Install React DevTools browser extension
- Inspect component props and state
- Profile component renders

**Console Logging**:
```javascript
// Add temporary debug logs
console.log('Game State:', { playerHand, aiHand, phase, currentTurn });

// Remove before committing
```

**LocalStorage Inspector**:
```javascript
// View saved data
console.log(JSON.parse(localStorage.getItem('tavernRummyStats')));

// Clear saved data
localStorage.clear();
```

---

## 📚 Additional Resources

### Documentation Files
- `docs/code-review.md` - Architecture analysis
- `docs/roguelite-roadmap.md` - Future expansion plan
- `docs/roguelite-quick-reference.md` - Design reference
- `README.md` - User-facing documentation

### External Resources
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Gin Rummy Rules](https://en.wikipedia.org/wiki/Gin_rummy)

---

## 🤖 Working with Claude Code

### Effective Prompts

**Good Prompts**:
- "Add a new achievement for getting 5 gins in a row"
- "Refactor the meld detection algorithm to improve performance"
- "Create a new modal for displaying daily challenges"
- "Update the AI strategy to be more aggressive on Hard difficulty"

**Unclear Prompts**:
- "Make it better" (too vague)
- "Fix the bug" (which bug?)
- "Add more features" (which features?)

### Development Principles

1. **Maintain Existing Architecture**
   - Follow established patterns
   - Keep separation of concerns
   - Don't introduce breaking changes

2. **Test Changes**
   - Run unit tests: `npm test`
   - Manual testing in browser
   - Check multiple difficulty levels

3. **Document Changes**
   - Update comments
   - Update README if needed
   - Add to CHANGELOG if significant

4. **Preserve Code Quality**
   - Add PropTypes to new components
   - Use existing constants
   - Follow naming conventions
   - Keep components focused

---

## 🎯 Next Steps for Development

### Immediate Improvements
1. **Add Component Tests**
   - React Testing Library
   - Test user interactions
   - Verify state changes

2. **Enhance AI**
   - Probabilistic decisions
   - Opponent modeling
   - Strategic depth

3. **Performance Optimization**
   - Component memoization
   - Reduce re-renders
   - Optimize large lists

### Short-term Goals
1. **Begin Roguelite Expansion**
   - Implement progression system
   - Create ability framework
   - Design campaign structure

2. **Improve Accessibility**
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support

3. **Add E2E Testing**
   - Cypress or Playwright
   - Full game flows
   - Edge cases

### Long-term Vision
1. **Complete Roguelite Features**
   - Full 5-phase roadmap
   - Story integration
   - Prestige system

2. **Multiplayer Support**
   - Online play
   - Matchmaking
   - Leaderboards

3. **Mobile App**
   - PWA support
   - Native app wrapper
   - Touch optimizations

---

**Last Updated**: January 2025
**Maintained by**: Development Team
**For Questions**: See README.md or project documentation
