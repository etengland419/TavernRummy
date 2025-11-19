import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ABILITY_TYPES,
  getImplementedAbilities,
  getAbilityUpgradeCost,
  canAffordAbility,
  MAX_EQUIPPED_ABILITIES
} from '../../utils/abilitiesUtils';

/**
 * AbilitiesShopModal Component
 * Allows players to unlock, upgrade, and equip abilities
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onClose - Callback when modal is closed
 * @param {Object} abilities - Abilities hook object
 * @param {Object} progression - Progression hook object
 */
const AbilitiesShopModal = ({ show, onClose, abilities, progression }) => {
  const [selectedTab, setSelectedTab] = useState('active'); // 'active' or 'passive'
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  if (!show) return null;

  const showFeedback = (message, isError = false) => {
    setFeedbackMessage({ text: message, isError });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const implementedAbilities = getImplementedAbilities();
  const activeAbilities = implementedAbilities.filter(a => a.type === ABILITY_TYPES.ACTIVE);
  const passiveAbilities = implementedAbilities.filter(a => a.type === ABILITY_TYPES.PASSIVE);

  const displayAbilities = selectedTab === 'active' ? activeAbilities : passiveAbilities;

  const handleUnlockAbility = (abilityId) => {
    // Get current level and cost
    const currentLevel = abilities.getAbilityLevel(abilityId);
    const cost = getAbilityUpgradeCost(abilityId, currentLevel);

    // Try to spend AP
    const spendSuccess = progression.spendAP(cost);
    if (!spendSuccess) {
      return; // Not enough AP
    }

    // Unlock/upgrade the ability
    const unlockSuccess = abilities.unlockAbility(abilityId);

    if (!unlockSuccess) {
      // Refund AP if unlock failed
      progression.refundAP(cost);
      return;
    }

    // Don't auto-equip - let the user manually equip abilities they want to use
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-lg border-4 border-purple-500 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-4 border-b-2 border-purple-500">
          <h2 className="text-3xl font-bold text-purple-200 text-center">⚡ Abilities Shop</h2>
          <p className="text-center text-purple-300 text-sm mt-1">
            Unlock and upgrade powerful abilities
          </p>

          {/* AP Display */}
          <div className="mt-3 bg-black bg-opacity-40 rounded-lg p-2 text-center">
            <span className="text-purple-200 font-semibold">Available Ability Points: </span>
            <span className="text-yellow-400 font-bold text-lg">⚡ {progression.abilityPoints} AP</span>
          </div>

          {/* Equipped Abilities Counter */}
          <div className="mt-2 text-center text-sm text-purple-200">
            Equipped: <span className="font-bold text-amber-400">{abilities.equippedAbilities.length}/{MAX_EQUIPPED_ABILITIES}</span> active abilities
          </div>

          {/* Feedback Message */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-2 p-2 rounded-lg text-center font-semibold text-sm ${
                  feedbackMessage.isError
                    ? 'bg-red-900 border-2 border-red-500 text-red-200'
                    : 'bg-green-900 border-2 border-green-500 text-green-200'
                }`}
              >
                {feedbackMessage.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-purple-700">
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-3 font-semibold transition-all ${
              selectedTab === 'active'
                ? 'bg-purple-700 text-white border-b-4 border-purple-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ⚔️ Active Abilities ({activeAbilities.length})
          </button>
          <button
            onClick={() => setSelectedTab('passive')}
            className={`flex-1 py-3 font-semibold transition-all ${
              selectedTab === 'passive'
                ? 'bg-purple-700 text-white border-b-4 border-purple-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🛡️ Passive Abilities ({passiveAbilities.length})
          </button>
        </div>

        {/* Abilities List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {displayAbilities.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg">No abilities available yet!</p>
              <p className="text-sm mt-2">Check back in future updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayAbilities.map(ability => {
                const isUnlocked = abilities.isAbilityUnlocked(ability.id);
                const currentLevel = abilities.getAbilityLevel(ability.id);
                const isEquipped = abilities.equippedAbilities.includes(ability.id);

                let cost = ability.cost;
                let buttonText = `Unlock (${cost} AP)`;
                let canAfford = canAffordAbility(progression.abilityPoints, ability.id, currentLevel);

                if (ability.type === ABILITY_TYPES.PASSIVE && isUnlocked) {
                  const upgradeCost = getAbilityUpgradeCost(ability.id, currentLevel);
                  if (upgradeCost > 0) {
                    cost = upgradeCost;
                    buttonText = `Upgrade to Lv ${currentLevel + 1} (${cost} AP)`;
                    canAfford = canAffordAbility(progression.abilityPoints, ability.id, currentLevel);
                  } else {
                    buttonText = 'MAX LEVEL';
                    canAfford = false;
                  }
                }

                return (
                  <motion.div
                    key={ability.id}
                    className={`bg-gray-800 rounded-lg p-4 border-2 ${
                      isEquipped
                        ? 'border-green-400'
                        : isUnlocked
                        ? 'border-purple-400'
                        : 'border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl">{ability.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold text-purple-200">
                              {ability.name}
                              {ability.type === ABILITY_TYPES.PASSIVE && isUnlocked && (
                                <span className="ml-2 text-sm text-yellow-400">Lv {currentLevel}</span>
                              )}
                            </h3>
                            {isEquipped && (
                              <span className="text-xs text-green-400 font-semibold">✓ EQUIPPED</span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-2">{ability.description}</p>

                        {ability.type === ABILITY_TYPES.ACTIVE && (
                          <div className="text-xs text-purple-300">
                            {ability.usesPerRound && `${ability.usesPerRound} use per round`}
                            {ability.usesPerMatch && `${ability.usesPerMatch} uses per match`}
                          </div>
                        )}

                        {ability.type === ABILITY_TYPES.PASSIVE && ability.levels && (
                          <div className="mt-2 space-y-1">
                            {ability.levels.map(level => (
                              <div
                                key={level.level}
                                className={`text-xs ${
                                  level.level <= currentLevel
                                    ? 'text-green-400 font-semibold'
                                    : 'text-gray-500'
                                }`}
                              >
                                Lv {level.level}: {level.effect}
                                {level.level <= currentLevel && ' ✓'}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="ml-4">
                        {(!isUnlocked || (ability.type === ABILITY_TYPES.PASSIVE && currentLevel < ability.maxLevel)) && (
                          <button
                            onClick={() => handleUnlockAbility(ability.id)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              canAfford
                                ? 'bg-purple-600 hover:bg-purple-500 text-white border-2 border-purple-400'
                                : 'bg-gray-700 text-gray-500 border-2 border-gray-600 cursor-not-allowed'
                            }`}
                          >
                            {buttonText}
                          </button>
                        )}

                        {isUnlocked && ability.type === ABILITY_TYPES.ACTIVE && (
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-sm">UNLOCKED</div>
                            {isEquipped ? (
                              <button
                                onClick={() => abilities.unequipAbility(ability.id)}
                                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded border-2 border-red-400"
                              >
                                Unequip
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const result = abilities.equipAbility(ability.id);
                                  if (!result.success) {
                                    showFeedback(result.reason, true);
                                  } else {
                                    showFeedback(`${ability.name} equipped!`, false);
                                  }
                                }}
                                className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded border-2 border-green-400"
                              >
                                Equip
                              </button>
                            )}
                          </div>
                        )}

                        {isUnlocked && ability.type === ABILITY_TYPES.PASSIVE && currentLevel >= ability.maxLevel && (
                          <div className="text-yellow-400 font-bold text-sm">MAX LEVEL</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 border-t-2 border-purple-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg border-2 border-purple-400 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

AbilitiesShopModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  abilities: PropTypes.object.isRequired,
  progression: PropTypes.object.isRequired
};

export default AbilitiesShopModal;
