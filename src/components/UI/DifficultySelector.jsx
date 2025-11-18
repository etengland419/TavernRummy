import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS, GAME_MODES, MODE_DESCRIPTIONS } from '../../utils/constants';

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
    { mode: GAME_MODES.CHALLENGING, label: '⚔️ Challenging', description: 'Test your mastery' }
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
      setSelectedDifficulty(DIFFICULTY_LEVELS.HARD);
      onDifficultyChange(DIFFICULTY_LEVELS.HARD);
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
    <div className="space-y-3">
      {/* Game Type Dropdown */}
      <div>
        <label htmlFor="gameType" className="text-amber-200 text-sm mb-2 block text-center font-semibold">
          Game Type
        </label>
        <select
          id="gameType"
          value={selectedMode}
          onChange={handleModeChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm
                     hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500
                     transition-all cursor-pointer"
        >
          {modes.map(({ mode, label, description }) => (
            <option key={mode} value={mode}>
              {label}
            </option>
          ))}
        </select>

        {/* Mode Description */}
        <div className="mt-2 bg-gray-800 bg-opacity-40 rounded p-2 border border-gray-700">
          <p className="text-gray-300 text-xs text-center">
            {MODE_DESCRIPTIONS[selectedMode].description}
          </p>
        </div>
      </div>

      {/* Difficulty Dropdown (only for Practice mode) */}
      {showDifficultySelector && (
        <div>
          <label htmlFor="difficulty" className="text-amber-200 text-sm mb-2 block text-center font-semibold">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm
                       hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500
                       transition-all cursor-pointer"
          >
            {difficulties.map(({ level, label }) => (
              <option key={level} value={level}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fixed difficulty notice for Tutorial and Challenging modes */}
      {selectedMode === GAME_MODES.TUTORIAL && (
        <div className="text-center text-xs text-blue-300 bg-blue-900 bg-opacity-30 p-2 rounded">
          📚 Tutorial mode uses Tutorial difficulty
        </div>
      )}

      {selectedMode === GAME_MODES.CHALLENGING && (
        <div className="text-center text-xs text-red-300 bg-red-900 bg-opacity-30 p-2 rounded">
          ⚔️ Hard difficulty - prepare for battle!
        </div>
      )}
    </div>
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
