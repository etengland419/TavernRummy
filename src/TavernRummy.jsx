import React, { useState, useEffect, useRef, useMemo } from 'react';

// Constants
import { GAME_CONFIG, DIFFICULTY_LEVELS } from './utils/constants';

// Utilities
import { createDeck } from './utils/cardUtils';
import { findMelds, calculateDeadwood, sortHand } from './utils/meldUtils';
import { calculateRoundResult, checkMatchWinner } from './utils/scoringUtils';

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

// Hooks
import { useTutorial } from './hooks/useTutorial';

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
  const [sortCards, setSortCards] = useState(true);

  // UI State
  const [newlyDrawnCard, setNewlyDrawnCard] = useState(null);
  const [discardingCard, setDiscardingCard] = useState(null);
  const [aiDrawnCard, setAiDrawnCard] = useState(null);
  const [aiDiscardedCard, setAiDiscardedCard] = useState(null);
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);

  // Refs
  const deckRef = useRef(null);
  const discardRef = useRef(null);
  const playerHandRef = useRef(null);

  // Memoized calculations
  const playerMelds = useMemo(() => findMelds(playerHand), [playerHand]);
  const playerDeadwood = useMemo(() => calculateDeadwood(playerHand), [playerHand]);
  const sortedPlayerHand = useMemo(() => sortHand(playerHand, sortCards), [playerHand, sortCards]);

  // Tutorial hook
  const { tutorialMessage, tutorialHighlight, setTutorialHighlight } = useTutorial(
    difficulty,
    phase,
    playerHand,
    discardPile,
    deck
  );

  // Initialize game on mount
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } else {
      if (discardPile.length === 0) return;
      drawnCard = newDiscard.pop();
      setDiscardPile(newDiscard);
    }

    const newHand = [...playerHand, drawnCard];
    setPlayerHand(newHand);
    setNewlyDrawnCard(drawnCard.id);
    setPhase('discard');
    setMessage('Discard a card or knock');

    setTimeout(() => setNewlyDrawnCard(null), 800);
  };

  const discardCard = (card) => {
    if (currentTurn !== 'player' || phase !== 'discard') return;

    setDiscardingCard(card.id);

    setTimeout(() => {
      const newHand = playerHand.filter(c => c.id !== card.id);
      setPlayerHand(newHand);
      setDiscardPile([...discardPile, card]);
      setDiscardingCard(null);
      setPhase('draw');
      setCurrentTurn('ai');
      setMessage("The Hooded Stranger's turn...");
      setTutorialHighlight(null);

      setTimeout(() => aiTurn(newHand), 1000);
    }, 300);
  };

  const knock = () => {
    const deadwood = calculateDeadwood(playerHand);
    if (deadwood <= GAME_CONFIG.KNOCK_THRESHOLD && phase === 'discard') {
      endRound('player');
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
        ? "The Hooded Stranger takes from the discard pile..."
        : "The Hooded Stranger draws from the deck...";
      setMessage(drawMessage);
      setAiDrawnCard(decision.drawnCard.id);

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
        setMessage("The Hooded Stranger considers their hand...");

        setTimeout(() => {
          setMessage("The Hooded Stranger discards...");
          setAiDiscardedCard(decision.discardCard.id);

          setTimeout(() => {
            setAiHand(decision.finalHand);
            setDiscardPile([...discardPile, decision.discardCard]);
            setAiDiscardedCard(null);

            if (decision.shouldKnock) {
              setTimeout(() => {
                setMessage("The Hooded Stranger knocks!");
                setTimeout(() => endRound('ai'), 800);
              }, 500);
            } else {
              setCurrentTurn('player');
              setPhase('draw');
              setMessage('Your turn - Draw a card');
            }
          }, 800);
        }, 1200);
      }, 1500);
    }, 800);
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
      setTimeout(() => setScoreAnimation(null), 2000);
    }

    // Check for match winner
    const winner = checkMatchWinner(newScores, matchMode);
    if (winner) {
      setMatchWinner(winner);
    }

    setScores(newScores);
    setRoundEndData(result);

    // Show tutorial completion prompt
    if (difficulty === DIFFICULTY_LEVELS.TUTORIAL && result.winner !== 'draw') {
      setTimeout(() => setShowTutorialComplete(true), 1500);
    }
  };

  const changeDifficulty = (newDifficulty) => {
    if (difficulty === DIFFICULTY_LEVELS.TUTORIAL && newDifficulty !== DIFFICULTY_LEVELS.TUTORIAL) {
      setPendingDifficulty(newDifficulty);
      setShowDifficultyConfirm(true);
    } else {
      setDifficulty(newDifficulty);
    }
  };

  const confirmDifficultyChange = () => {
    setDifficulty(pendingDifficulty);
    setShowDifficultyConfirm(false);
  };

  const handleMatchModeToggle = () => {
    setMatchMode(!matchMode);
    setScores({ player: 0, ai: 0 });
    setMatchWinner(null);
    startNewRound();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900 text-amber-100 p-8 relative overflow-hidden">
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
              onClick={() => setSortCards(!sortCards)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                sortCards
                  ? 'bg-teal-600 border-teal-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🔄 Auto-Sort
            </button>
          </div>
        </div>

        {/* Score Display */}
        <ScoreDisplay scores={scores} scoreAnimation={scoreAnimation} />

        {/* Game Messages */}
        <div className="mb-4 text-center">
          <div className="inline-block px-6 py-3 bg-amber-900 bg-opacity-70 border-2 border-amber-600 rounded-lg">
            <p className="text-amber-200 font-semibold">{message}</p>
          </div>
        </div>

        {/* Tutorial Message */}
        {tutorialMessage && difficulty === DIFFICULTY_LEVELS.TUTORIAL && (
          <div className="mb-4 px-6 py-4 bg-blue-900 bg-opacity-80 border-2 border-blue-400 rounded-lg">
            <p className="text-blue-200">{tutorialMessage}</p>
          </div>
        )}

        {/* AI Hand */}
        <AIHand
          hand={aiHand}
          gameOver={gameOver}
          aiDrawnCard={aiDrawnCard}
          aiDiscardedCard={aiDiscardedCard}
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
          sortCards={sortCards}
          playerHandRef={playerHandRef}
        />

        {/* Game Controls */}
        <GameControls
          onKnock={knock}
          onNewRound={startNewRound}
          canKnock={playerDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD && phase === 'discard' && currentTurn === 'player'}
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
          onConfirm={confirmDifficultyChange}
          onCancel={() => setShowDifficultyConfirm(false)}
        />

        {/* Rules */}
        <div className="mt-8 p-6 bg-gray-900 bg-opacity-70 rounded-lg border-2 border-amber-800">
          <h3 className="text-xl font-bold text-amber-400 mb-3">♦️ The Ancient Rules ♦️</h3>
          <div className="text-amber-200 text-sm space-y-2">
            <p><strong>Objective:</strong> Form melds (sets of 3+ same rank, or runs of 3+ consecutive cards in same suit) and reduce deadwood to 10 or less, then knock!</p>
            <p><strong>Your Turn:</strong> Draw from deck or discard pile, then discard one card.</p>
            <p><strong>Knocking:</strong> After discarding, if your deadwood is 10 or less, you can knock to end the round.</p>
            <p><strong>Scoring:</strong> Winner gets the difference in deadwood. GIN (0 deadwood) gives +25 gold bonus. Undercut (knocking with higher deadwood) gives opponent +25 gold.</p>
            <p><strong>Strategy:</strong> Build melds, minimize deadwood, and time your knock wisely!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavernRummy;
