import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import PlayingCard from './PlayingCard';

/**
 * AnimatedCard Component
 * Displays a card that animates from one position to another
 *
 * @param {Object} card - Card object
 * @param {boolean} hidden - Whether to show card face-down
 * @param {Object} fromPosition - Starting position {x, y}
 * @param {Object} toPosition - Ending position {x, y}
 * @param {number} duration - Animation duration in seconds
 * @param {Function} onComplete - Callback when animation completes
 */
const AnimatedCard = ({
  card,
  hidden = false,
  fromPosition,
  toPosition,
  duration = 0.3,
  onComplete
}) => {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{
        x: fromPosition.x,
        y: fromPosition.y,
        opacity: 0.8,
        scale: 0.8
      }}
      animate={{
        x: toPosition.x,
        y: toPosition.y,
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration,
        ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
      }}
    >
      <PlayingCard card={card} hidden={hidden} />
    </motion.div>
  );
};

AnimatedCard.propTypes = {
  card: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
  fromPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  toPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  duration: PropTypes.number,
  onComplete: PropTypes.func
};

export default AnimatedCard;
