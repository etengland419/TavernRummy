import React, { useState, useEffect, useRef, useMemo } from 'react';

// Constants
import { GAME_CONFIG, DIFFICULTY_LEVELS, GAME_MODES, ANIMATION_TIMINGS } from './utils/constants';

// Utilities
import { createDeck } from './utils/cardUtils';
import { findMelds, calculateDeadwood, calculateMinDeadwoodAfterDiscard, sortHand } from './utils/meldUtils';
import { calculateRoundResult, checkMatchWinner } from './utils/scoringUtils';
import { getRandomOpponentName } from './utils/opponentNames';
import { XP_REWARDS } from './utils/progressionUtils';
import { getDifficultyForWinStreak, checkTierMilestone, getTierReachedMessage, getCurrentTier, getOpponentNameForTier } from './utils/challengeUtils';
import { updateChallengeWin, updateChallengeLoss, addMilestoneXP } from './utils/statsUtils';
import { logGameStateValidation } from './utils/gameStateValidation';

// AI
import { executeAITurn } from './ai/aiStrategy';

// Components
import DifficultySelector from './components/UI/DifficultySelector';
import ScoreDisplay from './components/UI/ScoreDisplay';
import GameBoard from './components/Game/GameBoard';
import AIHand from './components/Game/AIHand';
import PlayerHand from './components/Game/PlayerHand';
import GameControls from './components/Game/GameControls';
import RoundEndModal from './components/Modals/RoundEndModal';
import MatchWinnerModal from './components/Modals/MatchWinnerModal';
import TutorialCompleteModal from './components/Modals/TutorialCompleteModal';
import DifficultyConfirmModal from './components/Modals/DifficultyConfirmModal';
import MatchModeConfirmModal from './components/Modals/MatchModeConfirmModal';
import StatsModal from './components/Modals/StatsModal';
import AchievementsModal from './components/Modals/AchievementsModal';
import ChallengeRulesModal from './components/Modals/ChallengeRulesModal';
import ChallengeModeConfirmModal from './components/Modals/ChallengeModeConfirmModal';
import GameModeConfirmModal from './components/Modals/GameModeConfirmModal';
import TierMilestoneModal from './components/Modals/TierMilestoneModal';
import DebugModal from './components/Modals/DebugModal';
import AchievementNotification from './components/UI/AchievementNotification';
import AnimatedCard from './components/UI/AnimatedCard';
import AudioControls from './components/UI/AudioControls';
import SplashScreen from './components/Modals/SplashScreen';
import StrategyTip from './components/UI/StrategyTip';
import XPBar from './components/UI/XPBar';
import LevelUpModal from './components/Modals/LevelUpModal';
import AbilitiesPanel from './components/UI/AbilitiesPanel';
import AbilitiesShopModal from './components/Modals/AbilitiesShopModal';
import ChallengeTierDisplay from './components/UI/ChallengeTierDisplay';
import ShopModal from './components/Modals/ShopModal';

// Hooks
import { useTutorial } from './hooks/useTutorial';
import { useStats } from './hooks/useStats';
import { useAchievements } from './hooks/useAchievements';
import { useAudio } from './hooks/useAudio';
import { useCardAnimation } from './hooks/useCardAnimation';
import { useStrategyTips } from './hooks/useStrategyTips';
import { useProgression } from './hooks/useProgression';
import { useAbilities } from './hooks/useAbilities';

// Ability Components
import DeckPeekModal from './components/Modals/DeckPeekModal';
import CardSwapModal from './components/Modals/CardSwapModal';
import LuckyDrawModal from './components/Modals/LuckyDrawModal';
import DevPanel from './components/UI/DevPanel';

// Ability Utils
import { ACTIVE_ABILITIES } from './utils/abilitiesUtils';

