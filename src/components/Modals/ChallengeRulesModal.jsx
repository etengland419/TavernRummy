import React from 'react';
import PropTypes from 'prop-types';

/**
 * ChallengeRulesModal Component
 * Displays rules and information about Challenge Mode (Roguelite mode)
 *
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onClose - Callback when closing
 */
const ChallengeRulesModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-400">⚔️ Challenge Mode Guide</h2>
          <button
            onClick={onClose}
            className="text-3xl text-amber-400 hover:text-amber-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Introduction */}
        <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border-2 border-red-700 mb-6">
          <p className="text-amber-100 text-center italic">
            "Welcome, brave challenger, to the ultimate test of skill! Challenge Mode is where legends are forged..."
          </p>
        </div>

        {/* What is Challenge Mode */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">📖 What is Challenge Mode?</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-100 mb-3">
              Challenge Mode is the <strong className="text-yellow-300">Endless Roguelite</strong> version of Tavern Rummy.
              Battle through increasingly difficult AI tiers while earning experience, leveling up, and unlocking powerful abilities!
            </p>
            <ul className="list-disc list-inside space-y-2 text-amber-100">
              <li><strong className="text-red-400">Endless Progression:</strong> Win streaks unlock harder AI tiers every 5 wins!</li>
              <li><strong className="text-purple-400">8 Difficulty Tiers:</strong> Easy → Medium → Hard → Expert → Master → Legendary → Nightmare → Infinite</li>
              <li><strong className="text-blue-400">No Strategy Tips:</strong> You're on your own - true mastery required!</li>
              <li><strong className="text-yellow-400">XP & Abilities Essential:</strong> Level up and unlock abilities to survive higher tiers!</li>
            </ul>
          </div>
        </div>

        {/* Endless Progression System */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">♾️ Endless Progression System</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-100 mb-3">
              Build your win streak to face increasingly powerful opponents:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-green-900 bg-opacity-30 p-2 rounded border border-green-600">
                <p className="text-green-300 text-sm"><strong>🌱 Wins 0-4: Novice (Easy)</strong></p>
              </div>
              <div className="bg-green-900 bg-opacity-30 p-2 rounded border border-green-600">
                <p className="text-green-300 text-sm"><strong>⚔️ Wins 5-9: Apprentice (Medium)</strong></p>
              </div>
              <div className="bg-yellow-900 bg-opacity-30 p-2 rounded border border-yellow-600">
                <p className="text-yellow-300 text-sm"><strong>🛡️ Wins 10-14: Veteran (Hard)</strong></p>
              </div>
              <div className="bg-orange-900 bg-opacity-30 p-2 rounded border border-orange-600">
                <p className="text-orange-300 text-sm"><strong>🔥 Wins 15-19: Expert</strong></p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-2 rounded border border-purple-600">
                <p className="text-purple-300 text-sm"><strong>⭐ Wins 20-24: Master</strong></p>
              </div>
              <div className="bg-pink-900 bg-opacity-30 p-2 rounded border border-pink-600">
                <p className="text-pink-300 text-sm"><strong>👑 Wins 25-29: Legendary</strong></p>
              </div>
              <div className="bg-red-900 bg-opacity-30 p-2 rounded border border-red-600">
                <p className="text-red-300 text-sm"><strong>💀 Wins 30-34: Nightmare</strong></p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 p-2 rounded border border-gray-500">
                <p className="text-gray-300 text-sm"><strong>♾️ Wins 35+: Infinite (Max)</strong></p>
              </div>
            </div>

            <div className="mt-4 bg-red-900 bg-opacity-30 p-3 rounded border border-red-600">
              <p className="text-red-200 text-sm">
                <strong>⚠️ Warning:</strong> Losing a game resets your win streak to 0! How far can you push your limits?
              </p>
            </div>
          </div>
        </div>

        {/* Leveling System */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">⭐ Leveling & XP System</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-100 mb-3">
              Every round you play in Challenge Mode earns you <strong className="text-blue-400">Experience Points (XP)</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900 bg-opacity-30 p-3 rounded border border-green-600">
                <h4 className="font-bold text-green-300 mb-2">🏆 Victory Rewards</h4>
                <ul className="text-amber-100 text-sm space-y-1">
                  <li>• Base Win: <strong className="text-yellow-300">50 XP</strong></li>
                  <li>• GIN Bonus: <strong className="text-yellow-300">+30 XP</strong></li>
                  <li>• Undercut Defense: <strong className="text-yellow-300">+20 XP</strong></li>
                  <li>• Low Deadwood (&lt;5): <strong className="text-yellow-300">+15 XP</strong></li>
                </ul>
              </div>

              <div className="bg-red-900 bg-opacity-30 p-3 rounded border border-red-600">
                <h4 className="font-bold text-red-300 mb-2">💀 Defeat Rewards</h4>
                <ul className="text-amber-100 text-sm space-y-1">
                  <li>• Base Loss: <strong className="text-yellow-300">10 XP</strong></li>
                  <li>• Close Match Bonus: <strong className="text-yellow-300">+10 XP</strong></li>
                  <li>• Participation: <strong className="text-gray-300">Experience earned!</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-600 mb-4">
              <h4 className="font-bold text-purple-300 mb-2">🏅 Match Mode Bonus</h4>
              <p className="text-amber-100 text-sm">
                Win a Match Mode game (first to 100 gold) for a massive <strong className="text-yellow-300">+50 XP</strong> bonus!
                This is one of the best ways to earn XP quickly in Challenge Mode.
              </p>
            </div>

            <div className="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-600">
              <p className="text-blue-200 text-sm">
                <strong>💎 Level Up Rewards:</strong> Each time you level up, you earn <strong className="text-yellow-300">1 Ability Point (AP)</strong>
                to unlock or upgrade abilities!
              </p>
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-600 mt-4">
              <h4 className="font-bold text-purple-300 mb-2">🎊 Tier Milestone Bonuses</h4>
              <p className="text-purple-200 text-sm mb-2">
                Reaching a new tier grants massive XP bonuses!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-purple-100">
                <div>5 wins: <strong className="text-yellow-300">+50 XP</strong></div>
                <div>10 wins: <strong className="text-yellow-300">+100 XP</strong></div>
                <div>15 wins: <strong className="text-yellow-300">+200 XP</strong></div>
                <div>20 wins: <strong className="text-yellow-300">+300 XP</strong></div>
                <div>25 wins: <strong className="text-yellow-300">+500 XP</strong></div>
                <div>30 wins: <strong className="text-yellow-300">+750 XP</strong></div>
                <div>35 wins: <strong className="text-yellow-300">+1000 XP</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Abilities System */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">⚡ Abilities System</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-100 mb-3">
              Use <strong className="text-yellow-300">Ability Points (AP)</strong> to unlock powerful abilities that give you an edge in battle:
            </p>

            <div className="space-y-3">
              <div className="bg-yellow-900 bg-opacity-30 p-3 rounded border border-yellow-600">
                <h4 className="font-bold text-yellow-300 mb-1">🔮 Mystic Eye (1 AP)</h4>
                <p className="text-amber-100 text-sm">
                  Peek at the top 3 cards of the deck once per round. Perfect for planning your strategy!
                </p>
              </div>

              <div className="bg-green-900 bg-opacity-30 p-3 rounded border border-green-600">
                <h4 className="font-bold text-green-300 mb-1">💰 Gold Magnet (1 AP)</h4>
                <p className="text-amber-100 text-sm">
                  Earn +2 bonus gold from every victory. Stack up those winnings!
                </p>
              </div>

              <div className="bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-600">
                <h4 className="font-bold text-purple-300 mb-1">🔄 Card Swap (2 AP)</h4>
                <p className="text-amber-100 text-sm">
                  Once per round, swap one card from your hand with a random card from the deck.
                </p>
              </div>

              <div className="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-600">
                <h4 className="font-bold text-blue-300 mb-1">⏮️ Redo Turn (2 AP)</h4>
                <p className="text-amber-100 text-sm">
                  Undo your last turn and try a different strategy. Limited uses per round!
                </p>
              </div>
            </div>

            <div className="mt-4 bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-600">
              <p className="text-purple-200 text-sm">
                <strong>🛡️ Equip System:</strong> You can equip up to <strong className="text-yellow-300">3 abilities</strong> at once.
                Visit the <strong className="text-yellow-300">⚡ Abilities</strong> shop to manage your loadout!
              </p>
            </div>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">💡 Tips for Success</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <ul className="list-disc list-inside space-y-2 text-amber-100">
              <li><strong className="text-green-300">Master the Basics:</strong> Complete Tutorial and Practice modes first!</li>
              <li><strong className="text-blue-300">Focus on Gins:</strong> Hitting GIN (0 deadwood) gives massive XP bonuses</li>
              <li><strong className="text-yellow-300">Choose Abilities Wisely:</strong> Start with Gold Magnet or Mystic Eye for beginners</li>
              <li><strong className="text-purple-300">Play Consistently:</strong> XP accumulates over time - every game counts!</li>
              <li><strong className="text-red-300">Learn from Losses:</strong> Even defeats grant XP and learning opportunities</li>
            </ul>
          </div>
        </div>

        {/* Future Features */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-400 mb-3">🔮 Coming Soon</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border-2 border-amber-700">
            <p className="text-amber-100 mb-2 italic">
              The following features are planned for future updates:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
              <li>Campaign Mode with unique bosses</li>
              <li>More powerful abilities and upgrades</li>
              <li>Prestige system for veteran players</li>
              <li>Special events and challenges</li>
              <li>Cosmetic card skins and themes</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600
                     text-white rounded-lg font-bold text-lg border-2 border-amber-400 transition-all transform hover:scale-105"
          >
            Ready to Challenge!
          </button>
        </div>
      </div>
    </div>
  );
};

ChallengeRulesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ChallengeRulesModal;
