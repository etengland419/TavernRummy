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
  const [showOptions, setShowOptions] = useState(false);

  if (!show) return null;

  const handleStartOption = (difficulty, matchMode = false) => {
    onStart({ difficulty, matchMode });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100] animate-fade-in">
      {/* Background torch effects */}
      <div className="absolute top-20 left-40 w-60 h-60 bg-orange-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-40 w-60 h-60 bg-orange-500 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-60 h-60 bg-amber-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="relative z-10 text-center max-w-4xl px-8">
        {/* Title */}
        <div className="mb-8 animate-slide-down">
          <h1 className="text-7xl font-bold text-amber-400 mb-4 drop-shadow-2xl" style={{ fontFamily: 'serif' }}>
            ⚔️ Tavern Rummy ⚔️
          </h1>
          <div className="text-2xl text-amber-300 italic mb-6">
            A Game of Skill and Fortune in the Shadows
          </div>
        </div>

        {!showOptions ? (
          <>
            {/* Story box */}
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 mb-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-amber-100 text-lg leading-relaxed mb-4">
                The tavern door creaks open. A hooded stranger sits at the corner table, shuffling a worn deck of cards.
                The candlelight flickers across their hidden face as they gesture to the empty seat across from them.
              </p>
              <p className="text-amber-200 text-xl font-semibold italic">
                "Care to test your fortune, traveler? The game is Rummy, and the stakes... well, that's for fate to decide."
              </p>
            </div>

            {/* Enter button */}
            <button
              onClick={() => setShowOptions(true)}
              className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-3xl border-4 border-amber-400 transition-all transform hover:scale-110 shadow-2xl animate-bounce-subtle"
              style={{ animationDelay: '0.6s' }}
            >
              ⚔️ Enter the Tavern ⚔️
            </button>

            {/* Subtitle */}
            <p className="text-amber-500 text-sm mt-6 italic animate-fade-in" style={{ animationDelay: '0.9s' }}>
              Steel yourself, for the cards hold many secrets...
            </p>
          </>
        ) : (
          <>
            {/* Startup Options */}
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 mb-6 shadow-2xl animate-fade-in-up">
              <h2 className="text-3xl font-bold text-amber-300 mb-6 italic">
                Choose Your Path, Traveler
              </h2>

              <div className="space-y-4">
                {/* Tutorial Option */}
                <button
                  onClick={() => handleStartOption(DIFFICULTY_LEVELS.TUTORIAL)}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-xl border-3 border-blue-400 transition-all transform hover:scale-105 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span>📚 Tutorial Mode</span>
                    <span className="text-sm font-normal opacity-80">Learn the basics</span>
                  </div>
                </button>

                {/* Quick Play Section */}
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
                  <h3 className="text-xl font-bold text-amber-300 mb-3">⚔️ Quick Play</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.EASY)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold text-lg border-2 border-green-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>😊 Easy</span>
                        <span className="text-sm font-normal opacity-80">A friendly match</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.MEDIUM)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-700 to-yellow-800 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold text-lg border-2 border-yellow-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>🎯 Medium</span>
                        <span className="text-sm font-normal opacity-80">A worthy opponent</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.HARD)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white rounded-lg font-semibold text-lg border-2 border-red-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>🔥 Hard</span>
                        <span className="text-sm font-normal opacity-80">The devil's own hand</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Match Mode Section */}
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border-2 border-purple-600">
                  <h3 className="text-xl font-bold text-purple-300 mb-3">🏆 Match Mode (First to 100)</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.EASY, true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold text-lg border-2 border-purple-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>😊 Easy Match</span>
                        <span className="text-sm font-normal opacity-80">Extended play</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.MEDIUM, true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold text-lg border-2 border-purple-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>🎯 Medium Match</span>
                        <span className="text-sm font-normal opacity-80">Extended play</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStartOption(DIFFICULTY_LEVELS.HARD, true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold text-lg border-2 border-purple-400 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>🔥 Hard Match</span>
                        <span className="text-sm font-normal opacity-80">Extended play</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Back button */}
              <button
                onClick={() => setShowOptions(false)}
                className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold border-2 border-gray-500 transition-all"
              >
                ← Back
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-amber-500 text-sm italic">
              Choose wisely, for the cards favor the prepared...
            </p>
          </>
        )}
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
