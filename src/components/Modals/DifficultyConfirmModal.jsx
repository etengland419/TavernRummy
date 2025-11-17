import React from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

/**
 * DifficultyConfirmModal Component
 * Confirms changing difficulty and starting a new game
 *
 * @param {boolean} show - Whether to show the modal
 * @param {string} currentDifficulty - Current difficulty level
 * @param {string} newDifficulty - Target difficulty level
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
const DifficultyConfirmModal = ({ show, currentDifficulty, newDifficulty, onConfirm, onCancel }) => {
  if (!show) return null;

  const isLeavingTutorial = currentDifficulty === DIFFICULTY_LEVELS.TUTORIAL;

  const getTitle = () => {
    if (isLeavingTutorial) {
      return "Leave Tutorial Mode?";
    }
    return "Change Difficulty?";
  };

  const getMessage = () => {
    if (isLeavingTutorial) {
      return "Are you sure you want to leave Tutorial mode? You'll no longer receive helpful tips and guidance, and a new game will start.";
    }
    return `Are you sure you want to change from ${currentDifficulty} to ${newDifficulty}? This will start a new game and reset the current round.`;
  };

  const getConfirmText = () => {
    if (isLeavingTutorial) {
      return "Yes, Continue";
    }
    return "Start New Game";
  };

  const getCancelText = () => {
    if (isLeavingTutorial) {
      return "Stay in Tutorial";
    }
    return "Cancel";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">{getTitle()}</h2>
        <p className="text-amber-100 mb-6">
          {getMessage()}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
          >
            {getConfirmText()}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
          >
            {getCancelText()}
          </button>
        </div>
      </div>
    </div>
  );
};

DifficultyConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  currentDifficulty: PropTypes.string,
  newDifficulty: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DifficultyConfirmModal;
