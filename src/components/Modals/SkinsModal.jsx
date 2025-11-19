import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { SKIN_DEFINITIONS } from '../../utils/skinsUtils';
import PlayingCard from '../UI/PlayingCard';

/**
 * SkinsModal Component
 * Allows players to view, select, and purchase card skins
 */
const SkinsModal = ({
  show,
  onClose,
  activeSkin,
  unlockedSkins,
  playerGold,
  onSelectSkin,
  onUnlockSkin
}) => {
  const [selectedPreview, setSelectedPreview] = useState(activeSkin);
  const [notification, setNotification] = useState(null);

  if (!show) return null;

  // Sample card for preview
  const previewCard = {
    suit: '⚔️',
    rank: 'K',
    value: 10,
    id: 'preview-card'
  };

  const handleSelectSkin = (skinId) => {
    const skin = SKIN_DEFINITIONS[skinId];

    // Check if skin is unlocked
    const isUnlocked = skin.unlocked || unlockedSkins[skinId];

    if (!isUnlocked) {
      // Try to purchase
      if (playerGold >= skin.cost) {
        const result = onUnlockSkin(skinId, playerGold);
        if (result.success) {
          setNotification(`🎉 Unlocked ${skin.name}!`);
          setTimeout(() => setNotification(null), 3000);
          onSelectSkin(skinId);
          setSelectedPreview(skinId);
        }
      } else {
        setNotification(`❌ Not enough gold! Need ${skin.cost - playerGold} more.`);
        setTimeout(() => setNotification(null), 3000);
      }
    } else {
      // Skin is unlocked, just activate it
      onSelectSkin(skinId);
      setSelectedPreview(skinId);
      setNotification(`✅ ${skin.name} activated!`);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 mb-2">🎨 Card Skins</h2>
            <p className="text-amber-200">Customize your cards with unique themes</p>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 text-xl font-bold mb-1">💰 {playerGold} Gold</div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg border-2 border-red-400 transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-amber-800 border-2 border-amber-500 rounded-lg text-center text-white font-bold"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Section */}
        <div className="mb-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg border-2 border-amber-700">
          <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">Preview</h3>
          <div className="flex justify-center gap-6 items-center">
            <div className="text-center">
              <p className="text-amber-200 mb-2 text-sm">Front</p>
              <PlayingCard
                card={previewCard}
                skinId={selectedPreview}
                onClick={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="text-amber-200 mb-2 text-sm">Back</p>
              <PlayingCard
                card={previewCard}
                skinId={selectedPreview}
                hidden={true}
                onClick={() => {}}
              />
            </div>
          </div>
          <p className="text-center text-amber-300 mt-4 font-bold">
            {SKIN_DEFINITIONS[selectedPreview].name}
          </p>
          <p className="text-center text-amber-200 text-sm">
            {SKIN_DEFINITIONS[selectedPreview].description}
          </p>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SKIN_DEFINITIONS).map(skin => {
            const isUnlocked = skin.unlocked || unlockedSkins[skin.id];
            const isActive = activeSkin === skin.id;
            const isSelected = selectedPreview === skin.id;
            const canAfford = playerGold >= skin.cost;

            return (
              <motion.div
                key={skin.id}
                whileHover={{ scale: 1.05 }}
                className={`
                  p-4 rounded-lg border-4 cursor-pointer transition-all
                  ${isActive ? 'border-green-500 bg-green-900 bg-opacity-30' : ''}
                  ${isSelected && !isActive ? 'border-blue-500 bg-blue-900 bg-opacity-20' : ''}
                  ${!isActive && !isSelected ? 'border-amber-700 bg-gray-800 bg-opacity-30' : ''}
                  ${!isUnlocked && !canAfford ? 'opacity-60' : ''}
                `}
                onClick={() => {
                  setSelectedPreview(skin.id);
                }}
                onDoubleClick={() => handleSelectSkin(skin.id)}
              >
                {/* Skin Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{skin.icon}</div>
                  {isActive && (
                    <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                      ACTIVE
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold">
                      🔒 {skin.cost} Gold
                    </div>
                  )}
                  {isUnlocked && !isActive && (
                    <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">
                      UNLOCKED
                    </div>
                  )}
                </div>

                {/* Skin Info */}
                <h4 className="text-lg font-bold text-amber-300 mb-2">{skin.name}</h4>
                <p className="text-amber-200 text-sm mb-4">{skin.description}</p>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSkin(skin.id);
                  }}
                  className={`
                    w-full py-2 rounded-lg border-2 font-bold transition-all
                    ${isActive
                      ? 'bg-green-700 border-green-500 text-white cursor-default'
                      : isUnlocked
                        ? 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white'
                        : canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  disabled={isActive || (!isUnlocked && !canAfford)}
                >
                  {isActive
                    ? '✓ Currently Using'
                    : isUnlocked
                      ? 'Activate'
                      : canAfford
                        ? `Unlock for ${skin.cost} Gold`
                        : `Need ${skin.cost - playerGold} More Gold`
                  }
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border-2 border-blue-700 rounded-lg">
          <p className="text-blue-200 text-sm text-center">
            💡 <strong>Tip:</strong> Click a skin to preview it, then click the button to activate or unlock it.
            Double-click to instantly select!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

SkinsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activeSkin: PropTypes.string.isRequired,
  unlockedSkins: PropTypes.object.isRequired,
  playerGold: PropTypes.number.isRequired,
  onSelectSkin: PropTypes.func.isRequired,
  onUnlockSkin: PropTypes.func.isRequired
};

export default SkinsModal;
