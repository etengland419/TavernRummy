import React from 'react';
import PropTypes from 'prop-types';
import { GAME_CONFIG } from '../../utils/constants';

/**
 * MatchModeConfirmModal Component
 * Confirms toggling match mode and starting a new game
 *
 * @param {boolean} show - Whether to show the modal
 * @param {boolean} isEnabling - Whether enabling or disabling match mode
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
const MatchModeConfirmModal = ({ show, isEnabling, onConfirm, onCancel }) => {
  if (!show) return null;

  const getTitle = () => {
    return isEnabling
      ? "🏆 Begin Match Mode?"
      : "🏆 End Match Mode?";
  };

  const getMessage = () => {
    if (isEnabling) {
      return (
        <>
          <p className="mb-3">
            You're about to embark on a true test of skill! In Match Mode, you'll compete in a series of rounds,
            and the first to reach <span className="font-bold text-yellow-300">{GAME_CONFIG.MATCH_WIN_SCORE} gold</span> shall
            be crowned the victor!
          </p>
          <p className="text-amber-200 italic">
            Your current game will be forfeit, and a fresh match shall begin!
          </p>
        </>
      );
    }

    return (
      <>
        <p className="mb-3">
          Are you certain you want to abandon the match? You'll return to playing single rounds,
          and all match progress will be lost!
        </p>
        <p className="text-amber-200 italic">
          A new game will begin fresh.
        </p>
      </>
    );
  };

  const getConfirmText = () => {
    return isEnabling ? "Begin the Match!" : "End Match Mode";
  };

  const getCancelText = () => {
    return "Nay, Keep Current Game";
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

MatchModeConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  isEnabling: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default MatchModeConfirmModal;
