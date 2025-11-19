# Lucky Draw Infinite Loop Bug Fix

## Issue Description

The Lucky Draw ability had a critical bug that caused:
1. **Infinite Loop**: The Lucky Draw modal would keep appearing after selection, allowing players to draw cards infinitely
2. **Duplicate Cards**: Players could end up with 30+ copies of the same card in their hand

## Root Cause Analysis

### The Infinite Loop
1. When Lucky Draw triggered in `drawCard()` (TavernRummy.jsx:318), it called `checkLuckyDraw(newDeck)`
2. The `checkLuckyDraw` function set `luckyDrawCards` state and `showLuckyDrawModal` to `true`, then returned early
3. When the user selected a card, `handleLuckyDrawSelection` was called
4. **BUG**: `handleLuckyDrawSelection` did NOT call `selectLuckyDrawCard` from the abilities hook to clear the modal state
5. **RESULT**: `showLuckyDrawModal` remained `true` and `luckyDrawCards` still had the card data
6. **INFINITE LOOP**: The modal would show again, allowing repeated selections

### The Duplicate Cards
1. Each time `handleLuckyDrawSelection` ran, it added the selected card to the player's hand
2. Since the modal state wasn't cleared, the same card reference could be selected multiple times
3. The card object reference was added to the hand array repeatedly, creating duplicates

## Fixes Implemented

### 1. Clear Modal State Properly
**File**: `src/TavernRummy.jsx`

Added `selectLuckyDrawCard` to the abilities destructuring and called it in `handleLuckyDrawSelection`:

```javascript
// Line 213: Added to destructuring
selectLuckyDrawCard,

// Line 891-892: Call to clear modal state
// Clear the Lucky Draw modal state using the hook function
selectLuckyDrawCard(selectedCard);
```

This ensures that:
- `luckyDrawCards` is set to `null`
- `showLuckyDrawModal` is set to `false`
- The modal properly closes and won't reappear

### 2. Add Duplicate Card Detection
**File**: `src/TavernRummy.jsx`

Added duplicate checks in `handleLuckyDrawSelection`:

```javascript
// Line 876-882: Check before processing
const cardExistsInHand = playerHand.some(card => card.id === selectedCard.id);
if (cardExistsInHand) {
  console.error('Duplicate card detected in hand:', selectedCard.id);
  setMessage('Error: Duplicate card detected. Please restart the round.');
  selectLuckyDrawCard(selectedCard); // Clear modal state
  return;
}

// Line 899-905: Double-check before adding to hand
const stillExists = playerHand.some(card => card.id === selectedCard.id);
if (stillExists) {
  console.error('Duplicate card still detected after timeout:', selectedCard.id);
  setMessage('Error: Duplicate card detected. Please restart the round.');
  return;
}
```

### 3. Game State Validation Utilities
**File**: `src/utils/gameStateValidation.js` (NEW)

Created comprehensive validation utilities:

- `checkForDuplicateCards(gameState)` - Detects duplicate cards across all game areas (hand, deck, discard)
- `validateGameState(gameState)` - Ensures exactly 52 unique cards exist
- `logGameStateValidation(gameState, context)` - Logs validation results to console for debugging

These utilities provide:
- Detailed reports of duplicate cards and their locations
- Card count verification (should always be 52 total)
- Helpful debugging logs with context

### 4. Added Validation Logging
**File**: `src/TavernRummy.jsx`

Added validation logging after Lucky Draw selection:

```javascript
// Line 914-918: Validate game state
logGameStateValidation(
  { playerHand: newHand, aiHand, deck: newDeck, discardPile },
  'After Lucky Draw Selection'
);
```

This logs any issues to the console, making it easier to detect and debug problems.

## Testing Recommendations

1. **Test Lucky Draw Ability**:
   - Unlock Lucky Draw (especially level 3 with 60% chance)
   - Draw cards from the deck multiple times
   - Verify modal only appears once per selection
   - Verify no duplicate cards in hand

2. **Check Console Logs**:
   - Look for "Game state is valid" messages
   - No error messages about duplicate cards
   - Total card count should always be 52

3. **Edge Cases**:
   - Multiple Lucky Draw triggers in succession
   - Lucky Draw on last few cards in deck
   - Lucky Draw combined with other abilities

## Impact

This fix resolves:
- ✅ Infinite loop issue
- ✅ Duplicate card bug
- ✅ Game state corruption
- ✅ Adds diagnostic tools for future debugging

## Files Changed

1. `src/TavernRummy.jsx` - Fixed modal state handling and added duplicate checks
2. `src/utils/gameStateValidation.js` - New utility file for game state validation
3. `docs/lucky-draw-bug-fix.md` - This documentation

## Prevention

To prevent similar issues in the future:
1. Always call the corresponding hook cleanup function when closing modals
2. Use the validation utilities during development
3. Check for duplicate objects when dealing with card state
4. Log game state at critical points for debugging
