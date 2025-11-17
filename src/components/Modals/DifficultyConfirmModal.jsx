import React from 'react';

/**
 * DifficultyConfirmModal Component
 * Confirms leaving tutorial mode
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
const DifficultyConfirmModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Leave Tutorial Mode?</h2>
        <p className="text-amber-100 mb-6">
          Are you sure you want to leave Tutorial mode? You'll no longer receive helpful tips and guidance.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
          >
            Yes, Continue
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
          >
            Stay in Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultyConfirmModal;
