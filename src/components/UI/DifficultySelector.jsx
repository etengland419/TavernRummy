import React from 'react';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

/**
 * DifficultySelector Component
 * Allows players to select game difficulty
 *
 * @param {string} difficulty - Current difficulty level
 * @param {Function} onDifficultyChange - Callback when difficulty changes
 */
const DifficultySelector = ({ difficulty, onDifficultyChange }) => {
  const difficulties = [
    { level: DIFFICULTY_LEVELS.TUTORIAL, icon: '📚', color: 'blue' },
    { level: DIFFICULTY_LEVELS.EASY, icon: '😊', color: 'green' },
    { level: DIFFICULTY_LEVELS.MEDIUM, icon: '🎯', color: 'yellow' },
    { level: DIFFICULTY_LEVELS.HARD, icon: '🔥', color: 'red' }
  ];

  return (
    <div className="flex gap-3 justify-center mb-3">
      {difficulties.map(({ level, icon, color }) => (
        <button
          key={level}
          onClick={() => onDifficultyChange(level)}
          className={`px-4 py-2 rounded-lg border-2 transition-all ${
            difficulty === level
              ? `bg-${color}-600 border-${color}-400 text-white shadow-lg`
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {icon} {level}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
