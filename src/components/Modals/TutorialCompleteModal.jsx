import React from 'react';

/**
 * TutorialCompleteModal Component
 * Displays when tutorial is completed, offers to start real match
 *
 * @param {boolean} show - Whether to show the modal
 * @param {string} roundWinner - Who won the tutorial round
 * @param {Function} onStartRealMatch - Callback when starting real match
 * @param {Function} onContinueTutorial - Callback when continuing tutorial
 */
const TutorialCompleteModal = ({
  show,
  roundWinner,
  onStartRealMatch,
  onContinueTutorial
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-yellow-500 max-w-lg shadow-2xl">
        <div className="text-center mb-4">
          <span className="text-6xl">🎓</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">Tutorial Complete!</h2>
        <p className="text-amber-100 mb-6 text-center text-lg">
          {roundWinner === 'player'
            ? "Well done, traveler! You've bested the Hooded Stranger and learned the ways of Tavern Rummy."
            : "A worthy lesson learned! Even in defeat, you've grasped the fundamentals of Tavern Rummy."
          }
        </p>
        <p className="text-amber-200 mb-8 text-center">
          Would you like to test your skills in a real match? The tutorial tips will be gone, and your opponent will play more strategically!
        </p>
        <div className="flex gap-4">
          <button
            onClick={onStartRealMatch}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold text-lg border-2 border-green-500 transition-all transform hover:scale-105"
          >
            ⚔️ Start Real Match
          </button>
          <button
            onClick={onContinueTutorial}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-lg border-2 border-blue-500 transition-all transform hover:scale-105"
          >
            📚 Continue Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialCompleteModal;
