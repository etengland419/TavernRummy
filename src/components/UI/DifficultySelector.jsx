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

  const difficulties = [
    { level: DIFFICULTY_LEVELS.TUTORIAL, icon: '📚', color: 'blue' },
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
    <div className="space-y-6">
      {/* Game Mode Selection */}
      <div>
        <h3 className="text-amber-200 text-xl mb-3 text-center font-bold">Game Mode</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {modes.map(({ mode, icon, color }) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMode === mode
                  ? `bg-${color}-600 border-${color}-400 shadow-lg`
                  : 'bg-gray-800 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">{icon}</div>
                <div className={`font-bold text-sm ${
                  selectedMode === mode ? 'text-white' : 'text-gray-300'
                }`}>
                  {MODE_DESCRIPTIONS[mode].title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mode Description */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 text-sm mb-2">
            {MODE_DESCRIPTIONS[selectedMode].description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-blue-300">
              💡 {MODE_DESCRIPTIONS[selectedMode].tips}
            </div>
            <div className="text-green-300">
              📊 {MODE_DESCRIPTIONS[selectedMode].stats}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection (only for Practice mode) */}
      {showDifficultySelector && (
        <div>
          <h3 className="text-amber-200 text-xl mb-3 text-center font-bold">Difficulty</h3>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map(({ level, icon, color }) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  selectedDifficulty === level
                    ? `bg-${color}-600 border-${color}-400 text-white shadow-lg`
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl">{icon}</div>
                  <div className="text-xs font-semibold">{level}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed difficulty notice for Tutorial and Challenging modes */}
      {selectedMode === GAME_MODES.TUTORIAL && (
        <div className="text-center text-sm text-blue-300 bg-blue-900 bg-opacity-30 p-3 rounded-lg">
          📚 Tutorial mode uses Tutorial difficulty for the best learning experience
        </div>
      )}

      {selectedMode === GAME_MODES.CHALLENGING && (
        <div className="text-center text-sm text-red-300 bg-red-900 bg-opacity-30 p-3 rounded-lg">
          ⚔️ Challenging mode uses Hard difficulty - prepare for battle!
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
