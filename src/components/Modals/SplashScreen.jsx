import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

/**
 * SplashScreen Component
 * Displays an initial splash screen when the game loads with startup options
 *
 * @param {boolean} show - Whether to show the splash screen
 * @param {Function} onStart - Callback when a game mode is selected (difficulty, matchMode)
 */
const SplashScreen = ({ show, onStart }) => {
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.TUTORIAL);
  const [matchMode, setMatchMode] = useState(false);

  if (!show) return null;

  const handleStart = () => {
    onStart({ difficulty, matchMode });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100] animate-fade-in">
      {/* Background torch effects */}
      <div className="absolute top-20 left-40 w-60 h-60 bg-orange-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-40 w-60 h-60 bg-orange-500 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-60 h-60 bg-amber-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="relative z-10 text-center max-w-3xl px-8">
        {/* Title */}
        <div className="mb-8 animate-slide-down">
          <h1 className="text-7xl font-bold text-amber-400 mb-4 drop-shadow-2xl" style={{ fontFamily: 'serif' }}>
            ⚔️ Tavern Rummy ⚔️
          </h1>
          <div className="text-2xl text-amber-300 italic mb-6">
            A Game of Skill and Fortune in the Shadows
          </div>
        </div>

        {/* Story box */}
        <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 mb-6 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-amber-100 text-lg leading-relaxed mb-4">
            The tavern door creaks open. A hooded stranger sits at the corner table, shuffling a worn deck of cards.
            The candlelight flickers across their hidden face as they gesture to the empty seat across from them.
          </p>
          <p className="text-amber-200 text-xl font-semibold italic">
            "Care to test your fortune, traveler? The game is Rummy, and the stakes... well, that's for fate to decide."
          </p>
        </div>

        {/* Game Options */}
        <div className="mb-6 space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {/* Difficulty Selection */}
          <div className="flex items-center justify-center gap-2">
            <label className="text-amber-300 font-semibold text-sm">Difficulty:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDifficulty(DIFFICULTY_LEVELS.TUTORIAL)}
                className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all ${
                  difficulty === DIFFICULTY_LEVELS.TUTORIAL
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                }`}
              >
                📚 Tutorial
              </button>
              <button
                onClick={() => setDifficulty(DIFFICULTY_LEVELS.EASY)}
                className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all ${
                  difficulty === DIFFICULTY_LEVELS.EASY
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                }`}
              >
                😊 Easy
              </button>
              <button
                onClick={() => setDifficulty(DIFFICULTY_LEVELS.MEDIUM)}
                className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all ${
                  difficulty === DIFFICULTY_LEVELS.MEDIUM
                    ? 'bg-yellow-600 border-yellow-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                }`}
              >
                🎯 Medium
              </button>
              <button
                onClick={() => setDifficulty(DIFFICULTY_LEVELS.HARD)}
                className={`px-3 py-1 rounded border-2 text-sm font-semibold transition-all ${
                  difficulty === DIFFICULTY_LEVELS.HARD
                    ? 'bg-red-600 border-red-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                }`}
              >
                🔥 Hard
              </button>
            </div>
          </div>

          {/* Match Mode Toggle */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setMatchMode(!matchMode)}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                matchMode
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🏆 Match Mode (First to 100)
            </button>
          </div>
        </div>

        {/* Enter button */}
        <button
          onClick={handleStart}
          className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-3xl border-4 border-amber-400 transition-all transform hover:scale-110 shadow-2xl animate-bounce-subtle mb-6"
          style={{ animationDelay: '0.6s' }}
        >
          ⚔️ Enter the Tavern ⚔️
        </button>

        {/* Subtitle */}
        <p className="text-amber-500 text-sm italic animate-fade-in" style={{ animationDelay: '0.9s' }}>
          Steel yourself, for the cards hold many secrets...
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

SplashScreen.propTypes = {
  show: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired
};

export default SplashScreen;
