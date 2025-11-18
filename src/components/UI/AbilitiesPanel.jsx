import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getAbilityById } from '../../utils/abilitiesUtils';

/**
 * AbilitiesPanel Component
 * Displays equipped active abilities with use buttons
 *
 * @param {Array} equippedAbilities - Array of equipped ability IDs
 * @param {Object} abilityUses - Object tracking ability uses
 * @param {Function} onUseAbility - Callback when ability is used
 * @param {Function} onOpenShop - Callback to open abilities shop
 */
const AbilitiesPanel = ({ equippedAbilities, abilityUses, onUseAbility, onOpenShop }) => {
  if (equippedAbilities.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <motion.button
          onClick={onOpenShop}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg border-2 border-purple-400 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg mr-1">⚡</span>
          Abilities
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border-2 border-purple-500 shadow-lg">
        <div className="text-purple-300 font-bold text-sm mb-2 text-center">
          ⚡ ABILITIES
        </div>

        <div className="space-y-2">
          {equippedAbilities.map(abilityId => {
            const ability = getAbilityById(abilityId);
            if (!ability) return null;

            const uses = abilityUses[abilityId] || 0;
            const maxUses = ability.usesPerRound || ability.usesPerMatch || 0;
            const remainingUses = maxUses - uses;
            const canUse = remainingUses > 0;

            return (
              <motion.button
                key={abilityId}
                onClick={() => canUse && onUseAbility(abilityId)}
                disabled={!canUse}
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                  canUse
                    ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white cursor-pointer'
                    : 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-50'
                }`}
                whileHover={canUse ? { scale: 1.05 } : {}}
                whileTap={canUse ? { scale: 0.95 } : {}}
                title={ability.description}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{ability.icon}</span>
                    <span className="text-xs font-semibold">{ability.name}</span>
                  </div>
                  {maxUses > 0 && (
                    <span className="text-xs font-bold">
                      {remainingUses}/{maxUses}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Shop Button */}
        <motion.button
          onClick={onOpenShop}
          className="w-full mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold rounded border border-gray-600 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Manage Abilities
        </motion.button>
      </div>
    </div>
  );
};

AbilitiesPanel.propTypes = {
  equippedAbilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  abilityUses: PropTypes.object.isRequired,
  onUseAbility: PropTypes.func.isRequired,
  onOpenShop: PropTypes.func.isRequired
};

export default AbilitiesPanel;
