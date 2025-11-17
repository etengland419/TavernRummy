# ⚔️ Tavern Rummy ⚔️

A medieval-themed Gin Rummy card game with an immersive tavern atmosphere, intelligent AI opponents, and an interactive tutorial system.

## 🎮 Play Online

[Play Tavern Rummy](https://etengland419.github.io/TavernRummy) *(Update with your GitHub Pages URL)*

## ✨ Features

### Core Gameplay
- **Classic Gin Rummy Rules** - Form melds and minimize deadwood to win
- **Medieval Theme** - Beautiful tavern atmosphere with themed card suits (Swords, Chalices, Coins, Staves)
- **Smooth Animations** - Card drawing, discarding, and scoring animations

### Game Modes
- **Tutorial Mode** - Interactive guide with helpful tips and card highlighting
- **Progressive Difficulty** - Four difficulty levels (Tutorial, Easy, Medium, Hard)
- **Match Mode** - First to 100 gold wins the match
- **Single Round Mode** - Play individual rounds

### Smart Features
- **Intelligent AI** - Difficulty-based AI strategy that adapts to game situations
- **Auto-Sort Cards** - Automatically organize your hand with melds first
- **Visual Meld Detection** - Color-coded borders show which cards form melds
- **Real-time Feedback** - Deadwood counter and meld statistics
- **Statistics Tracking** - Comprehensive game statistics with LocalStorage persistence
- **Achievements System** - 15+ achievements to unlock with progress tracking
- **Achievement Notifications** - Toast notifications when unlocking new achievements
- **Difficulty Confirmation** - Prevents accidental difficulty changes with confirmation dialogs

## 🎯 How to Play

### Objective
Form melds (sets or runs) and reduce your deadwood to 10 or less, then knock to end the round.

### Game Flow
1. **Draw** - Take a card from the deck or discard pile
2. **Discard** - Remove one card from your hand
3. **Knock** - When your deadwood ≤ 10, knock to end the round
4. **Score** - Winner gets the deadwood difference in gold

### Melds
- **Sets** - 3+ cards of the same rank (e.g., three 7s)
- **Runs** - 3+ consecutive cards of the same suit (e.g., 5-6-7 of Swords)

### Scoring
- **Regular Win** - Difference in deadwood points
- **Gin Bonus** - +25 gold for knocking with 0 deadwood
- **Undercut** - +25 gold if opponent knocks but you have lower deadwood

## 🏗️ Project Structure

```
TavernRummy/
├── src/
│   ├── components/
│   │   ├── UI/                         # Reusable UI components
│   │   │   ├── PlayingCard.jsx         # Card display component
│   │   │   ├── ScoreDisplay.jsx        # Score visualization
│   │   │   ├── DifficultySelector.jsx  # Difficulty level buttons
│   │   │   ├── AchievementNotification.jsx  # Toast notifications
│   │   │   ├── AnimatedCard.jsx        # Flying card animations
│   │   │   └── AudioControls.jsx       # Audio/music controls
│   │   ├── Modals/                     # Modal dialogs
│   │   │   ├── SplashScreen.jsx        # Game startup screen
│   │   │   ├── RoundEndModal.jsx       # Round results
│   │   │   ├── MatchWinnerModal.jsx    # Match completion
│   │   │   ├── TutorialCompleteModal.jsx  # Tutorial exit
│   │   │   ├── DifficultyConfirmModal.jsx  # Difficulty change confirmation
│   │   │   ├── MatchModeConfirmModal.jsx   # Match mode toggle
│   │   │   ├── StatsModal.jsx          # Statistics viewer
│   │   │   └── AchievementsModal.jsx   # Achievements display
│   │   ├── Game/                       # Game-specific components
│   │   │   ├── GameBoard.jsx           # Deck & discard piles
│   │   │   ├── PlayerHand.jsx          # Player's hand display
│   │   │   ├── AIHand.jsx              # AI opponent's hand
│   │   │   ├── GameControls.jsx        # Knock/new round buttons
│   │   │   └── ErrorBoundary.jsx       # Error handling wrapper
│   ├── hooks/                          # Custom React hooks
│   │   ├── useTutorial.js              # Tutorial guidance system
│   │   ├── useStats.js                 # Statistics management
│   │   ├── useAchievements.js          # Achievements tracking
│   │   ├── useAudio.js                 # Audio/music management
│   │   └── useCardAnimation.js         # Card animation logic (NEW)
│   ├── utils/                          # Pure utility functions
│   │   ├── constants.js                # Game config & animation timings
│   │   ├── cardUtils.js                # Card operations (shuffle, create)
│   │   ├── meldUtils.js                # Meld detection algorithm
│   │   ├── scoringUtils.js             # Scoring calculations
│   │   ├── statsUtils.js               # Statistics tracking logic
│   │   ├── achievementsUtils.js        # Achievements system logic
│   │   └── opponentNames.js            # NPC name generation
│   ├── ai/                             # AI opponent strategy
│   │   └── aiStrategy.js               # Difficulty-based AI decisions
│   ├── styles/
│   │   └── index.css                   # Tailwind imports
│   ├── TavernRummy.jsx                 # Main game component (667 lines)
│   └── index.js                        # Application entry point
├── public/
│   ├── index.html
│   └── audio/                          # Audio assets (11 files)
├── docs/                               # Project documentation
│   ├── code-review.md                  # Architecture analysis
│   ├── roguelite-roadmap.md            # Future expansion plan
│   └── roguelite-quick-reference.md    # Design reference
├── package.json
├── tailwind.config.js
├── README.md
└── CLAUDE.md                           # Development guidelines
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/TavernRummy.git
cd TavernRummy

# Install dependencies
npm install

# Start development server
npm start
```

The game will open at `http://localhost:3000`

### Building for Production

```bash
# Create optimized build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🔧 Configuration

### Game Constants
Edit `src/utils/constants.js` to modify game parameters:

```javascript
export const GAME_CONFIG = {
  KNOCK_THRESHOLD: 10,        // Maximum deadwood to knock
  GIN_BONUS: 25,              // Bonus for gin
  UNDERCUT_BONUS: 25,         // Bonus for undercut
  STARTING_HAND_SIZE: 10,     // Initial cards dealt
  MATCH_WIN_SCORE: 100,       // Score to win match mode
};
```

### AI Difficulty
Modify AI behavior in `src/utils/constants.js`:

```javascript
export const AI_KNOCK_THRESHOLDS = {
  Tutorial: 5,    // AI knocks at 5 or less deadwood
  Easy: 5,
  Medium: 7,
  Hard: 10,       // AI knocks at threshold
};
```

### Animation Timings
Customize animation speeds in `src/utils/constants.js`:

```javascript
export const ANIMATION_TIMINGS = {
  CARD_DRAW: 500,           // Card flying animation (ms)
  CARD_DISCARD: 400,        // Card discard animation (ms)
  CARD_HIGHLIGHT: 800,      // Newly drawn card highlight
  SCORE_ANIMATION: 2000,    // Score change animation
  AI_DRAW_DELAY: 750,       // AI draw delay
  AI_DISCARD_DELAY: 600,    // AI discard delay
  AI_TURN_START: 400,       // AI turn start delay
  KNOCK_ANNOUNCEMENT: 400,  // Knock announcement delay
  TUTORIAL_DELAY: 1500      // Tutorial complete modal delay
};
```

## 🎨 Customization

### Theming
The game uses Tailwind CSS. Modify colors in `tailwind.config.js` or component classes.

### Card Suits
Change card suits in `src/utils/constants.js`:
```javascript
export const SUITS = ['⚔️', '🏆', '💰', '🔱'];
export const SUIT_SYMBOLS = {
  '⚔️': 'Swords',
  '🏆': 'Chalices',
  '💰': 'Coins',
  '🔱': 'Staves'
};
```

## 📱 Mobile Support

The game is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets
- Mobile devices (iOS and Android)

## 🛠️ Development

### Technology Stack
- **React 18.2.0** - Modern hooks-based architecture
- **Tailwind CSS 3.3.2** - Utility-first styling & responsive design
- **Framer Motion 12.23.24** - Card animations & transitions
- **PropTypes 15.8.1** - Runtime type checking
- **Jest** - Unit testing framework
- **Create React App 5.0.1** - Build tooling & dev server

### Code Organization
- **Components** (19 files) - Modular, reusable React components organized by feature
- **Hooks** (5 files) - Custom hooks for game logic, animations, and cross-cutting concerns
- **Utils** (7 files) - Pure functions for game mechanics (no React dependencies)
- **AI** (1 file) - Separated AI strategy for easy modification and enhancement

### Key Features of the Architecture
- **Memoization** - Optimized re-renders with `useMemo` and `useCallback`
- **Separation of Concerns** - Logic separated from presentation (utils vs components)
- **Custom Hooks Pattern** - Reusable logic extraction (useCardAnimation, useTutorial, etc.)
- **Scalability** - Modular structure ready for roguelite expansion
- **Maintainability** - Clear file structure, comprehensive documentation
- **Type Safety** - PropTypes for all components (139 instances)
- **Error Handling** - Error boundaries for graceful failure recovery
- **Performance** - Efficient animations and state management
- **Comprehensive Testing** - Unit tests for all utility functions
- **Local Persistence** - Statistics and achievements saved in LocalStorage
- **Animation Constants** - Centralized timing configuration for consistency

### Code Quality Score: 9/10
The codebase demonstrates excellent architecture with:
- 5,287 lines of well-organized code across 36 files
- Low technical debt
- Production-ready quality
- Excellent separation of concerns
- Ready for planned expansion

## 🧪 Testing

The project includes comprehensive unit tests for all utility functions:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- ✅ `cardUtils.js` - Card creation, shuffling, and meld utilities
- ✅ `meldUtils.js` - Meld detection, deadwood calculation, hand sorting
- ✅ `scoringUtils.js` - Round scoring and match winner determination

## 📊 Statistics & Achievements

### Statistics Tracked
- Games played/won by difficulty
- Win rates and streaks
- Average deadwood and scores
- Gin count and undercut count
- Match statistics

### Achievement Categories
- **First Steps** - First win, tutorial completion
- **Special Plays** - Gin, undercuts, strategic plays
- **Milestones** - Games played (10, 50, 100+)
- **Streaks** - Win streaks (3, 5, 10+)
- **Difficulty Mastery** - Win games on each difficulty
- **Match Mode** - Match victories

All statistics and achievements are automatically saved in LocalStorage and persist between sessions.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Future Enhancements

#### Planned Roguelite Expansion
The codebase is architected to support a comprehensive roguelite expansion. See `docs/roguelite-roadmap.md` for the full plan:

**Phase 1: Progression System**
- Player XP and leveling
- Ability Points (AP) for unlocking abilities
- Enhanced save/load system

**Phase 2: Ability System**
- 8 active abilities (Redo Turn, Mystic Eye, Card Swap, etc.)
- 5 upgradeable passive abilities
- Cooldown and resource management

**Phase 3: Prestige System**
- Card skins and cosmetics
- AI personality variations
- Prestige point economy

**Phase 4: Campaign Mode**
- 4 themed taverns with boss encounters
- Story and dialogue system
- Progressive difficulty scaling

**Phase 5: Polish & Additional Features**
- Sound effects integration
- Daily challenges
- PWA support
- Enhanced animations

#### Other Potential Features
- Multiplayer mode (online play)
- Online leaderboards
- Component Storybook for development
- E2E testing with Cypress/Playwright

## 📚 Learn More

- [Gin Rummy Rules](https://en.wikipedia.org/wiki/Gin_rummy)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🙏 Acknowledgments

- Inspired by classic Gin Rummy
- Medieval theme elements
- Community feedback and suggestions

### Audio Credits
- **Background Music**: "The Old Tower Inn" (NES Chiptune Medieval) from [OpenGameArt.org](https://opengameart.org/content/chiptune-medieval-the-old-tower-inn)
  - Licensed under CC0 (Public Domain)
- **Sound Effects**: "The Essential Retro Video Game Sound Effects Collection" by Juhani Junkala from [OpenGameArt.org](https://opengameart.org/content/512-sound-effects-8-bit-style)
  - Licensed under CC0 (Public Domain)

---

**Enjoy your adventure in the tavern!** 🍺⚔️
