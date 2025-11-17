# 🎮 Tavern Rummy - Roguelite System Quick Reference

## 🎯 **Core Concept**
Transform the card game into an RPG with levels, abilities, and progression. Players earn XP, level up, spend Ability Points on powers, and unlock content through Prestige Points.

---

## 📊 **Progression Loop**

```
Play Game → Earn XP → Level Up → Get Ability Points
                ↓
        Spend AP on Abilities
                ↓
      Get Stronger / New Options
                ↓
         Replay for More XP
```

---

## ⚡ **Quick Reference: Abilities**

### **Active Abilities** (Use in-game)
| Ability | Cost | Effect | Uses |
|---------|------|--------|------|
| 🔄 Redo Turn | 2 AP | Undo last discard | 1/round |
| 🔮 Mystic Eye | 3 AP | See opponent's card | 1/match |
| 🎴 Card Swap | 2 AP | Discard & redraw instantly | 2/match |
| 👁️ Deck Peek | 1 AP | See top 3 cards | 3/match |
| 🛡️ Shield | 3 AP | -50% gold loss (passive) | Always on |
| ⚔️ Aggressive Knock | 2 AP | Knock at ≤15 deadwood | 1/match |
| 🎯 Perfect Vision | 4 AP | Show best discard | 5/match |
| 🔥 Phoenix Revival | 5 AP | Respawn with 50 gold | 1/session |

### **Passive Abilities** (Always on)
| Ability | Cost | Max Level | Effect |
|---------|------|-----------|--------|
| 📊 Lucky Draw | 1 AP | 3 | 20%/40%/60% chance to draw 2, pick 1 |
| 💰 Gold Magnet | 2 AP | 3 | +10%/20%/30% gold earned |
| 🧠 Meld Master | 2 AP | 3 | Better meld visibility & hints |
| ⚡ Quick Hands | 1 AP | 3 | 20%/40%/60% faster AI turns |
| 🎓 XP Boost | 2 AP | 2 | +25%/50% XP earned |

---

## 🌟 **Prestige Unlocks** (1 PP each tier)

| Type | Cost | Examples |
|------|------|----------|
| 🎨 Card Skins | 1 PP | Gothic, Steampunk, Fantasy, Pixel |
| 🎭 AI Personalities | 2 PP | Merchant, Knight, Assassin, Rogue |
| 🏰 Tavern Upgrades | 3 PP | Better lighting, animations, sounds |
| 📜 Game Modes | 5 PP | Speed Rummy, Big Gin, Team Mode |
| ⭐ Prestige Stars | Free | Bragging rights (cosmetic) |

---

## 🗺️ **Campaign Mode: The Tavern Journey**

1. **Rusty Tankard** (Lv 1) - Old Tom - 50g + 1 AP
2. **Golden Goose** (Lv 5) - Merchant - 100g + 2 AP + Card Swap
3. **Dragon's Den** (Lv 10) - Assassin - 200g + 3 AP + Perfect Vision
4. **Shadow Court** (Lv 20) - Stranger - 500g + 5 AP + Phoenix Revival

---

## 💾 **Save System**

**What's Saved:**
- Level, XP, Ability Points, Prestige Points
- Purchased abilities (active & passive)
- Unlocked content (skins, AIs, modes)
- Stats (wins, losses, total gold, achievements)

**Storage:** LocalStorage (MVP), Server (future for multiplayer)

---

## 🎨 **UI Elements to Add**

### Top Bar
```
[Lv 12] [████████░░ 820/1000 XP] [⚡8 AP] [⭐⭐⭐]
```

### Abilities Panel (Bottom Right)
```
┌─────────────┐
│ ABILITIES   │
├─────────────┤
│ 🔄 Redo (1) │
│ 🔮 Eye  (2) │
│ 🎴 Swap (3) │
└─────────────┘
```

### XP Gain Popup
```
  ┌──────────┐
  │ +15 XP   │ (floats up, fades out)
  │ GIN!     │
  └──────────┘
```

---

## 🔨 **Implementation Phases**

### Phase 1: Core (2 weeks)
- XP and leveling
- Ability Points
- Save/load system
- Basic UI (XP bar, level)

### Phase 2: Abilities (2 weeks)
- Redo Turn + Gold Magnet
- Abilities shop
- Usage system

### Phase 3: Prestige (1-2 weeks)
- Prestige points
- Card skins
- Stats tracking
- Achievements

### Phase 4: Campaign (2-3 weeks)
- Tavern progression
- AI personalities
- Story mode

### Phase 5: Polish (1 week)
- Animations
- Sound effects
- Daily challenges

**Total:** 8-12 weeks full system, 4 weeks MVP

---

## 📈 **XP Rewards**

| Action | XP |
|--------|-----|
| Participation | 2 |
| Win Round | 10 |
| Knock Bonus | +5 |
| GIN Bonus | +15 |
| Undercut Bonus | +20 |
| First Meld | 3 |
| Loss Consolation | 5 |

**Level Curve:** 50 XP → 100 XP → 175 XP... (exponential)

---

## 🎯 **Balancing Philosophy**

1. **Fast Early Progression** (Lv 1-10) - Hook players
2. **Meaningful Choices** - Can't get everything
3. **No Paywalls** - All content through play
4. **Catch-Up Mechanics** - Losing gives bonus XP
5. **Ability Reset** - 100 gold to respec

---

## 💡 **Key Design Decisions**

- ✅ Abilities are powerful but limited (uses/cooldowns)
- ✅ Passive abilities stack (multiple levels)
- ✅ Prestige is about long-term goals
- ✅ Campaign adds narrative motivation
- ✅ LocalStorage keeps it simple (no server needed)
- ✅ Ethical monetization (cosmetics only)

---

## 🚀 **Quick Start Guide for Players**

1. **Play games** to earn XP
2. **Level up** to get Ability Points
3. **Buy abilities** that match your playstyle
4. **Use active abilities** at the right moment
5. **Reach Level 5** for Prestige Points
6. **Unlock cosmetics** or new game modes
7. **Complete campaign** to face The Stranger
8. **Prestige** for bragging rights and exclusive content

---

## 🎮 **Playstyle Builds**

### **Aggressive Build**
- Aggressive Knock
- Gold Magnet x3
- Perfect Vision
- Strategy: Knock early, win big

### **Defensive Build**
- Shield
- Redo Turn
- Lucky Draw x3
- Strategy: Minimize losses, maximize consistency

### **Learning Build**
- Perfect Vision
- Meld Master x3
- Deck Peek
- Strategy: Learn optimal play

### **Fast Grind Build**
- XP Boost x2
- Quick Hands x3
- Gold Magnet x3
- Strategy: Level up fastest

---

## ✅ **Success Metrics**

- Average session length increases
- 3+ day player retention
- 80% of players reach Level 5
- Diverse ability purchases (not just meta)
- Positive community feedback

---

**This system adds 50+ hours of progression content to what was a simple card game!**
