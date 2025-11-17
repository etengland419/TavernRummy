import React, { useState, useEffect, useRef, useMemo } from 'react';

// Constants
import { GAME_CONFIG, DIFFICULTY_LEVELS, ANIMATION_TIMINGS } from './utils/constants';

// Utilities
import { createDeck } from './utils/cardUtils';
import { findMelds, calculateDeadwood, calculateMinDeadwoodAfterDiscard, sortHand } from './utils/meldUtils';
import { calculateRoundResult, checkMatchWinner } from './utils/scoringUtils';
import { getRandomOpponentName } from './utils/opponentNames';

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
import AchievementNotification from './components/UI/AchievementNotification';
import AnimatedCard from './components/UI/AnimatedCard';
import AudioControls from './components/UI/AudioControls';
import SplashScreen from './components/Modals/SplashScreen';

// Hooks
import { useTutorial } from './hooks/useTutorial';
import { useStats } from './hooks/useStats';
import { useAchievements } from './hooks/useAchievements';
import { useAudio } from './hooks/useAudio';
import { useCardAnimation } from './hooks/useCardAnimation';

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

  // Settings
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.TUTORIAL);
  const [matchMode, setMatchMode] = useState(false);
  const [opponentName, setOpponentName] = useState(getRandomOpponentName(DIFFICULTY_LEVELS.TUTORIAL));

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
  const [showSplashScreen, setShowSplashScreen] = useState(true);

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
    // sounds.cardShuffle(); // Sound effects disabled
  };

  const drawCard = (source) => {
    if (currentTurn !== 'player' || phase !== 'draw') return;

    let drawnCard;
    let newDeck = [...deck];
    let newDiscard = [...discardPile];

    if (source === 'deck') {
      if (deck.length === 0) {
        setMessage('Deck is empty! Round ends in a draw.');
        handleDraw();
        return;
      }
      drawnCard = newDeck.pop();
      setDeck(newDeck);
      // sounds.cardDraw(); // Sound effects disabled
      // Add flying card animation from deck to player hand
      addFlyingCard(drawnCard, deckRef, playerHandRef, true);
    } else {
      if (discardPile.length === 0) return;
      drawnCard = newDiscard.pop();
      setDiscardPile(newDiscard);
      // sounds.cardDraw(); // Sound effects disabled
      // Add flying card animation from discard to player hand
      addFlyingCard(drawnCard, discardRef, playerHandRef, false);
    }

    // Delay adding card to hand until animation completes
    setTimeout(() => {
      const newHand = [...playerHand, drawnCard];
      setPlayerHand(newHand);
      setNewlyDrawnCard(drawnCard.id);
      setPhase('discard');
      setMessage('Discard a card or knock');

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

  const aiTurn = (playerCurrentHand) => {
    setTimeout(() => {
      const decision = executeAITurn(aiHand, deck, discardPile, difficulty);

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
        newDiscard.pop();
        setDiscardPile(newDiscard);
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
                setTimeout(() => endRound('ai'), ANIMATION_TIMINGS.KNOCK_ANNOUNCEMENT);
              }, 250);
            } else {
              setCurrentTurn('player');
              setPhase('draw');
              setMessage('Your turn - Draw a card');
            }
          }, ANIMATION_TIMINGS.CARD_DISCARD);
        }, ANIMATION_TIMINGS.AI_DISCARD_DELAY);
      }, ANIMATION_TIMINGS.AI_DRAW_DELAY);
    }, ANIMATION_TIMINGS.AI_TURN_START);
  };

  const handleDraw = () => {
    setGameOver(true);
    setRoundEndData({
      winner: 'draw',
      playerDeadwood: calculateDeadwood(playerHand),
      aiDeadwood: calculateDeadwood(aiHand),
      scoreDiff: 0,
      reason: 'The deck ran out of cards. No gold changes hands.'
    });
    setTutorialHighlight(null);
  };

  const endRound = (knocker) => {
    const result = calculateRoundResult(knocker, playerHand, aiHand);

    setGameOver(true);
    setTutorialHighlight(null);
    setRoundWinner(result.winner);

    // Update scores
    const newScores = { ...scores };
    if (result.winner !== 'draw') {
      newScores[result.winner] += result.scoreDiff;
      setScoreAnimation(result.winner);
      setTimeout(() => setScoreAnimation(null), ANIMATION_TIMINGS.SCORE_ANIMATION);
    }

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
    }

    setScores(newScores);
    setRoundEndData(result);

    // Track game completion in stats
    if (trackGame) {
      trackGame({
        winner: result.winner,
        difficulty: difficulty,
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900 text-amber-100 p-8 relative overflow-hidden">
      {/* Splash Screen */}
      <SplashScreen
        show={showSplashScreen}
        onStart={({ difficulty: selectedDifficulty, matchMode: selectedMatchMode }) => {
          setShowSplashScreen(false);
          // Set the selected difficulty and match mode
          setDifficulty(selectedDifficulty);
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

          {/* Difficulty Selector */}
          <DifficultySelector difficulty={difficulty} onDifficultyChange={changeDifficulty} />

          {/* Game Options */}
          <div className="flex gap-3 justify-center items-center text-sm">
            <button
              onClick={handleMatchModeToggle}
              className={`px-3 py-1 rounded-lg border transition-all ${
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
              className="px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              📊 Statistics
            </button>
            <button
              onClick={() => {
                // sounds.buttonClick(); // Sound effects disabled
                setShowAchievementsModal(true);
              }}
              className="px-3 py-1 rounded-lg border bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 transition-all"
            >
              🏆 Achievements
            </button>
          </div>
        </div>

        {/* Score Display */}
        <ScoreDisplay scores={scores} scoreAnimation={scoreAnimation} />

        {/* Game Messages - Fixed height to prevent layout shifts */}
        <div className="mb-4 text-center min-h-[56px] flex items-center justify-center">
          <div className="px-6 py-3 bg-amber-900 bg-opacity-70 border-2 border-amber-600 rounded-lg">
            <p className="text-amber-200 font-semibold">{message}</p>
          </div>
        </div>

        {/* Tutorial Message - Fixed height container to prevent layout shifts */}
        <div className="mb-4 min-h-[80px] flex items-center justify-center">
          {tutorialMessage && difficulty === DIFFICULTY_LEVELS.TUTORIAL && (
            <div className="px-6 py-4 bg-blue-900 bg-opacity-80 border-2 border-blue-400 rounded-lg w-full">
              <p className="text-blue-200">{tutorialMessage}</p>
            </div>
          )}
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
          roundEndData={roundEndData}
          onNextRound={() => {
            setRoundEndData(null);
            startNewRound();
          }}
        />

        <MatchWinnerModal
          matchWinner={matchWinner}
          scores={scores}
          onPlayAgain={() => {
            setMatchWinner(null);
            setScores({ player: 0, ai: 0 });
            startNewRound();
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

        {/* Achievement Notifications */}
        {newlyUnlocked.map(achievementId => (
          <AchievementNotification
            key={achievementId}
            achievement={getAchievement(achievementId)}
            onDismiss={() => dismissNotification(achievementId)}
          />
        ))}

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