const TavernRummy = () => {
  // Game State
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [phase, setPhase] = useState('draw');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Draw a card from the deck or discard pile');

  // Scores
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [scoreAnimation, setScoreAnimation] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [roundEndData, setRoundEndData] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);
  const [matchWinXP, setMatchWinXP] = useState(0);

  // Settings
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.TUTORIAL);
  const [gameMode, setGameMode] = useState(GAME_MODES.PRACTICE);
  const [matchMode, setMatchMode] = useState(false);
  const [opponentName, setOpponentName] = useState(getRandomOpponentName(DIFFICULTY_LEVELS.TUTORIAL));

  // Tip tracking
  const [turnCount, setTurnCount] = useState(0);
  const [opponentPicks, setOpponentPicks] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // UI State
  const [newlyDrawnCard, setNewlyDrawnCard] = useState(null);
  const [discardingCard, setDiscardingCard] = useState(null);
  const [aiDrawnCard, setAiDrawnCard] = useState(null);
  const [aiDiscardedCard, setAiDiscardedCard] = useState(null);
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [pendingMatchMode, setPendingMatchMode] = useState(false);
  const [showMatchModeConfirm, setShowMatchModeConfirm] = useState(false);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showChallengeRules, setShowChallengeRules] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showAbilitiesShop, setShowAbilitiesShop] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState(null);
  const [showChallengeModeConfirm, setShowChallengeModeConfirm] = useState(false);
  const [showGameModeConfirm, setShowGameModeConfirm] = useState(false);
  const [tierMilestone, setTierMilestone] = useState(null);
  const [showTierMilestone, setShowTierMilestone] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);

  // Refs
  const deckRef = useRef(null);
  const discardRef = useRef(null);
  const playerHandRef = useRef(null);
  const aiHandRef = useRef(null);

  // Memoized calculations
  const playerMelds = useMemo(() => findMelds(playerHand), [playerHand]);
  const playerDeadwood = useMemo(() => calculateDeadwood(playerHand), [playerHand]);
  const playerMinDeadwoodAfterDiscard = useMemo(() => calculateMinDeadwoodAfterDiscard(playerHand), [playerHand]);
  const sortedPlayerHand = useMemo(() => sortHand(playerHand, true), [playerHand]);

  // Tutorial hook
  const { tutorialMessage, tutorialHighlight, setTutorialHighlight } = useTutorial(
    difficulty,
    gameMode,
    phase,
    playerHand,
    discardPile,
    deck,
    currentTurn
  );

  // Stats hook
  const { stats, derivedStats, trackGame, trackMatch, resetAllStats } = useStats();

  // Achievements hook
  const { newlyUnlocked, dismissNotification, getAchievement, getAllAchievements, getCompletionStats } = useAchievements(stats);

  // Progression hook
  const progression = useProgression();

  // Audio hook
  const {
    isMuted,
    musicVolume,
    toggleMute,
    changeMusicVolume,
    playBackgroundMusic,
    stopBackgroundMusic
  } = useAudio();

  // Card animation hook
  const { flyingCards, addFlyingCard, addFlyingCardFromPosition } = useCardAnimation();

  // Get effective difficulty (uses win streak for Challenge Mode)
  const getEffectiveDifficulty = () => {
    if (gameMode === GAME_MODES.CHALLENGING) {
      return getDifficultyForWinStreak(stats.challengeMode?.currentWinStreak || 0);
    }
    return difficulty;
  };

  // Build game context for strategy tips
  const gameContext = useMemo(() => ({
    hand: playerHand,
    deadwood: playerDeadwood,
    phase,
    currentTurn,
    turnCount,
    selectedCard,
    opponentPicks,
    difficulty,
    deckSize: deck.length,
    discardTop: discardPile.length > 0 ? discardPile[discardPile.length - 1] : null,
    discardPile,
    hasKnocked: gameOver
  }), [playerHand, playerDeadwood, phase, currentTurn, turnCount, selectedCard, opponentPicks, difficulty, deck.length, discardPile, gameOver]);

  // Strategy tips hook (only active in Practice mode)
  const { activeTip, dismissTip, clearDismissed } = useStrategyTips(gameMode, gameContext);

  // Abilities hook
  const abilities = useAbilities();

  // Destructure commonly used abilities for convenience
  const {
    unlockedAbilities,
    equippedAbilities,
    abilityUses,
    deckPeekCards,
    showDeckPeekModal,
    setShowDeckPeekModal,
    showCardSwapModal,
    setShowCardSwapModal,
    luckyDrawCards,
    showLuckyDrawModal,
    activateDeckPeek,
    activateRedoTurn,
    saveGameStateForRedo,
    activateCardSwap,
    checkLuckyDraw,
    selectLuckyDrawCard,
    getQuickHandsMultiplier,
    getGoldMagnetMultiplier,
    getXPBoostMultiplier,
    getMeldMasterLevel,
    resetForNewRound,
    resetForNewMatch,
    resetAllAbilities
  } = abilities;

  // Initialize game on mount (only after splash screen is dismissed)
  useEffect(() => {
    if (!showSplashScreen) {
      startNewRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplashScreen]);

  // Sound effects disabled - Play achievement sound when new achievements are unlocked
  // useEffect(() => {
  //   if (newlyUnlocked.length > 0) {
  //     sounds.achievement();
  //   }
  // }, [newlyUnlocked.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop background music on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  // Auto-gin: Automatically knock when player has gin (0 deadwood)
  useEffect(() => {
    if (
      phase === 'discard' &&
      currentTurn === 'player' &&
      !gameOver &&
      playerMinDeadwoodAfterDiscard === 0 &&
      playerHand.length > 0
    ) {
      // Player has gin! Auto-knock after a brief moment
      const timer = setTimeout(() => {
        setMessage('🎉 GIN! Auto-knocking for you...');
        setTimeout(() => {
          knock();
        }, 800);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, currentTurn, gameOver, playerMinDeadwoodAfterDiscard, playerHand.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const startNewRound = () => {
    const newDeck = createDeck();
    const playerCards = newDeck.splice(0, GAME_CONFIG.STARTING_HAND_SIZE);
    const aiCards = newDeck.splice(0, GAME_CONFIG.STARTING_HAND_SIZE);
    const firstDiscard = newDeck.splice(0, 1);

    setDeck(newDeck);
    setPlayerHand(playerCards);
    setAiHand(aiCards);
    setDiscardPile(firstDiscard);
    setCurrentTurn('player');
    setPhase('draw');
    setGameOver(false);
    setRoundWinner(null);
    setNewlyDrawnCard(null);
    setRoundEndData(null);
    setTutorialHighlight(null);
    setMessage('Draw a card from the deck or discard pile');

    // Update opponent name based on current tier in Challenge Mode
    if (gameMode === GAME_MODES.CHALLENGING) {
      const currentWinStreak = stats.challengeMode?.currentWinStreak || 0;
      setOpponentName(getOpponentNameForTier(currentWinStreak));
    }

    // Reset tip tracking for new round
    setTurnCount(0);
    setOpponentPicks([]);
    setSelectedCard(null);
    clearDismissed();

    // Reset ability uses for new round
    resetForNewRound();

    // sounds.cardShuffle(); // Sound effects disabled
  };

  const drawCard = (source) => {
    if (currentTurn !== 'player' || phase !== 'draw') return;

    // Save game state BEFORE drawing for Redo Turn ability
    // This ensures the drawn card can be returned to the deck/discard
    let drawnCard;
    let newDeck = [...deck];
    let newDiscard = [...discardPile];

    if (source === 'deck') {
      if (deck.length === 0) {
        setMessage('Deck is empty! Round ends in a draw.');
        handleDraw();
        return;
      }

      // Check if Lucky Draw triggers (passive ability)
      const luckyDrawCards = checkLuckyDraw(newDeck);
      if (luckyDrawCards) {
        // Lucky Draw triggered - let the modal handle the card selection
        // The selection will be handled by handleLuckyDrawSelection
        return;
      }

      drawnCard = newDeck.pop();

      // Save state before modifying anything
      saveGameStateForRedo({
        playerHand: [...playerHand],
        discardPile: [...discardPile],
        deck: [...deck], // Original deck with the card still in it
        phase: 'draw',
        currentTurn: 'player',
        drawnCard: drawnCard, // Track which card was drawn
        drawSource: 'deck' // Track where it was drawn from
      });

      setDeck(newDeck);
      // sounds.cardDraw(); // Sound effects disabled
      // Add flying card animation from deck to player hand
      addFlyingCard(drawnCard, deckRef, playerHandRef, true);
    } else {
      if (discardPile.length === 0) return;
      drawnCard = newDiscard.pop();

      // Save state before modifying anything
      saveGameStateForRedo({
        playerHand: [...playerHand],
        discardPile: [...discardPile], // Original discard with the card still in it
        deck: [...deck],
        phase: 'draw',
        currentTurn: 'player',
        drawnCard: drawnCard, // Track which card was drawn
        drawSource: 'discard' // Track where it was drawn from
      });

      setDiscardPile(newDiscard);
      // sounds.cardDraw(); // Sound effects disabled
      // Add flying card animation from discard to player hand
      addFlyingCard(drawnCard, discardRef, playerHandRef, false);
    }

    // Save game state for Redo Turn ability
    saveGameStateForRedo({
      playerHand,
      deck: newDeck,
      discardPile: newDiscard
    });

    // Delay adding card to hand until animation completes
    setTimeout(() => {
      const newHand = [...playerHand, drawnCard];
      setPlayerHand(newHand);
      setNewlyDrawnCard(drawnCard.id);
      setPhase('discard');
      setMessage('Discard a card or knock');
      setTurnCount(prev => prev + 1);

      setTimeout(() => setNewlyDrawnCard(null), ANIMATION_TIMINGS.CARD_HIGHLIGHT);
    }, ANIMATION_TIMINGS.CARD_DRAW);
  };

  const discardCard = (card) => {
    if (currentTurn !== 'player' || phase !== 'discard') return;

    setDiscardingCard(card.id);
    // sounds.cardDiscard(); // Sound effects disabled

    // Add flying card animation from player hand to discard
    // Use captured card position if available, otherwise use container position
    if (card._discardPosition && discardRef && discardRef.current) {
      addFlyingCardFromPosition(card, card._discardPosition, discardRef, ANIMATION_TIMINGS.CARD_DISCARD / 1000);
    } else {
      addFlyingCard(card, playerHandRef, discardRef, false, ANIMATION_TIMINGS.CARD_DISCARD / 1000);
    }

    setTimeout(() => {
      const newHand = playerHand.filter(c => c.id !== card.id);
      setPlayerHand(newHand);
      setDiscardPile([...discardPile, card]);
      setDiscardingCard(null);
      setPhase('draw');
      setCurrentTurn('ai');
      setMessage(`${opponentName}'s turn...`);
      setTutorialHighlight(null);

      setTimeout(() => aiTurn(newHand), ANIMATION_TIMINGS.CARD_DRAW);
    }, ANIMATION_TIMINGS.CARD_DISCARD);
  };

  const knock = () => {
    if (phase !== 'discard' || currentTurn !== 'player') return;

    // If player has 11 cards, find and discard the card that minimizes deadwood
    if (playerHand.length === 11) {
      let bestCardToDiscard = null;
      let minDeadwood = Infinity;

      // Try discarding each card and find which gives minimum deadwood
      for (let i = 0; i < playerHand.length; i++) {
        const handWithoutCard = playerHand.filter((_, index) => index !== i);
        const deadwood = calculateDeadwood(handWithoutCard);
        if (deadwood < minDeadwood) {
          minDeadwood = deadwood;
          bestCardToDiscard = playerHand[i];
        }
      }

      // Verify we can knock with the resulting deadwood
      if (minDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD && bestCardToDiscard) {
        // Discard the best card
        setDiscardingCard(bestCardToDiscard.id);
        // sounds.cardDiscard(); // Sound effects disabled

        // Add flying card animation
        if (bestCardToDiscard._discardPosition && discardRef && discardRef.current) {
          addFlyingCardFromPosition(bestCardToDiscard, bestCardToDiscard._discardPosition, discardRef, ANIMATION_TIMINGS.CARD_DISCARD / 1000);
        } else {
          addFlyingCard(bestCardToDiscard, playerHandRef, discardRef, false, ANIMATION_TIMINGS.CARD_DISCARD / 1000);
        }

        setTimeout(() => {
          const newHand = playerHand.filter(c => c.id !== bestCardToDiscard.id);
          setPlayerHand(newHand);
          setDiscardPile([...discardPile, bestCardToDiscard]);
          setDiscardingCard(null);
          setMessage('You knock!');

          // sounds.knock(); // Sound effects disabled
          setTimeout(() => endRound('player'), ANIMATION_TIMINGS.KNOCK_ANNOUNCEMENT);
        }, ANIMATION_TIMINGS.CARD_DISCARD);
      }
    } else {
      // If player already has 10 cards, knock directly
      const deadwood = calculateDeadwood(playerHand);
      if (deadwood <= GAME_CONFIG.KNOCK_THRESHOLD) {
        setMessage('You knock!');
        // sounds.knock(); // Sound effects disabled
        setTimeout(() => endRound('player'), ANIMATION_TIMINGS.KNOCK_ANNOUNCEMENT);
      }
    }
  };

  // Debug function: Auto-win current round with GIN
  const handleDebugAutoWin = () => {
    if (gameOver) {
      console.log('[DEBUG] Cannot auto-win: Round already over');
      return;
    }

    console.log('[DEBUG] Auto-win triggered');

    // Create a perfect GIN hand (all cards in melds, 0 deadwood)
    // Using medieval-themed suits: ⚔️ (Swords), 🏆 (Chalices), 💰 (Coins), 🔱 (Staves)
    // Two sets of 3 + one run of 4 = 10 cards, all in melds
    const perfectHand = [
      // Set 1: Three 5s
      { suit: '⚔️', rank: '5', value: 5, id: 'debug-5-S' },
      { suit: '🏆', rank: '5', value: 5, id: 'debug-5-C' },
      { suit: '💰', rank: '5', value: 5, id: 'debug-5-Co' },
      // Set 2: Three 7s
      { suit: '⚔️', rank: '7', value: 7, id: 'debug-7-S' },
      { suit: '🏆', rank: '7', value: 7, id: 'debug-7-C' },
      { suit: '💰', rank: '7', value: 7, id: 'debug-7-Co' },
      // Run: A-2-3-4 of Staves
      { suit: '🔱', rank: 'A', value: 1, id: 'debug-A-St' },
      { suit: '🔱', rank: '2', value: 2, id: 'debug-2-St' },
      { suit: '🔱', rank: '3', value: 3, id: 'debug-3-St' },
      { suit: '🔱', rank: '4', value: 4, id: 'debug-4-St' }
    ];

    // Give AI a hand with high deadwood
    const aiHandWithDeadwood = [
      { suit: '⚔️', rank: 'K', value: 10, id: 'debug-ai-K-S' },
      { suit: '🏆', rank: 'Q', value: 10, id: 'debug-ai-Q-C' },
      { suit: '💰', rank: 'J', value: 10, id: 'debug-ai-J-Co' },
      { suit: '⚔️', rank: '9', value: 9, id: 'debug-ai-9-S' },
      { suit: '🏆', rank: '8', value: 8, id: 'debug-ai-8-C' },
      { suit: '💰', rank: '6', value: 6, id: 'debug-ai-6-Co' },
      { suit: '⚔️', rank: '4', value: 4, id: 'debug-ai-4-S' },
      { suit: '🏆', rank: '3', value: 3, id: 'debug-ai-3-C' },
      { suit: '💰', rank: '2', value: 2, id: 'debug-ai-2-Co' },
      { suit: '⚔️', rank: 'A', value: 1, id: 'debug-ai-A-S' }
    ];

    // Update hands
    setPlayerHand(perfectHand);
    setAiHand(aiHandWithDeadwood);

    // Show message and end round after brief delay
    setMessage('[DEBUG] You knock with GIN!');
    setTimeout(() => endRound('player', perfectHand, aiHandWithDeadwood), 500);
  };

  const aiTurn = (playerCurrentHand) => {
    // Apply Quick Hands speed multiplier (passive ability)
    const speedMultiplier = getQuickHandsMultiplier();

    setTimeout(() => {
      const effectiveDifficulty = getEffectiveDifficulty();
      const decision = executeAITurn(aiHand, deck, discardPile, effectiveDifficulty);

      if (decision.deckEmpty) {
        setMessage('Deck is empty! Round ends in a draw.');
        handleDraw();
        return;
      }

      // Show draw animation
      const drawMessage = decision.drawSource === 'discard'
        ? `${opponentName} takes from the discard pile...`
        : `${opponentName} draws from the deck...`;
      setMessage(drawMessage);
      setAiDrawnCard(decision.drawnCard.id);

      // Add flying card animation for AI draw
      const fromRef = decision.drawSource === 'deck' ? deckRef : discardRef;
      const isHidden = decision.drawSource === 'deck';
      addFlyingCard(decision.drawnCard, fromRef, aiHandRef, isHidden, ANIMATION_TIMINGS.CARD_DRAW / 1000);

      // Update deck/discard based on draw source
      if (decision.drawSource === 'deck') {
        const newDeck = [...deck];
        newDeck.pop();
        setDeck(newDeck);
      } else {
        const newDiscard = [...discardPile];
        const pickedCard = newDiscard.pop();
        setDiscardPile(newDiscard);

        // Track opponent picks for defensive discard tips
        setOpponentPicks(prev => [...prev.slice(-4), pickedCard]); // Keep last 5 picks
      }

      setTimeout(() => {
        setAiDrawnCard(null);
        setMessage(`${opponentName} considers their hand...`);

        setTimeout(() => {
          setMessage(`${opponentName} discards...`);
          setAiDiscardedCard(decision.discardCard.id);

          // Add flying card animation for AI discard
          addFlyingCard(decision.discardCard, aiHandRef, discardRef, false, ANIMATION_TIMINGS.CARD_DISCARD / 1000);

          setTimeout(() => {
            setAiHand(decision.finalHand);
            setDiscardPile([...discardPile, decision.discardCard]);
            setAiDiscardedCard(null);

            if (decision.shouldKnock) {
              setTimeout(() => {
                setMessage(`${opponentName} knocks!`);
                setTimeout(() => endRound('ai'), ANIMATION_TIMINGS.KNOCK_ANNOUNCEMENT * speedMultiplier);
              }, 250 * speedMultiplier);
            } else {
              setCurrentTurn('player');
              setPhase('draw');
              setMessage('Your turn - Draw a card');
            }
          }, ANIMATION_TIMINGS.CARD_DISCARD * speedMultiplier);
        }, ANIMATION_TIMINGS.AI_DISCARD_DELAY * speedMultiplier);
      }, ANIMATION_TIMINGS.AI_DRAW_DELAY * speedMultiplier);
    }, ANIMATION_TIMINGS.AI_TURN_START * speedMultiplier);
  };

  const handleDraw = () => {
    setGameOver(true);

    // Award participation XP even for draws
    const drawResult = {
      winner: 'draw',
      playerDeadwood: calculateDeadwood(playerHand),
      aiDeadwood: calculateDeadwood(aiHand)
    };
    const { xp: baseXP } = progression.addRoundXP(drawResult);
    const xpMultiplier = getXPBoostMultiplier();
    const xp = Math.round(baseXP * xpMultiplier);

    setRoundEndData({
      winner: 'draw',
      playerDeadwood: calculateDeadwood(playerHand),
      aiDeadwood: calculateDeadwood(aiHand),
      scoreDiff: 0,
      reason: 'The deck ran out of cards. No gold changes hands.',
      xp: xp
    });
    setTutorialHighlight(null);
  };

  const endRound = (knocker, playerHandOverride = null, aiHandOverride = null) => {
    const finalPlayerHand = playerHandOverride || playerHand;
    const finalAiHand = aiHandOverride || aiHand;
    const result = calculateRoundResult(knocker, finalPlayerHand, finalAiHand);

    setGameOver(true);
    setTutorialHighlight(null);
    setRoundWinner(result.winner);

    // Update scores
    const newScores = { ...scores };
    let displayScoreDiff = result.scoreDiff;
    if (result.winner !== 'draw') {
      // Apply Gold Magnet bonus to player score
      const scoreDiff = result.winner === 'player'
        ? Math.round(result.scoreDiff * getGoldMagnetMultiplier())
        : result.scoreDiff;

      displayScoreDiff = scoreDiff;
      newScores[result.winner] += scoreDiff;
      setScoreAnimation(result.winner);
      setTimeout(() => setScoreAnimation(null), ANIMATION_TIMINGS.SCORE_ANIMATION);
    }

    // Award XP to player (with XP Boost multiplier)
    const { xp: baseXP, breakdown } = progression.addRoundXP(result);
    const xpMultiplier = getXPBoostMultiplier();
    const xp = Math.round(baseXP * xpMultiplier);

    // If XP Boost is active, add the bonus XP
    if (xpMultiplier > 1.0) {
      const bonusXP = xp - baseXP;
      progression.addXP(bonusXP, `XP Boost Bonus: +${bonusXP} XP`);
    }

    console.log(`XP Gained: +${xp} XP`, breakdown);

    // Sound effects disabled - Play appropriate sound based on result
    // const isPlayerGin = result.playerDeadwood === 0 && knocker === 'player';
    // const isUndercut = (knocker === 'player' && result.winner === 'ai') || (knocker === 'ai' && result.winner === 'player');

    // if (isPlayerGin) {
    //   sounds.gin();
    // } else if (isUndercut && result.winner === 'ai') {
    //   sounds.undercut();
    // } else if (result.winner === 'player') {
    //   sounds.win();
    // } else if (result.winner === 'ai') {
    //   sounds.lose();
    // }

    // Check for match winner
    const matchWinner = checkMatchWinner(newScores, matchMode);
    if (matchWinner) {
      setMatchWinner(matchWinner);
      // Sound effects disabled - Play match win/loss sound
      // setTimeout(() => {
      //   if (matchWinner === 'player') {
      //     sounds.matchWin();
      //   }
      // }, 500);
      // Track match completion
      if (trackMatch) {
        trackMatch(matchWinner);
      }
      // Award bonus XP for match win in Challenge Mode (with XP Boost multiplier)
      if (gameMode === GAME_MODES.CHALLENGING && matchWinner === 'player') {
        const matchWinXP = Math.round(XP_REWARDS.MATCH_WIN_BONUS * getXPBoostMultiplier());
        progression.addXP(matchWinXP, `Match Victory Bonus: +${matchWinXP} XP`);
        setMatchWinXP(matchWinXP);
        console.log(`Match Win Bonus XP: +${matchWinXP} XP`);
      } else {
        setMatchWinXP(0);
      }
    }

    // Handle Challenge Mode progression (Endless Mode)
    if (gameMode === GAME_MODES.CHALLENGING && result.winner !== 'draw') {
      if (result.winner === 'player') {
        const previousStreak = stats.challengeMode?.currentWinStreak || 0;
        const effectiveDifficulty = getEffectiveDifficulty();

        // Update Challenge stats
        let updatedStats = updateChallengeWin(stats, effectiveDifficulty);

        // Check for tier milestone
        const milestone = checkTierMilestone(previousStreak, updatedStats.challengeMode.currentWinStreak);

        if (milestone) {
          // Award milestone XP (with XP Boost multiplier)
          const milestoneXP = Math.round(milestone.xpBonus * getXPBoostMultiplier());
          updatedStats = addMilestoneXP(updatedStats, milestoneXP);
          progression.addXP(milestoneXP, `Tier Milestone Bonus: ${milestone.tier.name}`);

          // Show tier milestone notification with round result
          setTierMilestone({
            tier: milestone.tier,
            xpBonus: milestoneXP,
            message: getTierReachedMessage(milestone.threshold),
            roundResult: result // Include round result in milestone
          });
          setShowTierMilestone(true);

          console.log(`🎊 TIER UP! Reached ${milestone.tier.name} tier! +${milestoneXP} XP`);
        }

        // Update stats (this will be saved by useStats)
        Object.assign(stats, updatedStats);

      } else if (result.winner === 'ai') {
        // Reset win streak on loss
        const updatedStats = updateChallengeLoss(stats);
        Object.assign(stats, updatedStats);
        console.log('💀 Challenge run ended. Win streak reset to 0.');
      }
    }

    setScores(newScores);
    setRoundEndData({
      ...result,
      scoreDiff: displayScoreDiff,
      xp: xp // Include XP earned this round
    });

    // Track game completion in stats
    if (trackGame) {
      trackGame({
        winner: result.winner,
        difficulty: difficulty,
        gameMode: gameMode,
        playerDeadwood: result.playerDeadwood,
        isGin: result.playerDeadwood === 0 && knocker === 'player',
        isUndercut: (knocker === 'player' && result.winner === 'ai') || (knocker === 'ai' && result.winner === 'player'),
        isKnock: knocker === 'player',
        playerScore: newScores.player
      });
    }

    // Show tutorial completion prompt
    if (difficulty === DIFFICULTY_LEVELS.TUTORIAL && result.winner !== 'draw') {
      setTimeout(() => setShowTutorialComplete(true), ANIMATION_TIMINGS.TUTORIAL_DELAY);
    }
  };

  const changeDifficulty = (newDifficulty) => {
    // Don't show confirmation if selecting the same difficulty
    if (difficulty === newDifficulty) return;

    // Always show confirmation when changing difficulty
    setPendingDifficulty(newDifficulty);
    setShowDifficultyConfirm(true);
    // sounds.buttonClick(); // Sound effects disabled
  };

  const confirmDifficultyChange = () => {
    setDifficulty(pendingDifficulty);
    setOpponentName(getRandomOpponentName(pendingDifficulty));
    setShowDifficultyConfirm(false);
    setPendingDifficulty(null);
    // sounds.newRound(); // Sound effects disabled
    // Start a new round when difficulty changes
    startNewRound();
  };

  const handleMatchModeToggle = () => {
    // Show confirmation modal before toggling
    setPendingMatchMode(!matchMode);
    setShowMatchModeConfirm(true);
    // sounds.buttonClick(); // Sound effects disabled
  };

  const confirmMatchModeChange = () => {
    setMatchMode(pendingMatchMode);
    setScores({ player: 0, ai: 0 });
    setMatchWinner(null);
    setOpponentName(getRandomOpponentName(difficulty));
    setShowMatchModeConfirm(false);
    // sounds.newRound(); // Sound effects disabled
    startNewRound();
  };

  const handleGameModeChange = (newMode) => {
    // Don't show confirmation if selecting the same mode
    if (gameMode === newMode) return;

    setPendingGameMode(newMode);

    // Show different confirmation modals based on the mode
    if (newMode === GAME_MODES.CHALLENGING || gameMode === GAME_MODES.CHALLENGING) {
      setShowChallengeModeConfirm(true);
    } else {
      setShowGameModeConfirm(true);
    }
    // sounds.buttonClick(); // Sound effects disabled
  };

  const confirmGameModeChange = () => {
    setGameMode(pendingGameMode);
    setScores({ player: 0, ai: 0 });
    setMatchWinner(null);

    // Update opponent name based on new mode
    if (pendingGameMode === GAME_MODES.CHALLENGING) {
      const tier = getCurrentTier(stats.challengeMode.currentWinStreak);
      setOpponentName(getOpponentNameForTier(tier));
    } else {
      setOpponentName(getRandomOpponentName(difficulty));
    }

    setShowGameModeConfirm(false);
    setPendingGameMode(null);
    // sounds.newRound(); // Sound effects disabled
    startNewRound();
  };

  const confirmChallengeModeChange = () => {
    setGameMode(pendingGameMode);
    setScores({ player: 0, ai: 0 });
    setMatchWinner(null);

    // Update opponent name based on new mode
    if (pendingGameMode === GAME_MODES.CHALLENGING) {
      const tier = getCurrentTier(stats.challengeMode.currentWinStreak);
      setOpponentName(getOpponentNameForTier(tier));
    } else {
      setOpponentName(getRandomOpponentName(difficulty));
    }

    setShowChallengeModeConfirm(false);
    setPendingGameMode(null);
    // sounds.newRound(); // Sound effects disabled
    startNewRound();
  };

  // Ability Handlers
  const handleUseAbility = (abilityId) => {
    if (abilityId === ACTIVE_ABILITIES.DECK_PEEK) {
      activateDeckPeek(deck);
    } else if (abilityId === ACTIVE_ABILITIES.CARD_SWAP) {
      setShowCardSwapModal(true);
    } else if (abilityId === ACTIVE_ABILITIES.REDO_TURN) {
      const savedState = activateRedoTurn();
      if (savedState) {
        setPlayerHand(savedState.playerHand);
        setDeck(savedState.deck);
        setDiscardPile(savedState.discardPile);
        setPhase('discard');
        setMessage('Turn undone! Discard a card or knock');
      }
    }
  };

  const handleCardSwap = (cardIndex) => {
    const result = activateCardSwap(cardIndex, playerHand, deck);
    if (result) {
      setPlayerHand(result.newHand);
      setDeck(result.newDeck);
      setShowCardSwapModal(false);
      setMessage(`Swapped ${result.discardedCard.rank} for ${result.newCard.rank}`);
    }
  };

  const handleLuckyDrawSelection = (selectedCard) => {
    // Check for duplicate cards before processing
    const cardExistsInHand = playerHand.some(card => card.id === selectedCard.id);
    if (cardExistsInHand) {
      console.error('Duplicate card detected in hand:', selectedCard.id);
      setMessage('Error: Duplicate card detected. Please restart the round.');
      selectLuckyDrawCard(selectedCard); // Clear modal state
      return;
    }

    const newDeck = [...deck];
    // Remove both lucky draw cards from deck
    newDeck.shift();
    newDeck.shift();
    setDeck(newDeck);

    // Clear the Lucky Draw modal state using the hook function
    selectLuckyDrawCard(selectedCard);

    // Add flying animation
    addFlyingCard(selectedCard, deckRef, playerHandRef, true);

    // Delay adding card to hand until animation completes
    setTimeout(() => {
      // Double-check for duplicates before adding to hand
      const stillExists = playerHand.some(card => card.id === selectedCard.id);
      if (stillExists) {
        console.error('Duplicate card still detected after timeout:', selectedCard.id);
        setMessage('Error: Duplicate card detected. Please restart the round.');
        return;
      }

      const newHand = [...playerHand, selectedCard];
      setPlayerHand(newHand);
      setNewlyDrawnCard(selectedCard.id);
      setPhase('discard');
      setMessage('Lucky Draw! Discard a card or knock');
      setTurnCount(prev => prev + 1);

      // Validate game state after Lucky Draw
      logGameStateValidation(
        { playerHand: newHand, aiHand, deck: newDeck, discardPile },
        'After Lucky Draw Selection'
      );

      setTimeout(() => setNewlyDrawnCard(null), ANIMATION_TIMINGS.CARD_HIGHLIGHT);
    }, ANIMATION_TIMINGS.CARD_DRAW);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900 text-amber-100 p-8 relative overflow-hidden">
      {/* Splash Screen */}
      <SplashScreen
        show={showSplashScreen}
        onStart={({ difficulty: selectedDifficulty, gameMode: selectedGameMode, matchMode: selectedMatchMode }) => {
          setShowSplashScreen(false);
          // Set the selected difficulty, game mode, and match mode
          setDifficulty(selectedDifficulty);
          setGameMode(selectedGameMode);
          setMatchMode(selectedMatchMode);
          setOpponentName(getRandomOpponentName(selectedDifficulty));
          // Start background music on user interaction
          playBackgroundMusic();
        }}
      />

      {/* Audio Controls */}
      <AudioControls
        isMuted={isMuted}
        musicVolume={musicVolume}
        onToggleMute={toggleMute}
        onMusicVolumeChange={changeMusicVolume}
      />

      {/* Torch light effects */}
      <div className="absolute top-0 left-20 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-20 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-400 mb-2 drop-shadow-lg" style={{ fontFamily: 'serif' }}>
            ⚔️ Tavern Rummy ⚔️
          </h1>
          <p className="text-amber-300 italic mb-4">A game of skill and fortune in the shadows</p>

          {/* Game Options - All in one row */}
          <div className="flex flex-wrap gap-2 justify-center items-center text-xs sm:text-sm">
            {/* Difficulty Selector - Inline Style */}
            <DifficultySelector
              difficulty={difficulty}
              gameMode={gameMode}
              onDifficultyChange={changeDifficulty}
              onGameModeChange={handleGameModeChange}
            />

            <button
              onClick={handleMatchModeToggle}
              className={`px-2 sm:px-3 py-1 rounded-lg border transition-all ${
                matchMode
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🏆 Match Mode {matchMode ? `(First to ${GAME_CONFIG.MATCH_WIN_SCORE})` : ''}
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowStatsModal(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              📊 Statistics
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowAchievementsModal(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              🏆 Achievements
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowAbilitiesShop(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              ⚡ Abilities
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowShopModal(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-purple-900 border-purple-600 text-purple-400 hover:bg-purple-800 transition-all"
              title="Prestige Shop (Coming Soon)"
            >
              🏪 Shop
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowChallengeRules(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              📖 Challenge Guide
            </button>
          </div>

          {/* Debug Controls Row - Separate from main controls */}
          <div className="flex flex-wrap gap-2 justify-center items-center text-xs sm:text-sm mt-2">
            <button
              onClick={handleDebugAutoWin}
              disabled={gameOver}
              className={`px-2 sm:px-3 py-1 rounded-lg border transition-all font-bold ${
                gameOver
                  ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-600 border-amber-400 text-white hover:bg-amber-500 hover:scale-105'
              }`}
              title="Instantly win current round with GIN (Debug)"
            >
              ⚡ Auto-Win
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowDebugModal(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg border bg-red-900 border-red-600 text-red-400 hover:bg-red-800 transition-all"
            >
              🔧 Debug Tools
            </button>
          </div>
        </div>

        {/* XP Bar - Only show in Challenging mode */}
        {gameMode === GAME_MODES.CHALLENGING && (
          <div className="mb-4">
            <XPBar
              level={progression.level}
              currentXP={progression.currentLevelXP}
              xpToNext={progression.xpToNextLevel}
              abilityPoints={progression.abilityPoints}
            />
          </div>
        )}

        {/* Challenge Tier Display - Only show in Challenge mode */}
        {gameMode === GAME_MODES.CHALLENGING && (
          <div className="mb-4">
            <ChallengeTierDisplay winStreak={stats.challengeMode.currentWinStreak} compact={true} />
          </div>
        )}

        {/* Score Display */}
        <ScoreDisplay scores={scores} scoreAnimation={scoreAnimation} />

        {/* Game Messages - Fixed height to prevent layout shifts */}
        <div className="mb-4 text-center min-h-[56px] flex items-center justify-center">
          <div className={`px-6 py-3 bg-opacity-70 border-2 rounded-lg ${
            difficulty === DIFFICULTY_LEVELS.TUTORIAL && tutorialMessage
              ? 'bg-blue-900 border-blue-400'
              : 'bg-amber-900 border-amber-600'
          }`}>
            <p className={`font-semibold ${
              difficulty === DIFFICULTY_LEVELS.TUTORIAL && tutorialMessage
                ? 'text-blue-100'
                : 'text-amber-200'
            }`}>
              {difficulty === DIFFICULTY_LEVELS.TUTORIAL && tutorialMessage ? tutorialMessage : message}
            </p>
          </div>
        </div>

        {/* AI Hand */}
        <AIHand
          hand={aiHand}
          gameOver={gameOver}
          aiDrawnCard={aiDrawnCard}
          aiDiscardedCard={aiDiscardedCard}
          currentTurn={currentTurn}
          aiHandRef={aiHandRef}
          opponentName={opponentName}
          challengeTier={gameMode === GAME_MODES.CHALLENGING ? getCurrentTier(stats.challengeMode.currentWinStreak) : null}
        />

        {/* Game Board (Deck & Discard) */}
        <GameBoard
          deck={deck}
          discardPile={discardPile}
          onDrawFromDeck={() => drawCard('deck')}
          onDrawFromDiscard={() => drawCard('discard')}
          canDraw={currentTurn === 'player' && phase === 'draw'}
          tutorialHighlight={tutorialHighlight}
          refs={{ deckRef, discardRef }}
        />

        {/* Player Hand */}
        <PlayerHand
          hand={sortedPlayerHand}
          melds={playerMelds}
          deadwood={playerDeadwood}
          onCardClick={discardCard}
          canDiscard={phase === 'discard' && currentTurn === 'player'}
          newlyDrawnCard={newlyDrawnCard}
          discardingCard={discardingCard}
          tutorialHighlight={tutorialHighlight}
          sortCards={true}
          playerHandRef={playerHandRef}
          currentTurn={currentTurn}
        />

        {/* Game Controls */}
        <GameControls
          onKnock={knock}
          onNewRound={startNewRound}
          canKnock={playerMinDeadwoodAfterDiscard <= GAME_CONFIG.KNOCK_THRESHOLD && phase === 'discard' && currentTurn === 'player'}
          deadwood={playerDeadwood}
          tutorialHighlight={tutorialHighlight === 'knock'}
        />

        {/* Modals */}
        <RoundEndModal
          roundEndData={!showTierMilestone ? roundEndData : null}
          onNextRound={() => {
            setRoundEndData(null);
            startNewRound();
          }}
        />

        <MatchWinnerModal
          matchWinner={matchWinner}
          scores={scores}
          gameMode={gameMode}
          xpGained={matchWinXP}
          stats={stats}
          onPlayAgain={() => {
            setMatchWinner(null);
            setMatchWinXP(0);
            setScores({ player: 0, ai: 0 });
            resetForNewMatch();
            startNewRound();
          }}
          onChooseMode={() => {
            setMatchWinner(null);
            setMatchWinXP(0);
            setScores({ player: 0, ai: 0 });
            setShowSplashScreen(true);
          }}
        />

        <TutorialCompleteModal
          show={showTutorialComplete}
          roundWinner={roundWinner}
          onStartRealMatch={() => {
            setDifficulty(DIFFICULTY_LEVELS.EASY);
            setShowTutorialComplete(false);
            setRoundEndData(null);
            startNewRound();
          }}
          onContinueTutorial={() => {
            setShowTutorialComplete(false);
            setRoundEndData(null);
            startNewRound();
          }}
        />

        <DifficultyConfirmModal
          show={showDifficultyConfirm}
          currentDifficulty={difficulty}
          newDifficulty={pendingDifficulty}
          onConfirm={confirmDifficultyChange}
          onCancel={() => {
            setShowDifficultyConfirm(false);
            setPendingDifficulty(null);
          }}
        />

        <MatchModeConfirmModal
          show={showMatchModeConfirm}
          isEnabling={pendingMatchMode}
          onConfirm={confirmMatchModeChange}
          onCancel={() => {
            setShowMatchModeConfirm(false);
            setPendingMatchMode(false);
          }}
        />

        <StatsModal
          show={showStatsModal}
          stats={stats}
          derivedStats={derivedStats}
          onClose={() => setShowStatsModal(false)}
          onReset={() => {
            resetAllStats();
            setShowStatsModal(false);
          }}
        />

        <AchievementsModal
          show={showAchievementsModal}
          achievements={getAllAchievements()}
          completionStats={getCompletionStats()}
          onClose={() => setShowAchievementsModal(false)}
        />

        <ChallengeRulesModal
          show={showChallengeRules}
          onClose={() => setShowChallengeRules(false)}
        />

        <DebugModal
          show={showDebugModal}
          onClose={() => setShowDebugModal(false)}
          progression={progression}
          abilities={abilities}
          scores={scores}
          setScores={setScores}
          onAutoWin={handleDebugAutoWin}
          gameOver={gameOver}
        />

        <ShopModal
          show={showShopModal}
          onClose={() => setShowShopModal(false)}
          prestigePoints={0}
        />

        <ChallengeModeConfirmModal
          show={showChallengeModeConfirm}
          currentMode={gameMode}
          onConfirm={confirmChallengeModeChange}
          onCancel={() => {
            setShowChallengeModeConfirm(false);
            setPendingGameMode(null);
          }}
        />

        <GameModeConfirmModal
          show={showGameModeConfirm}
          currentMode={gameMode}
          newMode={pendingGameMode}
          onConfirm={confirmGameModeChange}
          onCancel={() => {
            setShowGameModeConfirm(false);
            setPendingGameMode(null);
          }}
        />

        {/* Achievement Notifications */}
        {newlyUnlocked.map(achievementId => (
          <AchievementNotification
            key={achievementId}
            achievement={getAchievement(achievementId)}
            onDismiss={() => dismissNotification(achievementId)}
          />
        ))}

        {/* Strategy Tip (Practice mode only) */}
        {gameMode === GAME_MODES.PRACTICE && (
          <StrategyTip
            tip={activeTip}
            onDismiss={dismissTip}
            onApply={(tipId) => dismissTip(tipId, true)}
          />
        )}

        {/* Abilities Panel */}
        <AbilitiesPanel
          unlockedAbilities={unlockedAbilities}
          equippedAbilities={equippedAbilities}
          abilityUses={abilityUses}
          onUseAbility={handleUseAbility}
          disabled={currentTurn !== 'player' || gameOver}
          getMeldMasterLevel={getMeldMasterLevel}
        />

        {/* Dev Panel */}
        <DevPanel
          unlockedAbilities={unlockedAbilities}
          onUnlockActiveAbility={abilities.unlockActiveAbility}
          onUpgradePassiveAbility={abilities.upgradePassiveAbility}
          onResetAbilities={resetAllAbilities}
        />

        {/* Ability Modals */}
        <DeckPeekModal
          show={showDeckPeekModal}
          cards={deckPeekCards}
          onClose={() => setShowDeckPeekModal(false)}
        />

        <CardSwapModal
          show={showCardSwapModal}
          hand={playerHand}
          onSwap={handleCardSwap}
          onClose={() => setShowCardSwapModal(false)}
        />

        <LuckyDrawModal
          show={showLuckyDrawModal}
          cards={luckyDrawCards}
          onSelectCard={handleLuckyDrawSelection}
          onClose={() => {}}
        />

        {/* Flying Card Animations */}
        {flyingCards.map(flyingCard => (
          <AnimatedCard
            key={flyingCard.id}
            card={flyingCard.card}
            hidden={flyingCard.hidden}
            fromPosition={flyingCard.fromPosition}
            toPosition={flyingCard.toPosition}
            duration={flyingCard.duration}
            onComplete={flyingCard.onComplete}
          />
        ))}

        {/* Level Up Modal */}
        <LevelUpModal
          show={progression.showLevelUpModal}
          newLevel={progression.levelUpData?.newLevel}
          apGained={progression.levelUpData?.apGained}
          onClose={progression.closeLevelUpModal}
        />

        {/* Tier Milestone Modal (Challenge Mode) */}
        <TierMilestoneModal
          show={showTierMilestone}
          milestone={tierMilestone}
          roundResult={tierMilestone?.roundResult}
          onClose={() => {
            setShowTierMilestone(false);
            setRoundEndData(null); // Also clear round end data since we showed it in tier modal
            startNewRound(); // Start next round immediately after tier advancement
          }}
        />

        {/* Abilities Shop Modal */}
        <AbilitiesShopModal
          show={showAbilitiesShop}
          onClose={() => setShowAbilitiesShop(false)}
          abilities={abilities}
          progression={progression}
        />

        {/* Rules */}
        <div className="mt-8 p-6 bg-gray-900 bg-opacity-70 rounded-lg border-2 border-amber-800">
          <h3 className="text-xl font-bold text-amber-400 mb-3">♦️ The Ancient Rules of the Tavern ♦️</h3>
          <div className="text-amber-200 text-sm space-y-2">
            <p><strong>Your Quest:</strong> Forge melds (sets of 3+ cards of matching rank, or runs of 3+ cards in sequence of the same suit) and reduce your deadwood to 10 points or less, then strike the table to knock!</p>
            <p><strong>Your Turn:</strong> Draw a card from the deck or pluck one from the discard pile, then cast aside one card of your choosing.</p>
            <p><strong>Knocking:</strong> After discarding, if your deadwood is 10 or less, you may knock upon the table to end the round and challenge your opponent!</p>
            <p><strong>The Reckoning:</strong> The victor claims gold equal to the difference in deadwood. Achieving GIN (0 deadwood) bestows a mighty +25 gold bonus! Beware: knocking with higher deadwood than your opponent results in an UNDERCUT, granting them +25 gold instead!</p>
            <p><strong>Words of Wisdom:</strong> Build your melds with care, minimize deadwood with cunning, and time your knock with precision! Fortune favors the shrewd!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavernRummy;
