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

  const getRemainingUses = (abilityId) => {
    const ability = ABILITIES[abilityId];
    if (!ability) return 0;

    const currentUses = abilityUses[abilityId] || 0;

    if (ability.usesPerRound !== undefined) {
      return ability.usesPerRound - currentUses;
    }

    if (ability.usesPerMatch !== undefined) {
      return ability.usesPerMatch - currentUses;
    }

    if (ability.usesPerSession !== undefined) {
      return ability.usesPerSession - currentUses;
    }

    return 0;
  };

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
    <div className="fixed bottom-4 right-4 z-30">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-amber-900 to-gray-900 rounded-lg border-4 border-amber-600 shadow-2xl"
      >
        {/* Active Abilities - Always Shown */}
        {activeAbilities.length > 0 && (
          <div className="p-3 border-b-2 border-amber-600">
            <div className="text-amber-300 text-xs font-semibold mb-2">⚔️ ACTIVE</div>
            <div className="flex gap-2">
              {activeAbilities.map(abilityId => {
                const ability = ABILITIES[abilityId];
                if (!ability) return null;

                const isAvailable = canUseAbility(abilityId);
                const remainingUses = getRemainingUses(abilityId);

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
                      relative px-3 py-2 rounded-lg border-2 transition-all
                      ${isAvailable
                        ? 'bg-amber-700 hover:bg-amber-600 border-amber-500 cursor-pointer'
                        : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="text-2xl">{ability.icon}</span>
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                      {remainingUses}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Passive Abilities */}
        {(passiveAbilities.length > 0 || passiveActiveAbilities.length > 0) && (
          <div className="p-3">
            <div className="text-purple-300 text-xs font-semibold mb-2">🛡️ PASSIVE</div>
            <div className="flex gap-2 flex-wrap">
              {/* Passive Active Abilities (Shield, Phoenix Revival) */}
              {passiveActiveAbilities.map(abilityId => {
                const ability = ABILITIES[abilityId];
                if (!ability) return null;

                return (
                  <div
                    key={abilityId}
                    onMouseEnter={() => setHoveredAbility(abilityId)}
                    onMouseLeave={() => setHoveredAbility(null)}
                    className="relative px-3 py-2 rounded-lg border-2 bg-purple-800 border-purple-600"
                  >
                    <span className="text-2xl">{ability.icon}</span>
                    <div className="absolute -top-1 -right-1 bg-purple-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                      ✓
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
                    className="relative px-3 py-2 rounded-lg border-2 bg-purple-800 border-purple-600"
                  >
                    <span className="text-2xl">{ability.icon}</span>
                    <div className="absolute -top-1 -right-1 bg-purple-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                      {level}
                    </div>
                  </div>
                );
              })}
            </div>
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
