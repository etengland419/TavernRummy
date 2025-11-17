# 🎮 Tavern Rummy - Roguelite System Roadmap

## 📋 Table of Contents
1. [Current Status](#current-status)
2. [Roadmap Overview](#roadmap-overview)
3. [Phase Breakdown](#phase-breakdown)
4. [Implementation Guide](#implementation-guide)
5. [Quick Reference](#quick-reference)

---

## 🎯 Current Status

### **Version 1.0 - Complete** ✅
- ✅ Core Gin Rummy gameplay
- ✅ Tutorial mode with hints
- ✅ 4 difficulty levels
- ✅ Match mode (first to 100)
- ✅ Auto-sort cards
- ✅ Meld highlighting
- ✅ Smart AI opponents
- ✅ Modular code architecture
- ✅ GitHub Pages deployment ready

### **Next: Version 2.0 - Progression System** 🚀
Transform into an RPG-style game with levels, abilities, and unlockables.

---

## 🗺️ Roadmap Overview

### **Phase 1: Core Progression** (3-4 weeks)
MVP of progression system
- XP & leveling
- Ability Points
- Basic abilities (2 active, 2 passive)
- Save/load system
- Progression UI

### **Phase 2: Full Abilities** (2-3 weeks)
Complete ability system
- All 8 active abilities
- All 5 passive abilities (with levels)
- Abilities shop UI
- Ability tooltips & tutorials

### **Phase 3: Prestige System** (2-3 weeks)
Long-term progression
- Prestige points
- Card skin system
- AI personalities
- Statistics tracking
- Achievement system

### **Phase 4: Campaign Mode** (3-4 weeks)
Story-driven progression
- 4 taverns with bosses
- Narrative system
- Unique AI personalities
- Progressive difficulty
- Campaign rewards

### **Phase 5: Polish & Features** (2-3 weeks)
Final touches
- Sound effects
- Enhanced animations
- Daily challenges
- Leaderboards (optional)
- PWA support

**Total Timeline: 12-17 weeks (3-4 months)**

---

## 📅 Phase Breakdown

## Phase 1: Core Progression (Weeks 1-4)

### **Week 1: Foundation**
**Goal:** Set up XP and leveling system

**Tasks:**
1. Create progression data structures
   - Add `/src/utils/progressionUtils.js`
   - XP calculation functions
   - Level curve formula

2. Add XP rewards to game
   - Modify `scoringUtils.js` to include XP
   - Hook into round end logic

3. Save/load system
   - Add `/src/utils/storageUtils.js`
   - LocalStorage wrapper functions
   - Save player progress

4. Basic UI
   - Add XP bar to header
   - Show current level
   - Level-up notification

**Files to Create:**
```
src/utils/progressionUtils.js     # XP, leveling, AP
src/utils/storageUtils.js         # Save/load
src/components/UI/XPBar.jsx       # XP display
src/components/Modals/LevelUpModal.jsx
```

**Example Code:**
```javascript
// src/utils/progressionUtils.js
export const calculateXPForLevel = (level) => {
  return Math.floor(50 * Math.pow(1.5, level - 1));
};

export const XP_REWARDS = {
  ROUND_PARTICIPATION: 2,
  ROUND_WIN: 10,
  KNOCK_BONUS: 5,
  GIN_BONUS: 15,
  UNDERCUT_BONUS: 20,
  FIRST_MELD: 3,
  LOSS_CONSOLATION: 5,
};
```

---

### **Week 2: Ability Points & First Abilities**
**Goal:** Implement AP economy and 2 starter abilities

**Tasks:**
1. Ability Point system
   - Award 1 AP per level
   - Store in player save data

2. Implement 2 abilities
   - **Redo Turn** (Active)
   - **Gold Magnet** (Passive)

3. Abilities state management
   - Add to main game state
   - Hook into game logic

4. Basic abilities UI
   - Show AP count
   - Abilities panel (bottom-right)

**Files to Create:**
```
src/utils/abilitiesUtils.js       # Ability definitions
src/hooks/useAbilities.js         # Abilities hook
src/components/UI/AbilitiesPanel.jsx
```

**Example:**
```javascript
// Redo Turn implementation
const useRedoTurn = () => {
  const [previousState, setPreviousState] = useState(null);
  const [available, setAvailable] = useState(true);

  const saveState = (gameState) => {
    setPreviousState(gameState);
  };

  const redoTurn = () => {
    if (available && previousState) {
      // Restore previous state
      setAvailable(false);
      return previousState;
    }
  };

  return { saveState, redoTurn, available };
};
```

---

### **Week 3: Abilities Shop**
**Goal:** UI for buying and managing abilities

**Tasks:**
1. Abilities shop modal
   - List all abilities
   - Show costs and descriptions
   - Purchase flow

2. Ability management
   - Equip/unequip active abilities
   - Upgrade passive abilities

3. Tooltips system
   - Hover over abilities for info
   - Usage instructions

**Files to Create:**
```
src/components/Modals/AbilitiesShopModal.jsx
src/components/UI/AbilityCard.jsx
src/components/UI/Tooltip.jsx
```

---

### **Week 4: Testing & Polish**
**Goal:** Bug fixes, balance, and UX improvements

**Tasks:**
1. Balance testing
   - XP curve feels right
   - Abilities are balanced
   - AP costs make sense

2. Save/load testing
   - Works across sessions
   - No data loss
   - Migration from v1.0

3. UI polish
   - Smooth animations
   - Clear feedback
   - Mobile-friendly

4. Documentation
   - Update README
   - Add progression guide
   - Tutorial updates

---

## Phase 2: Full Abilities (Weeks 5-7)

### **Week 5-6: Implement All Abilities**
**Tasks:**
1. Add remaining active abilities
   - 🔮 Mystic Eye
   - 🎴 Card Swap
   - 👁️ Deck Peek
   - 🛡️ Shield
   - ⚔️ Aggressive Knock
   - 🎯 Perfect Vision
   - 🔥 Phoenix Revival

2. Add remaining passive abilities
   - 📊 Lucky Draw (3 levels)
   - 🧠 Meld Master (3 levels)
   - ⚡ Quick Hands (3 levels)
   - 🎓 XP Boost (2 levels)

3. Hook abilities into gameplay
   - Integrate with game logic
   - Add cooldown system
   - Visual effects for abilities

**Example:**
```javascript
// Mystic Eye ability
const useMysticEye = () => {
  const revealCard = (aiHand) => {
    const randomCard = aiHand[Math.floor(Math.random() * aiHand.length)];
    showNotification(`The Stranger holds: ${randomCard.rank} of ${SUIT_SYMBOLS[randomCard.suit]}`);
    // Show for 5 seconds
    setTimeout(hideNotification, 5000);
  };

  return { revealCard, cooldown: 1, usesPerMatch: 1 };
};
```

### **Week 7: Abilities Testing & Balance**
**Tasks:**
1. Balance pass on all abilities
2. Cost adjustment
3. Cooldown tuning
4. Visual polish

---

## Phase 3: Prestige System (Weeks 8-10)

### **Week 8: Prestige Foundation**
**Tasks:**
1. Prestige point system
   - Award 1 PP every 5 levels
   - Prestige level tracking

2. Card skins system
   - Create skin definitions
   - Skin switcher UI
   - Apply skins to cards

**Files to Create:**
```
src/utils/skinsUtils.js
src/components/UI/SkinSelector.jsx
src/components/Modals/PrestigeShop.jsx
```

**Example Skins:**
```javascript
export const CARD_SKINS = {
  classic: {
    name: 'Classic',
    cost: 0,
    cardBack: 'gradient-to-br from-amber-900 to-amber-950',
    cardFront: 'gradient-to-br from-amber-50 to-amber-100',
  },
  gothic: {
    name: 'Gothic',
    cost: 1, // PP
    cardBack: 'gradient-to-br from-purple-950 to-black',
    cardFront: 'gradient-to-br from-purple-100 to-gray-200',
  },
  // ...
};
```

### **Week 9: Statistics & Achievements**
**Tasks:**
1. Stats tracking
   - Wins, losses, win rate
   - Total gold earned
   - Best scores
   - Track in localStorage

2. Achievement system
   - Define 15-20 achievements
   - Achievement checking logic
   - Achievement notifications
   - Progress tracking

**Files to Create:**
```
src/utils/statisticsUtils.js
src/utils/achievementsUtils.js
src/components/Modals/StatsModal.jsx
src/components/UI/AchievementToast.jsx
```

**Example Achievements:**
```javascript
export const ACHIEVEMENTS = {
  first_blood: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first game',
    icon: '🎯',
    check: (stats) => stats.totalWins >= 1,
  },
  perfect_gin_5: {
    id: 'perfect_gin_5',
    name: 'Perfect Gin Master',
    description: 'Get GIN 5 times',
    icon: '💎',
    check: (stats) => stats.totalGins >= 5,
  },
  // ...
};
```

### **Week 10: AI Personalities**
**Tasks:**
1. Create 4 AI personalities
   - Merchant (defensive)
   - Knight (aggressive, makes mistakes)
   - Assassin (optimal play)
   - Rogue (risky plays)

2. Personality-specific dialogue
3. Visual indicators
4. Unlock system

**Files to Create:**
```
src/ai/personalities/
  ├── merchant.js
  ├── knight.js
  ├── assassin.js
  └── rogue.js
```

---

## Phase 4: Campaign Mode (Weeks 11-14)

### **Week 11-12: Tavern System**
**Tasks:**
1. Campaign data structure
   - 4 taverns with progression
   - Unlock requirements
   - Rewards system

2. Campaign UI
   - Tavern map/selection
   - Story screens
   - Boss battle UI

3. Story system
   - Dialogue system
   - Story snippets
   - Character intros

**Files to Create:**
```
src/utils/campaignUtils.js
src/components/Campaign/
  ├── TavernMap.jsx
  ├── StoryScreen.jsx
  └── BossBattle.jsx
```

**Campaign Structure:**
```javascript
export const TAVERNS = [
  {
    id: 'rusty_tankard',
    name: 'The Rusty Tankard',
    level: 1,
    opponent: {
      name: 'Old Tom',
      personality: 'tutorial',
      difficulty: 'Tutorial',
      avatar: '👴',
    },
    story: {
      intro: "You push open the creaky door...",
      victory: "Old Tom chuckles and slides you some gold.",
      defeat: "Better luck next time, youngster!"
    },
    rewards: {
      gold: 50,
      ap: 1,
      unlock: null,
    },
    unlockRequirement: 1, // Level 1
  },
  // ... more taverns
];
```

### **Week 13: Campaign Integration**
**Tasks:**
1. Integrate campaign with main game
2. Campaign save progress
3. Victory/defeat screens
4. Reward distribution

### **Week 14: Campaign Polish**
**Tasks:**
1. Boss AI improvements
2. Story polish
3. Reward balancing
4. Visual improvements

---

## Phase 5: Polish & Features (Weeks 15-17)

### **Week 15: Sound System**
**Tasks:**
1. Add sound effects
   - Card shuffle
   - Card flip
   - Draw/discard
   - Knock
   - Victory/defeat
   - Level up

2. Background music (optional)
   - Tavern ambience
   - Boss battle music

3. Sound settings
   - Volume control
   - Mute toggle

**Files to Create:**
```
src/utils/soundUtils.js
public/sounds/
  ├── card-flip.mp3
  ├── knock.mp3
  ├── victory.mp3
  └── ...
```

### **Week 16: Enhanced Animations**
**Tasks:**
1. XP gain animations
   - Float-up popups
   - Number count-up
   - Progress bar fills

2. Ability animations
   - Activation effects
   - Cooldown indicators
   - Visual feedback

3. Card animations
   - Meld formation glow
   - Flying cards
   - Smoother transitions

### **Week 17: Final Features**
**Tasks:**
1. Daily challenges (optional)
   - Random challenge each day
   - Bonus rewards
   - Challenge UI

2. PWA Support
   - Service worker
   - Offline play
   - Install prompt
   - App icons

3. Final polish
   - Bug fixes
   - Performance optimization
   - Accessibility improvements
   - Mobile optimization

4. Documentation
   - Complete README
   - Progression guide
   - Strategy guide
   - API documentation

---

## 🔨 Implementation Guide

### **Adding New Files to Project**

When implementing, maintain the modular structure:

```
src/
├── components/
│   ├── UI/              # Add XPBar, AbilitiesPanel, etc.
│   ├── Modals/          # Add shops, stats, etc.
│   └── Campaign/        # Add campaign components
├── hooks/
│   ├── useAbilities.js
│   ├── useProgression.js
│   └── useCampaign.js
├── utils/
│   ├── progressionUtils.js
│   ├── abilitiesUtils.js
│   ├── statisticsUtils.js
│   └── campaignUtils.js
└── ai/
    └── personalities/
```

### **Integration Pattern**

1. **Create utility functions first**
   ```javascript
   // src/utils/progressionUtils.js
   export const calculateXP = (gameResult) => { ... };
   ```

2. **Create hook for state management**
   ```javascript
   // src/hooks/useProgression.js
   export const useProgression = () => {
     const [level, setLevel] = useState(1);
     const [xp, setXp] = useState(0);
     // ...
     return { level, xp, addXP, levelUp };
   };
   ```

3. **Create UI components**
   ```javascript
   // src/components/UI/XPBar.jsx
   const XPBar = ({ xp, xpToNext, level }) => { ... };
   ```

4. **Integrate into main game**
   ```javascript
   // src/TavernRummy.jsx
   import { useProgression } from './hooks/useProgression';

   const TavernRummy = () => {
     const { level, xp, addXP } = useProgression();
     // Use in game logic...
   };
   ```

### **Testing Checklist**

For each phase:
- [ ] Functionality works
- [ ] Saves/loads correctly
- [ ] UI is responsive
- [ ] Mobile-friendly
- [ ] No console errors
- [ ] Performance is good
- [ ] Documentation updated

---

## 📊 Quick Reference

### **XP Rewards**
| Action | XP |
|--------|-----|
| Participation | 2 |
| Win Round | 10 |
| Knock | +5 |
| GIN | +15 |
| Undercut | +20 |
| First Meld | 3 |
| Loss | 5 |

### **Active Abilities**
| Ability | Cost | Uses | Cooldown |
|---------|------|------|----------|
| Redo Turn | 2 AP | 1/round | - |
| Mystic Eye | 3 AP | 1/match | - |
| Card Swap | 2 AP | 2/match | - |
| Deck Peek | 1 AP | 3/match | - |
| Shield | 3 AP | Passive | - |
| Aggressive Knock | 2 AP | 1/match | - |
| Perfect Vision | 4 AP | 5/match | - |
| Phoenix Revival | 5 AP | 1/session | - |

### **Passive Abilities**
| Ability | Cost/Level | Max Level | Effect |
|---------|------------|-----------|--------|
| Lucky Draw | 1 AP | 3 | 20%/40%/60% double draw |
| Gold Magnet | 2 AP | 3 | +10%/20%/30% gold |
| Meld Master | 2 AP | 3 | Better meld hints |
| Quick Hands | 1 AP | 3 | 20%/40%/60% faster AI |
| XP Boost | 2 AP | 2 | +25%/50% XP |

### **Prestige Unlocks**
| Item | Cost | Type |
|------|------|------|
| Card Skins | 1 PP | Cosmetic |
| AI Personalities | 2 PP | Gameplay |
| Tavern Upgrades | 3 PP | Visual |
| Game Modes | 5 PP | Gameplay |

---

## 🎯 Success Metrics

### **Phase 1 Success:**
- Players reach Level 10+ consistently
- 80%+ players understand AP system
- Save/load works 100% of time
- Positive feedback on abilities

### **Phase 2 Success:**
- All abilities functional
- Diverse ability purchases (not meta-only)
- Abilities feel impactful
- No game-breaking bugs

### **Phase 3 Success:**
- Players unlock at least 1 prestige item
- Achievement completion rate >50% for common achievements
- Stats tracking accurate
- Prestige feels rewarding

### **Phase 4 Success:**
- 60%+ players complete at least 2 taverns
- Boss battles feel challenging
- Story enhances experience
- Campaign rewards balanced

### **Phase 5 Success:**
- Sound effects well-received
- Smooth animations
- PWA installs (if implemented)
- Overall positive reviews

---

## 📝 Notes

### **Development Tips:**
1. Test after each major feature
2. Keep backward compatibility with v1.0 saves
3. Balance frequently - playtest!
4. Document as you go
5. Commit often with clear messages

### **Balancing Philosophy:**
- Fast early progression (hook players)
- Meaningful choices (can't get everything)
- No paywalls (all content unlockable)
- Catch-up mechanics (losing gives bonus XP)
- Ability reset option (100 gold)

### **Technical Considerations:**
- Keep save data under 5MB
- Optimize for mobile performance
- Support offline play
- Graceful degradation if localStorage fails
- Consider future backend integration

---

**This roadmap transforms Tavern Rummy from a card game into a full RPG experience over 12-17 weeks. Follow phases sequentially for best results. Each phase builds on the previous, creating a cohesive progression system that adds 50+ hours of gameplay!** 🎮🏆
