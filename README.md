# ⚔️ Tavern Rummy ⚔️

A medieval-themed Gin Rummy card game with an immersive tavern atmosphere, intelligent AI opponents, and an interactive tutorial system.

## 🎮 Play Online

[Play Tavern Rummy](https://your-username.github.io/TavernRummy) *(Update with your GitHub Pages URL)*

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
│   │   ├── UI/                    # Reusable UI components
│   │   │   ├── PlayingCard.jsx
│   │   │   ├── ScoreDisplay.jsx
│   │   │   └── DifficultySelector.jsx
│   │   ├── Modals/                # Modal dialogs
│   │   │   ├── RoundEndModal.jsx
│   │   │   ├── MatchWinnerModal.jsx
│   │   │   ├── TutorialCompleteModal.jsx
│   │   │   └── DifficultyConfirmModal.jsx
│   │   └── Game/                  # Game-specific components
│   │       ├── GameBoard.jsx
│   │       ├── PlayerHand.jsx
│   │       ├── AIHand.jsx
│   │       └── GameControls.jsx
│   ├── hooks/                     # Custom React hooks
│   │   └── useTutorial.js
│   ├── utils/                     # Utility functions
│   │   ├── constants.js           # Game configuration
│   │   ├── cardUtils.js           # Card operations
│   │   ├── meldUtils.js           # Meld detection logic
│   │   └── scoringUtils.js        # Scoring calculations
│   ├── ai/                        # AI strategy
│   │   └── aiStrategy.js
│   ├── styles/
│   │   └── index.css
│   ├── TavernRummy.jsx            # Main game component
│   └── index.js                   # Application entry point
├── public/
│   └── index.html
├── docs/                          # Documentation
│   ├── code-review.md
│   └── roguelite-reference.md
├── package.json
├── tailwind.config.js
└── README.md
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

### Code Organization
- **Components** - Modular, reusable React components
- **Hooks** - Custom hooks for game logic (tutorial system)
- **Utils** - Pure functions for game mechanics
- **AI** - Separated AI strategy for easy modification

### Key Features of the Architecture
- **Memoization** - Optimized re-renders with `useMemo`
- **Separation of Concerns** - Logic separated from presentation
- **Scalability** - Easy to add new features and game modes
- **Maintainability** - Clear file structure and documentation

## 🧪 Testing

```bash
# Run tests
npm test
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Future Enhancements
- Multiplayer mode (online play)
- Leaderboards and statistics
- Sound effects and music
- Additional card themes
- Progressive web app (PWA) support
- Achievements system
- Card animation improvements

## 📚 Learn More

- [Gin Rummy Rules](https://en.wikipedia.org/wiki/Gin_rummy)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🙏 Acknowledgments

- Inspired by classic Gin Rummy
- Medieval theme elements
- Community feedback and suggestions

---

**Enjoy your adventure in the tavern!** 🍺⚔️
