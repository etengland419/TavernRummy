import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ABILITIES, getImplementedAbilities } from '../../utils/abilitiesUtils';

/**
 * DebugModal Component
 * Development tools for testing progression, abilities, and game state
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onClose - Callback when closing
 * @param {Object} progression - Progression hook object
 * @param {Object} abilities - Abilities hook object
 * @param {Object} scores - Current game scores
 * @param {Function} setScores - Setter for game scores
 * @param {Function} onAutoWin - Callback to instantly win current round
 * @param {boolean} gameOver - Whether the current round is over
 */
const DebugModal = ({ show, onClose, progression, abilities, scores, setScores, onAutoWin, gameOver }) => {
  const [customXP, setCustomXP] = useState('');
  const [customAP, setCustomAP] = useState('');
  const [customGold, setCustomGold] = useState('');

  if (!show) return null;

  // XP Quick Actions
  const handleAddXP = (amount) => {
    progression.addXP(amount, `[DEBUG] Added ${amount} XP`);
    console.log(`[DEBUG] Added ${amount} XP`);
  };

  const handleCustomXP = () => {
    const amount = parseInt(customXP);
    if (!isNaN(amount) && amount > 0) {
      handleAddXP(amount);
      setCustomXP('');
    }
  };

  // AP Quick Actions
  const handleAddAP = (amount) => {
    // Directly modify abilityPoints by refunding negative amount
    progression.refundAP(-amount);
    console.log(`[DEBUG] Added ${amount} AP`);
  };

  const handleCustomAP = () => {
    const amount = parseInt(customAP);
    if (!isNaN(amount) && amount > 0) {
      handleAddAP(amount);
      setCustomAP('');
    }
  };

  // Gold Quick Actions
  const handleAddGold = (target, amount) => {
    setScores(prev => ({
      ...prev,
      [target]: prev[target] + amount
    }));
    console.log(`[DEBUG] Added ${amount} gold to ${target}`);
  };

  const handleCustomGold = (target) => {
    const amount = parseInt(customGold);
    if (!isNaN(amount)) {
      handleAddGold(target, amount);
      setCustomGold('');
    }
  };

  // Level Quick Actions
  const handleQuickLevel = (levels) => {
    // Approximate XP needed for N levels (50 * 1.2^level formula)
    let totalXP = 0;
    for (let i = 0; i < levels; i++) {
      totalXP += Math.floor(50 * Math.pow(1.2, progression.level + i));
    }
    handleAddXP(totalXP);
  };

  // Ability Quick Actions
  const handleUnlockAllAbilities = () => {
    Object.values(ABILITIES).forEach(ability => {
      if (ability.type === 'active' && !abilities.isAbilityUnlocked(ability.id)) {
        // Give enough AP to unlock
        const apNeeded = ability.cost - progression.abilityPoints;
        if (apNeeded > 0) {
          handleAddAP(apNeeded);
        }
        abilities.unlockAbility(ability.id);
      } else if (ability.type === 'passive') {
        // Max out passive abilities
        const currentLevel = abilities.getAbilityLevel(ability.id);
        for (let i = currentLevel; i < ability.maxLevel; i++) {
          const apNeeded = ability.cost - progression.abilityPoints;
          if (apNeeded > 0) {
            handleAddAP(apNeeded);
          }
          abilities.unlockAbility(ability.id);
        }
      }
    });
    console.log('[DEBUG] Unlocked all abilities');
  };

  const handleResetProgression = () => {
    if (window.confirm('⚠️ This will reset ALL progression (XP, Level, AP, Abilities). Are you sure?')) {
      // Clear localStorage
      localStorage.removeItem('tavernRummyProgression');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-4 border-red-600 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-400">🔧 Debug Tools</h2>
          <button
            onClick={onClose}
            className="text-3xl text-red-400 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-900 bg-opacity-50 p-3 rounded-lg border-2 border-red-500 mb-6">
          <p className="text-red-200 text-center font-bold">
            ⚠️ DEVELOPMENT ONLY - These tools modify game state for testing purposes
          </p>
        </div>

        {/* Current Stats Display */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-gray-600 mb-6">
          <h3 className="text-xl font-bold text-amber-400 mb-3">📊 Current State</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-900 bg-opacity-40 p-3 rounded border border-blue-500">
              <div className="text-blue-300 text-sm">Level</div>
              <div className="text-2xl font-bold text-white">{progression.level}</div>
            </div>
            <div className="bg-purple-900 bg-opacity-40 p-3 rounded border border-purple-500">
              <div className="text-purple-300 text-sm">Total XP</div>
              <div className="text-2xl font-bold text-white">{progression.totalXP}</div>
            </div>
            <div className="bg-yellow-900 bg-opacity-40 p-3 rounded border border-yellow-500">
              <div className="text-yellow-300 text-sm">AP Available</div>
              <div className="text-2xl font-bold text-white">{progression.abilityPoints}</div>
            </div>
            <div className="bg-green-900 bg-opacity-40 p-3 rounded border border-green-500">
              <div className="text-green-300 text-sm">Player Gold</div>
              <div className="text-2xl font-bold text-white">{scores.player}</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-400 text-center">
            XP to Next Level: {progression.currentLevelXP} / {progression.xpToNextLevel}
          </div>
        </div>

        {/* XP Controls */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-blue-600 mb-4">
          <h3 className="text-xl font-bold text-blue-400 mb-3">⭐ Experience Points (XP)</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleAddXP(50)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border-2 border-blue-400 transition-all"
            >
              +50 XP
            </button>
            <button
              onClick={() => handleAddXP(100)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border-2 border-blue-400 transition-all"
            >
              +100 XP
            </button>
            <button
              onClick={() => handleAddXP(500)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border-2 border-blue-400 transition-all"
            >
              +500 XP
            </button>
            <button
              onClick={() => handleQuickLevel(1)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg border-2 border-purple-400 transition-all"
            >
              +1 Level
            </button>
            <button
              onClick={() => handleQuickLevel(5)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg border-2 border-purple-400 transition-all"
            >
              +5 Levels
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={customXP}
              onChange={(e) => setCustomXP(e.target.value)}
              placeholder="Custom XP amount"
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border-2 border-gray-600 focus:border-blue-400 outline-none"
            />
            <button
              onClick={handleCustomXP}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border-2 border-blue-400 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* AP Controls */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-yellow-600 mb-4">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">💎 Ability Points (AP)</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleAddAP(1)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg border-2 border-yellow-400 transition-all"
            >
              +1 AP
            </button>
            <button
              onClick={() => handleAddAP(5)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg border-2 border-yellow-400 transition-all"
            >
              +5 AP
            </button>
            <button
              onClick={() => handleAddAP(10)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg border-2 border-yellow-400 transition-all"
            >
              +10 AP
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={customAP}
              onChange={(e) => setCustomAP(e.target.value)}
              placeholder="Custom AP amount"
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border-2 border-gray-600 focus:border-yellow-400 outline-none"
            />
            <button
              onClick={handleCustomAP}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg border-2 border-yellow-400 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Gold Controls */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-green-600 mb-4">
          <h3 className="text-xl font-bold text-green-400 mb-3">💰 Gold (Scores)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Gold */}
            <div>
              <div className="text-green-300 mb-2 font-semibold">Player Gold</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => handleAddGold('player', 25)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +25
                </button>
                <button
                  onClick={() => handleAddGold('player', 50)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +50
                </button>
                <button
                  onClick={() => handleAddGold('player', 100)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +100
                </button>
                <button
                  onClick={() => setScores(prev => ({ ...prev, player: 0 }))}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded border border-red-400 transition-all text-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* AI Gold */}
            <div>
              <div className="text-green-300 mb-2 font-semibold">AI Gold</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => handleAddGold('ai', 25)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +25
                </button>
                <button
                  onClick={() => handleAddGold('ai', 50)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +50
                </button>
                <button
                  onClick={() => handleAddGold('ai', 100)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded border border-green-400 transition-all text-sm"
                >
                  +100
                </button>
                <button
                  onClick={() => setScores(prev => ({ ...prev, ai: 0 }))}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded border border-red-400 transition-all text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Custom Gold */}
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="number"
                value={customGold}
                onChange={(e) => setCustomGold(e.target.value)}
                placeholder="Custom gold amount"
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border-2 border-gray-600 focus:border-green-400 outline-none"
              />
              <button
                onClick={() => handleCustomGold('player')}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg border-2 border-green-400 transition-all"
              >
                Add to Player
              </button>
              <button
                onClick={() => handleCustomGold('ai')}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg border-2 border-green-400 transition-all"
              >
                Add to AI
              </button>
            </div>
          </div>
        </div>

        {/* Abilities Controls */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-purple-600 mb-4">
          <h3 className="text-xl font-bold text-purple-400 mb-3">⚡ Abilities</h3>
          <div className="space-y-2">
            <button
              onClick={handleUnlockAllAbilities}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg border-2 border-purple-400 transition-all"
            >
              🔓 Unlock All Abilities
            </button>
            <div className="text-sm text-gray-400">
              Current: {abilities.unlockedAbilities.length} / {getImplementedAbilities().length} unlocked (implemented only)
            </div>
          </div>
        </div>

        {/* Auto Win Controls */}
        <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 border-amber-600 mb-4">
          <h3 className="text-xl font-bold text-amber-400 mb-3">🏆 Game Controls</h3>
          <div className="space-y-2">
            <button
              onClick={onAutoWin}
              disabled={gameOver}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all font-bold ${
                gameOver
                  ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 hover:scale-105'
              }`}
            >
              ⚡ Instant Win (GIN)
            </button>
            <div className="text-sm text-gray-400">
              {gameOver
                ? 'Round is over - start a new round first'
                : 'Instantly win the current round with perfect GIN hand (0 deadwood)'}
            </div>
            <div className="text-xs text-amber-300 bg-amber-900 bg-opacity-30 p-2 rounded border border-amber-700">
              💡 Use this to quickly test progression rewards, XP gain, and Challenge Mode tier advancement
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border-2 border-red-600">
          <h3 className="text-xl font-bold text-red-400 mb-3">⚠️ Danger Zone</h3>
          <button
            onClick={handleResetProgression}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg border-2 border-red-400 transition-all font-bold"
          >
            🔄 Reset All Progression
          </button>
          <p className="text-red-300 text-sm mt-2 text-center">
            This will delete all saved progression data and reload the page
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600
                     text-white rounded-lg font-bold text-lg border-2 border-gray-400 transition-all transform hover:scale-105"
          >
            Close Debug Tools
          </button>
        </div>
      </div>
    </div>
  );
};

DebugModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  progression: PropTypes.object.isRequired,
  abilities: PropTypes.object.isRequired,
  scores: PropTypes.shape({
    player: PropTypes.number.isRequired,
    ai: PropTypes.number.isRequired
  }).isRequired,
  setScores: PropTypes.func.isRequired,
  onAutoWin: PropTypes.func.isRequired,
  gameOver: PropTypes.bool.isRequired
};

export default DebugModal;
