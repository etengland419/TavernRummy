import React from 'react';
import PropTypes from 'prop-types';
import { getCurrentTier, calculateMilestoneXP } from '../../utils/challengeUtils';

/**
 * MatchWinnerModal Component
 * Displays match winner and final scores
 *
 * @param {string} matchWinner - 'player' or 'ai'
 * @param {Object} scores - Final scores {player, ai}
 * @param {Function} onPlayAgain - Callback when play again is clicked
 * @param {Function} onChooseMode - Callback when choose mode is clicked
 * @param {string} gameMode - Current game mode (to show XP in challenge mode)
 * @param {number} xpGained - XP gained from match win (only for challenge mode)
 * @param {Object} stats - Stats object (for Challenge Mode run summary)
 */
const MatchWinnerModal = ({ matchWinner, scores, onPlayAgain, onChooseMode, gameMode, xpGained, stats }) => {
  if (!matchWinner) return null;

  const isChallenge = gameMode === 'challenging';
  const showXP = isChallenge && matchWinner === 'player' && xpGained > 0;

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
          {matchWinner === 'player' ? 'HUZZAH! VICTORY IS YOURS!' : 'ALAS! DEFEAT!'}
        </h2>
        <div className="text-center text-amber-100 mb-8 space-y-3">
          <p className="text-2xl">
            {matchWinner === 'player'
              ? `By the ancient laws of the tavern, you have triumphed with ${scores.player} gold pieces! The Stranger doffs their hood in respect.`
              : `The mysterious Stranger has bested you, claiming ${scores.ai} gold from your purse! Perhaps another round shall restore your honor?`
            }
          </p>
          <div className="flex justify-center gap-8 text-xl mt-6">
            <div>
              <div className="text-amber-400">Your Gold</div>
              <div className="text-3xl font-bold text-yellow-300">{scores.player}</div>
            </div>
            <div className="text-4xl text-amber-600">⚔️</div>
            <div>
              <div className="text-amber-400">Stranger's Hoard</div>
              <div className="text-3xl font-bold text-pink-300">{scores.ai}</div>
            </div>
          </div>

          {/* XP Reward Display (Challenge Mode Only) */}
          {showXP && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border-2 border-purple-400 animate-pulse">
              <div className="text-purple-300 text-xl font-semibold mb-2">
                ⚡ Challenge Mastery Bonus ⚡
              </div>
              <div className="text-yellow-300 text-3xl font-bold">
                +{xpGained} XP
              </div>
              <div className="text-purple-200 text-sm mt-1">
                Match Victory Reward
              </div>
            </div>
          )}

          {/* Challenge Mode Run Summary (on loss) */}
          {isChallenge && matchWinner === 'ai' && stats?.challengeMode && (
            <div className="mt-6 bg-purple-900 bg-opacity-50 border-2 border-purple-500 rounded-lg p-4">
              <h3 className="text-xl font-bold text-purple-200 mb-3 text-center">
                💀 Challenge Run Ended
              </h3>

              <div className="space-y-2 text-purple-200">
                <div className="flex justify-between">
                  <span>Final Win Streak:</span>
                  <span className="font-bold text-yellow-400">{stats.challengeMode.currentWinStreak}</span>
                </div>

                <div className="flex justify-between">
                  <span>Highest Tier:</span>
                  <span className="font-bold">{getCurrentTier(stats.challengeMode.currentWinStreak).name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Milestone XP:</span>
                  <span className="font-bold text-green-400">
                    +{calculateMilestoneXP(stats.challengeMode.currentWinStreak)} XP
                  </span>
                </div>
              </div>

              {stats.challengeMode.currentWinStreak >= 10 && (
                <div className="mt-4 text-center text-purple-300 italic text-sm">
                  "A valiant effort! Try again to reach even greater heights."
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-2xl border-2 border-amber-400 transition-all transform hover:scale-105"
          >
            ⚔️ Challenge the Stranger Anew!
          </button>

          <button
            onClick={onChooseMode}
            className="w-full px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg font-bold text-lg border-2 border-gray-400 transition-all transform hover:scale-105"
          >
            🎯 Choose Another Adventure
          </button>
        </div>
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
  onPlayAgain: PropTypes.func.isRequired,
  onChooseMode: PropTypes.func.isRequired,
  gameMode: PropTypes.string,
  xpGained: PropTypes.number,
  stats: PropTypes.object
};

export default MatchWinnerModal;
