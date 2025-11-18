import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * ShopModal Component
 * DEMO/TEMP - Prestige shop for cosmetics and unlocks
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onClose - Callback when closing
 * @param {number} prestigePoints - Current prestige points
 */
const ShopModal = ({ show, onClose, prestigePoints = 0 }) => {
  const [selectedTab, setSelectedTab] = useState('skins');

  if (!show) return null;

  // Demo shop items (will be implemented in future)
  const shopItems = {
    skins: [
      { id: 'gothic', name: 'Gothic Cards', cost: 1, icon: '🦇', description: 'Dark and mysterious card design', owned: false },
      { id: 'steampunk', name: 'Steampunk Cards', cost: 1, icon: '⚙️', description: 'Brass and gears aesthetic', owned: false },
      { id: 'fantasy', name: 'Fantasy Cards', cost: 1, icon: '🐉', description: 'Dragons and magic themed', owned: false },
      { id: 'pixel', name: 'Pixel Art Cards', cost: 1, icon: '🎮', description: 'Retro 8-bit style', owned: false },
    ],
    personalities: [
      { id: 'merchant', name: 'The Merchant', cost: 2, icon: '💰', description: 'Greedy and calculating', owned: false },
      { id: 'knight', name: 'The Knight', cost: 2, icon: '⚔️', description: 'Honorable and tactical', owned: false },
      { id: 'assassin', name: 'The Assassin', cost: 2, icon: '🗡️', description: 'Silent and deadly', owned: false },
      { id: 'rogue', name: 'The Rogue', cost: 2, icon: '🎭', description: 'Cunning and unpredictable', owned: false },
    ],
    upgrades: [
      { id: 'lighting', name: 'Better Lighting', cost: 3, icon: '💡', description: 'Enhanced visual effects', owned: false },
      { id: 'animations', name: 'Smooth Animations', cost: 3, icon: '✨', description: 'Silky smooth card movements', owned: false },
      { id: 'sounds', name: 'Premium Sounds', cost: 3, icon: '🔊', description: 'High quality audio effects', owned: false },
    ],
    modes: [
      { id: 'speed', name: 'Speed Rummy', cost: 5, icon: '⚡', description: '30 second turn limit', owned: false, locked: true },
      { id: 'bigin', name: 'Big Gin Mode', cost: 5, icon: '💎', description: 'Higher bonuses, tougher rules', owned: false, locked: true },
      { id: 'team', name: 'Team Mode', cost: 5, icon: '👥', description: '2v2 multiplayer', owned: false, locked: true },
    ],
  };

  const tabs = [
    { id: 'skins', name: '🎨 Card Skins', count: 4 },
    { id: 'personalities', name: '🎭 AI Opponents', count: 4 },
    { id: 'upgrades', name: '🏰 Tavern Upgrades', count: 3 },
    { id: 'modes', name: '📜 Game Modes', count: 3 },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-amber-900 to-gray-900 p-6 rounded-lg border-4 border-amber-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-amber-400">🏪 Prestige Shop</h2>
            <p className="text-amber-300 text-sm mt-1">DEMO - Coming in future update!</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Your Prestige Points</div>
            <div className="text-3xl font-bold text-purple-400">⭐ {prestigePoints}</div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border-2 border-blue-500 mb-6">
          <p className="text-blue-200 text-center">
            💡 <strong>Demo Preview:</strong> This shop is a preview of the upcoming Prestige system.
            Items shown are not yet available for purchase. Stay tuned for future updates!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedTab === tab.id
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.name}
              <span className="ml-2 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {shopItems[selectedTab].map(item => (
            <div
              key={item.id}
              className={`bg-gray-800 bg-opacity-70 p-4 rounded-lg border-2 ${
                item.locked
                  ? 'border-gray-600 opacity-50'
                  : item.owned
                  ? 'border-green-500'
                  : 'border-gray-600 hover:border-amber-500'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                {item.locked && (
                  <span className="text-2xl">🔒</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-purple-400 font-bold">
                  ⭐ {item.cost} PP
                </div>
                <button
                  disabled={true}
                  className="px-4 py-2 bg-gray-700 text-gray-500 rounded-lg border-2 border-gray-600 cursor-not-allowed text-sm"
                >
                  {item.locked ? 'Locked' : item.owned ? 'Owned' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-amber-900 bg-opacity-30 border-2 border-amber-700 rounded-lg p-4 mb-6">
          <h3 className="text-amber-300 font-bold mb-2">💡 How to Earn Prestige Points:</h3>
          <ul className="text-amber-200 text-sm space-y-1 ml-4">
            <li>• Reach Level milestones (every 5 levels)</li>
            <li>• Complete special achievements</li>
            <li>• Win Challenge Mode streaks</li>
            <li>• Complete Campaign taverns (coming soon)</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 rounded-lg border-2 border-amber-400 font-bold text-gray-900 transition-all transform hover:scale-105"
        >
          Close Shop
        </button>
      </motion.div>
    </div>
  );
};

ShopModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  prestigePoints: PropTypes.number
};

export default ShopModal;
