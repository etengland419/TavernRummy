import React from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS, DIFFICULTY_DESCRIPTIONS } from '../../utils/constants';

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
  const difficultyInfo = DIFFICULTY_DESCRIPTIONS[newDifficulty];

  const getTitle = () => {
    if (isLeavingTutorial) {
      return "⚔️ Depart from Training Grounds?";
    }
    return difficultyInfo?.title || "⚔️ Change Difficulty?";
  };

  const getMessage = () => {
    if (isLeavingTutorial) {
      return (
        <>
          <p className="mb-3">
            Are you certain you want to leave the guidance of your mentor? You'll venture forth without counsel, and a fresh contest shall commence!
          </p>
          {difficultyInfo && (
            <>
              <p className="mb-2 font-semibold text-yellow-300">{difficultyInfo.description}</p>
              <p className="text-amber-200 italic">{difficultyInfo.warning}</p>
            </>
          )}
        </>
      );
    }

    return (
      <>
        <p className="mb-3">
          Do you really want to shift from the {currentDifficulty} path to the {newDifficulty} way? The current game shall be forfeit and a new challenge shall begin!
        </p>
        {difficultyInfo && (
          <>
            <p className="mb-2 font-semibold text-yellow-300">{difficultyInfo.description}</p>
            <p className="text-amber-200 italic">{difficultyInfo.warning}</p>
          </>
        )}
      </>
    );
  };

  const getConfirmText = () => {
    if (isLeavingTutorial) {
      return "Aye, I Am Ready!";
    }
    return "Begin Anew!";
  };

  const getCancelText = () => {
    if (isLeavingTutorial) {
      return "Nay, Continue Learning";
    }
    return "Remain As Is";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">{getTitle()}</h2>
        <div className="text-amber-100 mb-6">
          {getMessage()}
        </div>
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
