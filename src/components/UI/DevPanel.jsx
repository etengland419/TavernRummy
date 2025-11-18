import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ABILITIES,
  ACTIVE_ABILITIES,
  PASSIVE_ABILITIES
} from '../../utils/abilitiesUtils';

const DevPanel = ({
  unlockedAbilities,
  onUnlockActiveAbility,
  onUpgradePassiveAbility,
  onResetAbilities
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg border-2 border-red-400 transition-all shadow-lg"
      >
        {isOpen ? '✕ Close Dev' : '🔧 Dev Panel'}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-2 bg-gray-900 rounded-lg border-4 border-red-600 p-4 shadow-2xl max-w-md max-h-96 overflow-y-auto"
          >
            <div className="text-red-400 font-bold mb-3 text-center border-b-2 border-red-600 pb-2">
              🔧 DEVELOPER TOOLS
            </div>

            {/* Active Abilities */}
            <div className="mb-4">
              <div className="text-red-300 text-sm font-semibold mb-2">ACTIVE ABILITIES</div>
              <div className="space-y-2">
                {Object.values(ACTIVE_ABILITIES).slice(0, 3).map(abilityId => {
                  const ability = ABILITIES[abilityId];
                  const isUnlocked = unlockedAbilities.active?.includes(abilityId);

                  return (
                    <button
                      key={abilityId}
                      onClick={() => !isUnlocked && onUnlockActiveAbility(abilityId)}
                      disabled={isUnlocked}
                      className={`
                        w-full px-3 py-2 rounded border-2 text-left text-sm
                        ${isUnlocked
                          ? 'bg-green-700 border-green-500 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600 border-gray-500 cursor-pointer'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ability.icon}</span>
                          <span className="text-white">{ability.name}</span>
                        </div>
                        {isUnlocked && <span className="text-green-300">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passive Abilities */}
            <div className="mb-4">
              <div className="text-red-300 text-sm font-semibold mb-2">PASSIVE ABILITIES</div>
              <div className="space-y-2">
                {[PASSIVE_ABILITIES.LUCKY_DRAW, PASSIVE_ABILITIES.QUICK_HANDS].map(abilityId => {
                  const ability = ABILITIES[abilityId];
                  const currentLevel = unlockedAbilities.passive?.[abilityId] || 0;

                  return (
                    <div key={abilityId} className="bg-gray-700 border-2 border-gray-500 rounded px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ability.icon}</span>
                          <span className="text-white text-sm">{ability.name}</span>
                        </div>
                        <span className="text-purple-300 text-sm">
                          Lv {currentLevel}/{ability.maxLevel}
                        </span>
                      </div>
                      <button
                        onClick={() => currentLevel < ability.maxLevel && onUpgradePassiveAbility(abilityId)}
                        disabled={currentLevel >= ability.maxLevel}
                        className={`
                          w-full px-2 py-1 rounded text-xs
                          ${currentLevel < ability.maxLevel
                            ? 'bg-purple-600 hover:bg-purple-500 cursor-pointer'
                            : 'bg-gray-600 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        {currentLevel < ability.maxLevel ? 'Upgrade' : 'Max Level'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetAbilities}
              className="w-full px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded border-2 border-red-500 transition-all"
            >
              Reset All Abilities
            </button>

            {/* Info */}
            <div className="mt-3 text-xs text-gray-400 text-center">
              This panel is for testing only
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

DevPanel.propTypes = {
  unlockedAbilities: PropTypes.shape({
    active: PropTypes.arrayOf(PropTypes.string),
    passive: PropTypes.object
  }).isRequired,
  onUnlockActiveAbility: PropTypes.func.isRequired,
  onUpgradePassiveAbility: PropTypes.func.isRequired,
  onResetAbilities: PropTypes.func.isRequired
};

export default DevPanel;
