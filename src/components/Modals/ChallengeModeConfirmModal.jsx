import React from 'react';
import PropTypes from 'prop-types';

/**
 * ChallengeModeConfirmModal Component
 * Confirms entering Challenge Mode and explains what it is
 *
 * @param {boolean} show - Whether to show the modal
 * @param {string} currentMode - Current game mode
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
const ChallengeModeConfirmModal = ({ show, currentMode, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-900 to-gray-900 p-8 rounded-lg border-4 border-red-600 max-w-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-red-400 text-center">⚔️ Enter Challenge Mode?</h2>

        <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border-2 border-red-700 mb-6">
          <p className="text-amber-100 text-center italic">
            "Welcome, brave challenger, to the ultimate test of skill!"
          </p>
        </div>

        <div className="text-amber-100 mb-6 space-y-4">
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <h3 className="text-xl font-bold text-amber-400 mb-3">📖 What is Challenge Mode?</h3>
            <p className="mb-3">
              Challenge Mode is the <strong className="text-yellow-300">Roguelite</strong> version of Tavern Rummy.
              Battle against the toughest AI while earning XP, leveling up, and unlocking powerful abilities!
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-red-400">Hard Difficulty Only:</strong> Face the most strategic AI opponent</li>
              <li><strong className="text-blue-400">No Strategy Tips:</strong> You're on your own - true mastery required!</li>
              <li><strong className="text-purple-400">Progression System:</strong> Earn XP and level up after each round</li>
              <li><strong className="text-yellow-400">Unlock Abilities:</strong> Gain Ability Points to unlock game-changing powers</li>
            </ul>
          </div>

          <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border-2 border-blue-700">
            <h3 className="text-xl font-bold text-blue-400 mb-2">⭐ How It Works</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong className="text-green-300">Earn XP:</strong> Every round grants experience points (Win: 50+ XP, Loss: 10+ XP)</li>
              <li>• <strong className="text-purple-300">Level Up:</strong> Gain Ability Points to unlock powerful abilities</li>
              <li>• <strong className="text-yellow-300">Use Abilities:</strong> Equip up to 3 abilities to gain strategic advantages</li>
              <li>• <strong className="text-pink-300">Match Mode Bonus:</strong> Win a match (first to 100 gold) for +50 XP bonus!</li>
            </ul>
          </div>

          <div className="bg-yellow-900 bg-opacity-30 p-3 rounded border border-yellow-600">
            <p className="text-yellow-200 text-sm text-center">
              <strong>💡 Tip:</strong> Complete Tutorial and Practice modes first to master the basics!
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
          >
            ⚔️ I Accept the Challenge!
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
          >
            Return to Safety
          </button>
        </div>

        <p className="text-gray-400 text-xs text-center mt-4 italic">
          Note: Entering Challenge Mode will start a new game
        </p>
      </div>
    </div>
  );
};

ChallengeModeConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  currentMode: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ChallengeModeConfirmModal;
