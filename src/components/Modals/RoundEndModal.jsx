import React from 'react';

/**
 * RoundEndModal Component
 * Displays round results and statistics
 *
 * @param {Object} roundEndData - {winner, playerDeadwood, aiDeadwood, scoreDiff, reason}
 * @param {Function} onNextRound - Callback when next round is clicked
 */
const RoundEndModal = ({ roundEndData, onNextRound }) => {
  if (!roundEndData) return null;

  const { winner, playerDeadwood, aiDeadwood, scoreDiff, reason } = roundEndData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
        <h2 className={`text-3xl font-bold mb-4 text-center ${
          winner === 'draw'
            ? 'text-gray-400'
            : winner === 'player'
              ? 'text-yellow-400'
              : 'text-pink-400'
        }`}>
          {winner === 'draw' ? '⚖️ Stalemate!' : winner === 'player' ? '🏆 Victory!' : '💀 Defeat!'}
        </h2>

        <div className="space-y-3 mb-6 text-amber-100">
          <p className="text-center text-lg">{reason}</p>
          <div className="flex justify-between border-t border-amber-700 pt-3">
            <span>Your Deadwood:</span>
            <span className="font-bold text-yellow-400">{playerDeadwood}</span>
          </div>
          <div className="flex justify-between">
            <span>Stranger's Deadwood:</span>
            <span className="font-bold text-pink-400">{aiDeadwood}</span>
          </div>
          {winner !== 'draw' && (
            <div className="flex justify-between border-t border-amber-700 pt-3 font-bold">
              <span>Gold {winner === 'player' ? 'Won' : 'Lost'}:</span>
              <span className={winner === 'player' ? 'text-yellow-400' : 'text-pink-400'}>
                {scoreDiff}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onNextRound}
          className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg border-2 border-amber-400 transition-all"
        >
          Next Round
        </button>
      </div>
    </div>
  );
};

export default RoundEndModal;
