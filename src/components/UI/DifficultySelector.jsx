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
    { mode: GAME_MODES.TUTORIAL, icon: '📚', color: 'blue' },
    { mode: GAME_MODES.PRACTICE, icon: '🎯', color: 'green' },
    { mode: GAME_MODES.CHALLENGING, icon: '⚔️', color: 'red' }
  ];

  // Only show Easy, Medium, Hard for Practice mode (Tutorial is a separate game mode)
  const difficulties = [
    { level: DIFFICULTY_LEVELS.EASY, icon: '😊', color: 'green' },
    { level: DIFFICULTY_LEVELS.MEDIUM, icon: '🎯', color: 'yellow' },
    { level: DIFFICULTY_LEVELS.HARD, icon: '🔥', color: 'red' }
  ];

  const handleModeChange = (mode) => {
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

  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    onDifficultyChange(level);
  };

  // Determine if difficulty selection should be shown
  const showDifficultySelector = selectedMode === GAME_MODES.PRACTICE;

  return (
    <div className="space-y-3">
      {/* Game Mode Selection */}
      <div>
        <h3 className="text-amber-200 text-base mb-2 text-center font-semibold">Game Mode</h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {modes.map(({ mode, icon, color }) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`p-2 rounded-lg border transition-all ${
                selectedMode === mode
                  ? `bg-${color}-600 border-${color}-400 shadow-lg`
                  : 'bg-gray-800 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-base sm:text-lg mb-0.5">{icon}</div>
                <div className={`font-semibold text-[10px] sm:text-xs ${
                  selectedMode === mode ? 'text-white' : 'text-gray-300'
                }`}>
                  {MODE_DESCRIPTIONS[mode].title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mode Description - Compact version */}
        <div className="bg-gray-800 bg-opacity-40 rounded p-2 border border-gray-700">
          <p className="text-gray-300 text-[11px] sm:text-xs text-center">
            {MODE_DESCRIPTIONS[selectedMode].description}
          </p>
        </div>
      </div>

      {/* Difficulty Selection (only for Practice mode) */}
      {showDifficultySelector && (
        <div>
          <h3 className="text-amber-200 text-base mb-2 text-center font-semibold">Difficulty</h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map(({ level, icon, color }) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`px-2 py-1.5 rounded-lg border transition-all ${
                  selectedDifficulty === level
                    ? `bg-${color}-600 border-${color}-400 text-white shadow-lg`
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-base sm:text-lg">{icon}</div>
                  <div className="text-[10px] sm:text-xs font-semibold">{level}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed difficulty notice for Tutorial and Challenging modes */}
      {selectedMode === GAME_MODES.TUTORIAL && (
        <div className="text-center text-[11px] sm:text-xs text-blue-300 bg-blue-900 bg-opacity-30 p-2 rounded">
          📚 Tutorial mode uses Tutorial difficulty
        </div>
      )}

      {selectedMode === GAME_MODES.CHALLENGING && (
        <div className="text-center text-[11px] sm:text-xs text-red-300 bg-red-900 bg-opacity-30 p-2 rounded">
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
