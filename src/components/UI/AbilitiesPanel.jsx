import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ABILITIES
} from '../../utils/abilitiesUtils';

const AbilitiesPanel = ({
  unlockedAbilities,
  equippedAbilities,
  abilityUses,
  onUseAbility,
  disabled = false,
  getMeldMasterLevel
}) => {
  const [hoveredAbility, setHoveredAbility] = useState(null);
  const [isPassivesMinimized, setIsPassivesMinimized] = useState(false);

  // Safety check: if unlockedAbilities is undefined, don't render anything
  if (!unlockedAbilities) {
    return null;
  }

  // Get active abilities (only show equipped ones that are not passive)
  const activeAbilities = (equippedAbilities || []).filter(abilityId => {
    const ability = ABILITIES[abilityId];
    return ability && !ability.passive;
  });

  // Get passive active abilities (Shield, Phoenix Revival)
  const passiveActiveAbilities = (equippedAbilities || []).filter(abilityId => {
    const ability = ABILITIES[abilityId];
    return ability && ability.passive;
  });

  // Get passive abilities with levels
  const passiveAbilities = Object.entries(unlockedAbilities.passive || {})
    .filter(([_, level]) => level > 0)
    .map(([abilityId, level]) => ({ id: abilityId, level }));

  if (activeAbilities.length === 0 && passiveAbilities.length === 0 && passiveActiveAbilities.length === 0) {
    return null; // Don't show panel if no abilities
  }

  const canUseAbility = (abilityId) => {
    const ability = ABILITIES[abilityId];
    if (!ability) return false;

    const currentUses = abilityUses[abilityId] || 0;

    if (ability.usesPerRound !== undefined) {
      return currentUses < ability.usesPerRound;
    }

    if (ability.usesPerMatch !== undefined) {
      return currentUses < ability.usesPerMatch;
    }

    if (ability.usesPerSession !== undefined) {
      return currentUses < ability.usesPerSession;
    }

    return true;
  };

  return (
    <div className="fixed bottom-4 right-4 z-30 max-w-xs">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-amber-900 to-gray-900 rounded-lg border-4 border-amber-600 shadow-2xl"
      >
        {/* Active Abilities - Always Shown */}
        {activeAbilities.length > 0 && (
          <div className="p-3 border-b-2 border-amber-600">
            <div className="text-amber-300 text-xs font-semibold mb-2">⚔️ ACTIVE</div>
            <div className="space-y-2">
              {activeAbilities.map(abilityId => {
                const ability = ABILITIES[abilityId];
                if (!ability) return null;

                const isAvailable = canUseAbility(abilityId);

                return (
                  <motion.button
                    key={abilityId}
                    onClick={() => !disabled && isAvailable && onUseAbility(abilityId)}
                    onMouseEnter={() => setHoveredAbility(abilityId)}
                    onMouseLeave={() => setHoveredAbility(null)}
                    disabled={disabled || !isAvailable}
                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    className={`
                      w-full px-2 py-2 rounded-lg border-2 transition-all text-left
                      ${isAvailable
                        ? 'bg-amber-700 hover:bg-amber-600 border-amber-500 cursor-pointer'
                        : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-3xl">{ability.icon}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Passive Abilities - Toggleable */}
        {(passiveAbilities.length > 0 || passiveActiveAbilities.length > 0) && (
          <div>
            <div
              className="flex justify-between items-center p-3 border-b-2 border-amber-600 cursor-pointer"
              onClick={() => setIsPassivesMinimized(!isPassivesMinimized)}
            >
              <div className="text-purple-300 text-xs font-semibold">
                🛡️ PASSIVE
              </div>
              <button
                className="text-purple-300 hover:text-purple-200 transition-colors text-lg font-bold"
                aria-label={isPassivesMinimized ? "Expand passive abilities" : "Minimize passive abilities"}
              >
                {isPassivesMinimized ? '▲' : '▼'}
              </button>
            </div>

            {!isPassivesMinimized && (
              <div className="p-3 space-y-2 max-h-[40vh] overflow-y-auto">
                {/* Passive Active Abilities (Shield, Phoenix Revival) */}
                {passiveActiveAbilities.map(abilityId => {
                  const ability = ABILITIES[abilityId];
                  if (!ability) return null;

                  return (
                    <div
                      key={abilityId}
                      onMouseEnter={() => setHoveredAbility(abilityId)}
                      onMouseLeave={() => setHoveredAbility(null)}
                      className="px-2 py-2 rounded-lg border-2 bg-purple-800 border-purple-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ability.icon}</span>
                          <div>
                            <div className="text-white text-xs font-semibold">{ability.name}</div>
                            <div className="text-purple-200 text-xs">
                              Always Active
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Regular Passive Abilities */}
                {passiveAbilities.map(({ id: abilityId, level }) => {
                  const ability = ABILITIES[abilityId];
                  if (!ability) return null;

                  return (
                    <div
                      key={abilityId}
                      onMouseEnter={() => setHoveredAbility(abilityId)}
                      onMouseLeave={() => setHoveredAbility(null)}
                      className="px-2 py-2 rounded-lg border-2 bg-purple-800 border-purple-600"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{ability.icon}</span>
                          <div>
                            <div className="text-white text-xs font-semibold">{ability.name}</div>
                            <div className="text-purple-200 text-xs">
                              Level {level}/{ability.maxLevel}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredAbility && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-full mr-4 top-0 w-64 bg-gray-900 border-2 border-amber-600 rounded-lg p-3 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{ABILITIES[hoveredAbility].icon}</span>
                <div className="text-amber-400 font-bold text-lg">
                  {ABILITIES[hoveredAbility].name}
                </div>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                {ABILITIES[hoveredAbility].detailedDescription}
              </div>
              <div className="mt-2 text-amber-300 text-xs font-semibold">
                Cost: {ABILITIES[hoveredAbility].cost || ABILITIES[hoveredAbility].costPerLevel} AP
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

AbilitiesPanel.propTypes = {
  unlockedAbilities: PropTypes.shape({
    active: PropTypes.arrayOf(PropTypes.string),
    passive: PropTypes.object
  }),
  equippedAbilities: PropTypes.arrayOf(PropTypes.string),
  abilityUses: PropTypes.object.isRequired,
  onUseAbility: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  getMeldMasterLevel: PropTypes.func
};

export default AbilitiesPanel;
