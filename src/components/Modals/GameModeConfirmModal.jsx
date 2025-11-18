import React from 'react';
import PropTypes from 'prop-types';
import { GAME_MODES } from '../../utils/constants';

/**
 * GameModeConfirmModal Component
 * Confirms changing game mode and starting a new game
 *
 * @param {boolean} show - Whether to show the modal
 * @param {string} currentMode - Current game mode
 * @param {string} newMode - Target game mode
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
const GameModeConfirmModal = ({ show, currentMode, newMode, onConfirm, onCancel }) => {
  if (!show) return null;

  const getModeDetails = (mode) => {
    switch (mode) {
      case GAME_MODES.TUTORIAL:
        return {
          icon: '📚',
          name: 'Tutorial',
          description: 'Guided learning experience with helpful tips',
          color: 'from-blue-900 to-gray-900',
          borderColor: 'border-blue-600'
        };
      case GAME_MODES.PRACTICE:
        return {
          icon: '🎯',
          name: 'Practice Mode',
          description: 'Play with strategy tips and any difficulty level',
          color: 'from-green-900 to-gray-900',
          borderColor: 'border-green-600'
        };
      case GAME_MODES.CHALLENGING:
        return {
          icon: '⚔️',
          name: 'Challenge Mode',
          description: 'Endless progression! Win streaks unlock harder AI tiers. XP and abilities essential for survival!',
          color: 'from-red-900 to-gray-900',
          borderColor: 'border-red-600'
        };
      default:
        return {
          icon: '🎮',
          name: 'Game Mode',
          description: 'Different game experience',
          color: 'from-amber-900 to-gray-900',
          borderColor: 'border-amber-600'
        };
    }
  };

  const currentModeDetails = getModeDetails(currentMode);
  const newModeDetails = getModeDetails(newMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className={`bg-gradient-to-br ${newModeDetails.color} p-8 rounded-lg border-4 ${newModeDetails.borderColor} max-w-xl shadow-2xl`}>
        <h2 className="text-3xl font-bold mb-4 text-amber-400 text-center">
          {newModeDetails.icon} Switch to {newModeDetails.name}?
        </h2>

        <div className="bg-black bg-opacity-30 p-4 rounded-lg border-2 border-amber-700 mb-6">
          <p className="text-amber-100 mb-3">
            You're currently in <strong className="text-yellow-300">{currentModeDetails.icon} {currentModeDetails.name}</strong>.
          </p>
          <p className="text-amber-100">
            Switching to <strong className="text-yellow-300">{newModeDetails.icon} {newModeDetails.name}</strong> will start a new game.
          </p>
        </div>

        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700 mb-6">
          <h3 className="text-lg font-bold text-amber-400 mb-2">{newModeDetails.icon} {newModeDetails.name}</h3>
          <p className="text-amber-100">{newModeDetails.description}</p>

          {newMode === GAME_MODES.CHALLENGING && (
            <div className="mt-3 p-3 bg-red-900 bg-opacity-30 rounded border border-red-600">
              <p className="text-red-200 text-sm">
                <strong>⚠️ Note:</strong> Challenge Mode features endless scaling difficulty! Win streaks increase AI strength every 5 wins. No strategy tips!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
          >
            Switch Mode
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
          >
            Cancel
          </button>
        </div>

        <p className="text-gray-400 text-xs text-center mt-4 italic">
          Your current game will end and a new one will begin
        </p>
      </div>
    </div>
  );
};

GameModeConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  currentMode: PropTypes.string,
  newMode: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default GameModeConfirmModal;
