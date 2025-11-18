import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS, GAME_MODES } from '../../utils/constants';

/**
 * DifficultySelector Component
 * Allows players to select game mode (Tutorial/Practice/Challenging) and difficulty
 *
 * @param {string} difficulty - Current difficulty level
 * @param {string} gameMode - Current game mode
 * @param {Function} onDifficultyChange - Callback when difficulty changes
 * @param {Function} onGameModeChange - Callback when game mode changes
 */
const DifficultySelector = ({ difficulty, gameMode, onDifficultyChange, onGameModeChange }) => {
  const [selectedMode, setSelectedMode] = useState(gameMode || GAME_MODES.PRACTICE);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty || DIFFICULTY_LEVELS.EASY);

  const modes = [
    { mode: GAME_MODES.TUTORIAL, label: '📚 Tutorial', description: 'Learn the basics' },
    { mode: GAME_MODES.PRACTICE, label: '🎯 Practice', description: 'Hone your skills' },
    { mode: GAME_MODES.CHALLENGING, label: '⚔️ Challenge Mode', description: 'Test your mastery' }
  ];

  // Only show Easy, Medium, Hard for Practice mode (Tutorial is a separate game mode)
  const difficulties = [
    { level: DIFFICULTY_LEVELS.EASY, label: '😊 Easy' },
    { level: DIFFICULTY_LEVELS.MEDIUM, label: '🎯 Medium' },
    { level: DIFFICULTY_LEVELS.HARD, label: '🔥 Hard' }
  ];

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setSelectedMode(mode);

    // Auto-set difficulty based on mode
    if (mode === GAME_MODES.TUTORIAL) {
      setSelectedDifficulty(DIFFICULTY_LEVELS.TUTORIAL);
      onDifficultyChange(DIFFICULTY_LEVELS.TUTORIAL);
    } else if (mode === GAME_MODES.CHALLENGING) {
      // Don't call onDifficultyChange for Challenge Mode
      // The difficulty change is handled by the Challenge Mode confirmation flow
      setSelectedDifficulty(DIFFICULTY_LEVELS.HARD);
    }

    onGameModeChange(mode);
  };

  const handleDifficultyChange = (e) => {
    const level = e.target.value;
    setSelectedDifficulty(level);
    onDifficultyChange(level);
  };

  // Determine if difficulty selection should be shown
  const showDifficultySelector = selectedMode === GAME_MODES.PRACTICE;

  return (
    <>
      {/* Game Type Dropdown - Inline styled */}
      <select
        id="gameType"
        value={selectedMode}
        onChange={handleModeChange}
        className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 text-xs sm:text-sm
                   hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500
                   transition-all cursor-pointer"
        title="Select game mode"
      >
        {modes.map(({ mode, label }) => (
          <option key={mode} value={mode}>
            {label}
          </option>
        ))}
      </select>

      {/* Difficulty Dropdown (only for Practice mode) - Inline styled */}
      {showDifficultySelector && (
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
          className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 text-xs sm:text-sm
                     hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500
                     transition-all cursor-pointer"
          title="Select difficulty"
        >
          {difficulties.map(({ level, label }) => (
            <option key={level} value={level}>
              {label}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

DifficultySelector.propTypes = {
  difficulty: PropTypes.string.isRequired,
  gameMode: PropTypes.string,
  onDifficultyChange: PropTypes.func.isRequired,
  onGameModeChange: PropTypes.func.isRequired
};

DifficultySelector.defaultProps = {
  gameMode: GAME_MODES.PRACTICE
};

export default DifficultySelector;
