import { useState, useCallback } from 'react';
import { ANIMATION_TIMINGS } from '../utils/constants';

/**
 * Custom hook for managing flying card animations
 * Handles card movement animations between different game areas
 *
 * @returns {Object} Animation state and control functions
 */
export const useCardAnimation = () => {
  const [flyingCards, setFlyingCards] = useState([]);

  /**
   * Get element position for animation start/end points
   * @param {React.RefObject} ref - Reference to DOM element
   * @returns {{x: number, y: number}} Position coordinates
   */
  const getElementPosition = useCallback((ref) => {
    if (!ref || !ref.current) return { x: 0, y: 0 };
    const rect = ref.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - 40,  // Center card (card width is ~80px)
      y: rect.top + rect.height / 2 - 56   // Center card (card height is ~112px)
    };
  }, []);

  /**
   * Add a flying card animation
   * @param {Object} card - Card object to animate
   * @param {React.RefObject} fromRef - Starting position reference
   * @param {React.RefObject} toRef - Ending position reference
   * @param {boolean} hidden - Whether card should be face-down
   * @param {number} duration - Animation duration in seconds
   * @returns {void}
   */
  const addFlyingCard = useCallback((card, fromRef, toRef, hidden = false, duration = ANIMATION_TIMINGS.CARD_DRAW / 1000) => {
    // Validate refs before creating animation
    if (!fromRef || !fromRef.current || !toRef || !toRef.current) {
      console.warn('Animation refs not ready, skipping animation');
      return;
    }

    const fromPos = getElementPosition(fromRef);
    const toPos = getElementPosition(toRef);

    // Validate positions
    if (fromPos.x === 0 && fromPos.y === 0 && toPos.x === 0 && toPos.y === 0) {
      console.warn('Invalid positions, skipping animation');
      return;
    }

    const flyingCard = {
      id: `flying-${card.id}-${Date.now()}`,
      card,
      fromPosition: fromPos,
      toPosition: toPos,
      hidden,
      duration,
      onComplete: () => {
        setFlyingCards(prev => prev.filter(fc => fc.id !== flyingCard.id));
      }
    };

    setFlyingCards(prev => [...prev, flyingCard]);
  }, [getElementPosition]);

  /**
   * Add flying card with custom position (for discarding from hand)
   * @param {Object} card - Card object to animate
   * @param {Object} fromPosition - Custom starting position {x, y}
   * @param {React.RefObject} toRef - Ending position reference
   * @param {number} duration - Animation duration in seconds
   * @returns {void}
   */
  const addFlyingCardFromPosition = useCallback((card, fromPosition, toRef, duration = ANIMATION_TIMINGS.CARD_DISCARD / 1000) => {
    if (!toRef || !toRef.current) {
      console.warn('Animation toRef not ready, skipping animation');
      return;
    }

    const toPos = getElementPosition(toRef);

    const flyingCard = {
      id: `flying-${card.id}-${Date.now()}`,
      card,
      fromPosition,
      toPosition: toPos,
      hidden: false,
      duration,
      onComplete: () => {
        setFlyingCards(prev => prev.filter(fc => fc.id !== flyingCard.id));
      }
    };

    setFlyingCards(prev => [...prev, flyingCard]);
  }, [getElementPosition]);

  /**
   * Clear all flying cards (useful for cleanup)
   */
  const clearFlyingCards = useCallback(() => {
    setFlyingCards([]);
  }, []);

  return {
    flyingCards,
    addFlyingCard,
    addFlyingCardFromPosition,
    getElementPosition,
    clearFlyingCards
  };
};

export default useCardAnimation;
