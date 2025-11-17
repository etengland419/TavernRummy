import { useEffect, useState, useCallback } from 'react';
import { GAME_CONFIG, SUIT_SYMBOLS, DIFFICULTY_LEVELS } from '../utils/constants';
import { findMelds, calculateDeadwood } from '../utils/meldUtils';

/**
 * Custom hook for tutorial system
 * Provides guidance messages and highlights for tutorial mode
 *
 * @param {string} difficulty - Current difficulty level
 * @param {string} phase - Current game phase ('draw' or 'discard')
 * @param {Array} playerHand - Player's current hand
 * @param {Array} discardPile - Current discard pile
 * @param {Array} deck - Current deck
 * @returns {Object} {tutorialMessage, tutorialHighlight, updateTutorialGuidance}
 */
export const useTutorial = (difficulty, phase, playerHand, discardPile, deck) => {
  const [tutorialMessage, setTutorialMessage] = useState('');
  const [tutorialHighlight, setTutorialHighlight] = useState(null);

  const updateTutorialGuidance = useCallback(() => {
    if (difficulty !== DIFFICULTY_LEVELS.TUTORIAL) {
      setTutorialMessage('');
      setTutorialHighlight(null);
      return;
    }

    if (phase === 'draw') {
      const topDiscard = discardPile[discardPile.length - 1];
      if (topDiscard) {
        const testHand = [...playerHand, topDiscard];
        const currentDeadwood = calculateDeadwood(playerHand);
        const testDeadwood = calculateDeadwood(testHand);
        const currentMelds = findMelds(playerHand).length;
        const testMelds = findMelds(testHand).length;

        if (testDeadwood < currentDeadwood) {
          setTutorialMessage(`💡 TIP: Take the ${topDiscard.rank} of ${SUIT_SYMBOLS[topDiscard.suit]} from discard! It reduces your deadwood from ${currentDeadwood} to ${testDeadwood}.`);
          setTutorialHighlight('discard');
        } else if (testMelds > currentMelds) {
          setTutorialMessage(`💡 TIP: Take the ${topDiscard.rank} of ${SUIT_SYMBOLS[topDiscard.suit]} from discard! It forms a new meld.`);
          setTutorialHighlight('discard');
        } else {
          setTutorialMessage(`💡 TIP: Draw from the deck. The ${topDiscard.rank} of ${SUIT_SYMBOLS[topDiscard.suit]} doesn't help you.`);
          setTutorialHighlight('deck');
        }
      } else {
        setTutorialMessage(`💡 TIP: Draw from the deck to get a new card.`);
        setTutorialHighlight('deck');
      }
    } else if (phase === 'discard') {
      const melds = findMelds(playerHand);
      const meldedCards = new Set(melds.flat());
      const deadwoodCards = playerHand.filter(c => !meldedCards.has(c));

      const currentDeadwood = calculateDeadwood(playerHand);

      if (currentDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD) {
        if (currentDeadwood === 0) {
          setTutorialMessage(`💡 TIP: You have GIN (0 deadwood)! Discard any card, then knock for a ${GAME_CONFIG.GIN_BONUS} gold bonus!`);
          setTutorialHighlight('knock');
        } else {
          setTutorialMessage(`💡 TIP: You have ${currentDeadwood} deadwood (${GAME_CONFIG.KNOCK_THRESHOLD} or less). After discarding, you can KNOCK to end the round! Lower deadwood than your opponent wins.`);
          setTutorialHighlight('knock');
        }
      } else {
        if (deadwoodCards.length > 0) {
          const sortedDeadwood = deadwoodCards.sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return 0;
          });

          const worstCard = sortedDeadwood[0];
          setTutorialMessage(`💡 TIP: Discard your ${worstCard.rank} of ${SUIT_SYMBOLS[worstCard.suit]} (${worstCard.value} points). Try to get your deadwood to ${GAME_CONFIG.KNOCK_THRESHOLD} or less to knock!`);
          setTutorialHighlight(worstCard.id);
        } else {
          setTutorialMessage(`💡 TIP: All your cards are in melds! Discard any card and knock with 0 deadwood for GIN!`);
          setTutorialHighlight('knock');
        }
      }
    }
  }, [difficulty, phase, playerHand, discardPile]);

  useEffect(() => {
    updateTutorialGuidance();
  }, [updateTutorialGuidance]);

  return {
    tutorialMessage,
    tutorialHighlight,
    setTutorialHighlight,
    updateTutorialGuidance
  };
};
