import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS, GAME_MODES, MODE_DESCRIPTIONS } from '../../utils/constants';

/**
 * SplashScreen Component
 * Displays an initial splash screen when the game loads with startup options
 *
 * @param {boolean} show - Whether to show the splash screen
 * @param {Function} onStart - Callback when a game mode is selected (difficulty, matchMode)
 */
const SplashScreen = ({ show, onStart }) => {
  const [selectedGameMode, setSelectedGameMode] = useState(GAME_MODES.TUTORIAL);
  const [selectedMatchMode, setSelectedMatchMode] = useState(false);

  if (!show) return null;

  const gameModes = [
    { mode: GAME_MODES.TUTORIAL, icon: '📚', color: 'blue', difficulty: DIFFICULTY_LEVELS.TUTORIAL },
    { mode: GAME_MODES.PRACTICE, icon: '🎯', color: 'green', difficulty: DIFFICULTY_LEVELS.EASY },
    { mode: GAME_MODES.CHALLENGING, icon: '⚔️', color: 'red', difficulty: DIFFICULTY_LEVELS.HARD, special: '⚡ Leveling & Abilities!' }
  ];

  const handleStart = () => {
    const selectedMode = gameModes.find(m => m.mode === selectedGameMode);
    onStart({ difficulty: selectedMode.difficulty, gameMode: selectedGameMode, matchMode: selectedMatchMode });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100] animate-fade-in overflow-y-auto">
      {/* Background torch effects - more subtle on mobile */}
      <div className="absolute top-10 left-5 md:top-20 md:left-40 w-32 h-32 md:w-60 md:h-60 bg-orange-500 rounded-full filter blur-3xl opacity-20 md:opacity-30 animate-pulse"></div>
      <div className="absolute top-10 right-5 md:top-20 md:right-40 w-32 h-32 md:w-60 md:h-60 bg-orange-500 rounded-full filter blur-3xl opacity-20 md:opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 left-1/2 md:bottom-20 w-32 h-32 md:w-60 md:h-60 bg-amber-600 rounded-full filter blur-3xl opacity-15 md:opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="relative z-10 text-center max-w-4xl px-4 md:px-8 py-6 md:py-0">
        {/* Title */}
        <div className="mb-4 md:mb-8 animate-slide-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-2 md:mb-4 drop-shadow-2xl" style={{ fontFamily: 'serif' }}>
            ⚔️ Tavern Rummy ⚔️
          </h1>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-300 italic mb-3 md:mb-6">
            A Game of Skill and Fortune in the Shadows
          </div>
        </div>

        {/* Story box */}
        <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-4 md:p-8 rounded-lg border-2 md:border-4 border-amber-600 mb-4 md:mb-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-amber-100 text-sm md:text-base lg:text-lg leading-relaxed mb-3 md:mb-4">
            The tavern door creaks open. A hooded stranger sits at the corner table, shuffling a worn deck of cards.
            The candlelight flickers across their hidden face as they gesture to the empty seat across from them.
          </p>
          <p className="text-amber-200 text-base md:text-lg lg:text-xl font-semibold italic">
            "Care to test your fortune, traveler? The game is Rummy, and the stakes... well, that's for fate to decide."
          </p>
        </div>

        {/* Compact game options */}
        <div className="mb-4 md:mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {/* Game Mode Selector */}
          <div className="mb-2 md:mb-3">
            <h3 className="text-amber-200 text-base md:text-lg mb-2 text-center font-semibold">Choose Your Path</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4 max-w-2xl mx-auto">
            {gameModes.map(({ mode, icon, color, special }) => (
              <button
                key={mode}
                onClick={() => setSelectedGameMode(mode)}
                className={`px-2 py-3 md:px-3 md:py-4 rounded-lg border-2 transition-all ${
                  selectedGameMode === mode
                    ? `bg-${color}-600 border-${color}-400 text-white shadow-lg transform scale-105`
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1">{icon}</div>
                  <div className="text-xs md:text-sm font-semibold">{MODE_DESCRIPTIONS[mode].title}</div>
                  {special && (
                    <div className="text-[10px] md:text-xs text-yellow-300 mt-1">
                      {special}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Mode Description */}
          <div className="bg-gray-800 bg-opacity-60 rounded-lg p-3 md:p-4 border border-gray-700 mb-3 md:mb-4 max-w-2xl mx-auto">
            <p className="text-gray-300 text-xs md:text-sm text-center">
              {MODE_DESCRIPTIONS[selectedGameMode].description}
            </p>
          </div>

          {/* Match Mode Toggle */}
          <div className="flex gap-2 md:gap-3 justify-center items-center mb-4 md:mb-6">
            <button
              onClick={() => setSelectedMatchMode(!selectedMatchMode)}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg border-2 transition-all text-sm md:text-base ${
                selectedMatchMode
                  ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🏆 Match Mode {selectedMatchMode ? '(First to 100)' : ''}
            </button>
          </div>
        </div>

        {/* Enter button */}
        <button
          onClick={handleStart}
          className="px-6 py-3 md:px-12 md:py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-xl md:text-2xl lg:text-3xl border-2 md:border-4 border-amber-400 transition-all transform hover:scale-110 shadow-2xl animate-bounce-subtle"
          style={{ animationDelay: '0.9s' }}
        >
          ⚔️ Enter the Tavern ⚔️
        </button>

        {/* Subtitle */}
        <p className="text-amber-500 text-xs md:text-sm mt-4 md:mt-6 italic animate-fade-in px-4" style={{ animationDelay: '1.2s' }}>
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
