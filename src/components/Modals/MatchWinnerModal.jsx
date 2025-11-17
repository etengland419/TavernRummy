import React from 'react';
import PropTypes from 'prop-types';

/**
 * MatchWinnerModal Component
 * Displays match winner and final scores
 *
 * @param {string} matchWinner - 'player' or 'ai'
 * @param {Object} scores - Final scores {player, ai}
 * @param {Function} onPlayAgain - Callback when play again is clicked
 */
const MatchWinnerModal = ({ matchWinner, scores, onPlayAgain }) => {
  if (!matchWinner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[70]">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-10 rounded-lg border-4 border-yellow-600 max-w-2xl shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-8xl">
            {matchWinner === 'player' ? '👑' : '💀'}
          </span>
        </div>
        <h2 className={`text-5xl font-bold mb-6 text-center ${
          matchWinner === 'player' ? 'text-yellow-300' : 'text-pink-300'
        }`}>
          {matchWinner === 'player' ? 'HUZZAH! VICTORY IS THINE!' : 'ALAS! DEFEAT BEFALLS THEE!'}
        </h2>
        <div className="text-center text-amber-100 mb-8 space-y-3">
          <p className="text-2xl">
            {matchWinner === 'player'
              ? `By the ancient laws of the tavern, thou hast triumphed with ${scores.player} gold pieces! The Stranger doffs their hood in respect.`
              : `The mysterious Stranger hath bested thee, claiming ${scores.ai} gold from thy purse! Perhaps another round shall restore thy honor?`
            }
          </p>
          <div className="flex justify-center gap-8 text-xl mt-6">
            <div>
              <div className="text-amber-400">Thy Gold</div>
              <div className="text-3xl font-bold text-yellow-300">{scores.player}</div>
            </div>
            <div className="text-4xl text-amber-600">⚔️</div>
            <div>
              <div className="text-amber-400">Stranger's Hoard</div>
              <div className="text-3xl font-bold text-pink-300">{scores.ai}</div>
            </div>
          </div>
        </div>
        <button
          onClick={onPlayAgain}
          className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-2xl border-2 border-amber-400 transition-all transform hover:scale-105"
        >
          ⚔️ Challenge the Stranger Anew!
        </button>
      </div>
    </div>
  );
};

MatchWinnerModal.propTypes = {
  matchWinner: PropTypes.string,
  scores: PropTypes.shape({
    player: PropTypes.number.isRequired,
    ai: PropTypes.number.isRequired
  }).isRequired,
  onPlayAgain: PropTypes.func.isRequired
};

export default MatchWinnerModal;
