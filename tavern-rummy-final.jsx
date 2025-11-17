import React, { useState, useEffect, useRef, useMemo } from 'react';

// Game Constants
const GAME_CONFIG = {
  KNOCK_THRESHOLD: 10,
  GIN_BONUS: 25,
  UNDERCUT_BONUS: 25,
  STARTING_HAND_SIZE: 10,
  MATCH_WIN_SCORE: 100, // NEW: For match mode
};

const TavernRummy = () => {
  // Medieval themed suits
  const suits = ['⚔️', '🏆', '💰', '🔱']; // Swords, Chalices, Coins, Staves
  const suitSymbols = { '⚔️': 'Swords', '🏆': 'Chalices', '💰': 'Coins', '🔱': 'Staves' };
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [phase, setPhase] = useState('draw');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Draw a card from the deck or discard pile');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [roundWinner, setRoundWinner] = useState(null);
  const [newlyDrawnCard, setNewlyDrawnCard] = useState(null);
  const [discardingCard, setDiscardingCard] = useState(null);
  const [scoreAnimation, setScoreAnimation] = useState(null);
  const [difficulty, setDifficulty] = useState('Tutorial');
  const [tutorialMessage, setTutorialMessage] = useState('');
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [showDifficultyConfirm, setShowDifficultyConfirm] = useState(false);
  const [roundEndData, setRoundEndData] = useState(null);
  const [tutorialHighlight, setTutorialHighlight] = useState(null);
  const [aiDrawnCard, setAiDrawnCard] = useState(null);
  const [aiDiscardedCard, setAiDiscardedCard] = useState(null);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);
  const [matchMode, setMatchMode] = useState(false); // NEW: Track if in match mode
  const [matchWinner, setMatchWinner] = useState(null); // NEW: Winner of the match
  const [sortCards, setSortCards] = useState(true); // NEW: Auto-sort toggle

  const deckRef = useRef(null);
  const discardRef = useRef(null);
  const playerHandRef = useRef(null);

  // Initialize deck
  const createDeck = () => {
    const newDeck = [];
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({ 
          suit, 
          rank, 
          value: getRankValue(rank),
          id: `${rank}-${suit}-${Math.random()}`
        });
      });
    });
    return shuffleDeck(newDeck);
  };

  const getRankValue = (rank) => {
    if (rank === 'A') return 1;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  };

  const shuffleDeck = (deck) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // FIXED: Find all valid non-overlapping melds (sets and runs)
  const findMelds = (hand) => {
    // First, find all possible melds (sets and runs)
    const allPossibleMelds = [];
    
    // Find all possible sets (3+ same rank)
    const rankGroups = {};
    hand.forEach(card => {
      if (!rankGroups[card.rank]) rankGroups[card.rank] = [];
      rankGroups[card.rank].push(card);
    });
    
    Object.entries(rankGroups).forEach(([rank, group]) => {
      if (group.length >= 3) {
        // Add all possible combinations of 3+ cards
        if (group.length === 3) {
          allPossibleMelds.push({ cards: group, type: 'set', rank });
        } else if (group.length === 4) {
          allPossibleMelds.push({ cards: group, type: 'set', rank });
          // Also add all combinations of 3
          for (let i = 0; i < group.length; i++) {
            const subset = group.filter((_, idx) => idx !== i);
            allPossibleMelds.push({ cards: subset, type: 'set', rank });
          }
        }
      }
    });
    
    // Find all possible runs (3+ consecutive same suit)
    suits.forEach(suit => {
      const suitCards = hand.filter(c => c.suit === suit).sort((a, b) => {
        return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
      });
      
      if (suitCards.length >= 3) {
        for (let i = 0; i <= suitCards.length - 3; i++) {
          const run = [suitCards[i]];
          for (let j = i + 1; j < suitCards.length; j++) {
            const prevRankIndex = ranks.indexOf(run[run.length - 1].rank);
            const currRankIndex = ranks.indexOf(suitCards[j].rank);
            if (currRankIndex === prevRankIndex + 1) {
              run.push(suitCards[j]);
            } else {
              break;
            }
          }
          if (run.length >= 3) {
            allPossibleMelds.push({ cards: run, type: 'run', suit });
          }
        }
      }
    });
    
    // Now find the best non-overlapping combination using greedy algorithm
    // Sort by meld size (prefer longer melds)
    allPossibleMelds.sort((a, b) => b.cards.length - a.cards.length);
    
    const usedCardIds = new Set();
    const finalMelds = [];
    
    for (const meld of allPossibleMelds) {
      // Check if any card in this meld has already been used
      const hasOverlap = meld.cards.some(card => usedCardIds.has(card.id));
      
      if (!hasOverlap) {
        finalMelds.push(meld.cards);
        meld.cards.forEach(card => usedCardIds.add(card.id));
      }
    }
    
    return finalMelds;
  };

  // Calculate deadwood value
  const calculateDeadwood = (hand) => {
    const melds = findMelds(hand);
    const meldedCards = new Set(melds.flat());
    const deadwood = hand.filter(card => !meldedCards.has(card));
    return deadwood.reduce((sum, card) => sum + card.value, 0);
  };

  // NEW: Memoized meld calculation for player hand
  const playerMelds = useMemo(() => findMelds(playerHand), [playerHand]);
  const playerDeadwood = useMemo(() => calculateDeadwood(playerHand), [playerHand]);

  // NEW: Helper to check if a card is in a meld
  const isCardInMeld = (cardId, melds) => {
    return melds.some(meld => meld.some(card => card.id === cardId));
  };

  // NEW: Get meld color for visual highlighting
  const getMeldColor = (cardId, melds) => {
    for (let i = 0; i < melds.length; i++) {
      if (melds[i].some(card => card.id === cardId)) {
        const colors = ['border-green-500', 'border-blue-500', 'border-purple-500', 'border-yellow-500'];
        return colors[i % colors.length];
      }
    }
    return null;
  };

  // NEW: Sort cards by rank first, then suit within rank, with melds at front
  const sortHand = (hand) => {
    if (!sortCards) return hand;
    
    const melds = findMelds(hand);
    const meldedCardIds = new Set(melds.flat().map(card => card.id));
    
    // Separate melded and non-melded cards
    const meldedCards = hand.filter(card => meldedCardIds.has(card.id));
    const deadwoodCards = hand.filter(card => !meldedCardIds.has(card.id));
    
    // Sort function: by rank first, then by suit within rank
    const sortByRankThenSuit = (a, b) => {
      const rankDiff = ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
      if (rankDiff !== 0) return rankDiff;
      return suits.indexOf(a.suit) - suits.indexOf(b.suit);
    };
    
    // Sort melded cards (keeping meld groups together)
    const sortedMeldedCards = [];
    melds.forEach(meld => {
      const sortedMeld = [...meld].sort(sortByRankThenSuit);
      sortedMeldedCards.push(...sortedMeld);
    });
    
    // Sort deadwood cards
    const sortedDeadwood = [...deadwoodCards].sort(sortByRankThenSuit);
    
    // Return melds first, then deadwood
    return [...sortedMeldedCards, ...sortedDeadwood];
  };

  // Memoize sorted player hand
  const sortedPlayerHand = useMemo(() => sortHand(playerHand), [playerHand, sortCards]);

  // UPDATED: Tutorial guidance with highlighting
  const updateTutorialGuidance = (currentPhase, currentHand, currentDiscard, currentDeck, currentDifficulty = difficulty) => {
    if (currentDifficulty !== 'Tutorial') {
      setTutorialMessage('');
      setTutorialHighlight(null);
      return;
    }

    if (currentPhase === 'draw') {
      const topDiscard = currentDiscard[currentDiscard.length - 1];
      if (topDiscard) {
        const testHand = [...currentHand, topDiscard];
        const currentDeadwood = calculateDeadwood(currentHand);
        const testDeadwood = calculateDeadwood(testHand);
        const currentMelds = findMelds(currentHand).length;
        const testMelds = findMelds(testHand).length;

        if (testDeadwood < currentDeadwood) {
          setTutorialMessage(`💡 TIP: Take the ${topDiscard.rank} of ${suitSymbols[topDiscard.suit]} from discard! It reduces your deadwood from ${currentDeadwood} to ${testDeadwood}.`);
          setTutorialHighlight('discard');
        } else if (testMelds > currentMelds) {
          setTutorialMessage(`💡 TIP: Take the ${topDiscard.rank} of ${suitSymbols[topDiscard.suit]} from discard! It forms a new meld.`);
          setTutorialHighlight('discard');
        } else {
          setTutorialMessage(`💡 TIP: Draw from the deck. The ${topDiscard.rank} of ${suitSymbols[topDiscard.suit]} doesn't help you.`);
          setTutorialHighlight('deck');
        }
      } else {
        setTutorialMessage(`💡 TIP: Draw from the deck to get a new card.`);
        setTutorialHighlight('deck');
      }
    } else if (currentPhase === 'discard') {
      const melds = findMelds(currentHand);
      const meldedCards = new Set(melds.flat());
      const deadwoodCards = currentHand.filter(c => !meldedCards.has(c));
      
      const currentDeadwood = calculateDeadwood(currentHand);
      
      // UPDATED: Explain knock rules clearly
      if (currentDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD) {
        if (currentDeadwood === 0) {
          setTutorialMessage(`💡 TIP: You have GIN (0 deadwood)! Discard any card, then knock for a ${GAME_CONFIG.GIN_BONUS} gold bonus!`);
          setTutorialHighlight('knock');
        } else {
          setTutorialMessage(`💡 TIP: You have ${currentDeadwood} deadwood (${GAME_CONFIG.KNOCK_THRESHOLD} or less). After discarding, you can KNOCK to end the round! Lower deadwood than your opponent wins.`);
          setTutorialHighlight('knock');
        }
      } else {
        if (deadwoodCards.length > 0) {
          const sortedDeadwood = deadwoodCards.sort((a, b) => {
            if (b.value !== a.value) return b.value - a.value;
            return suits.indexOf(a.suit) - suits.indexOf(b.suit);
          });
          
          const worstCard = sortedDeadwood[0];
          setTutorialMessage(`💡 TIP: Discard your ${worstCard.rank} of ${suitSymbols[worstCard.suit]} (${worstCard.value} points). Try to get your deadwood to ${GAME_CONFIG.KNOCK_THRESHOLD} or less to knock!`);
          setTutorialHighlight(worstCard.id);
        } else {
          setTutorialMessage(`💡 TIP: All your cards are in melds! Discard any card and knock with 0 deadwood for GIN!`);
          setTutorialHighlight('knock');
        }
      }
    }
  };

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const newDeck = createDeck();
    const playerCards = newDeck.splice(0, 10);
    const aiCards = newDeck.splice(0, 10);
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
    
    updateTutorialGuidance('draw', playerCards, firstDiscard, newDeck);
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
    
    updateTutorialGuidance('discard', newHand, newDiscard, newDeck);
    
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
      // AI draws
      let newAiHand = [...aiHand];
      let newDeck = [...deck];
      let newDiscard = [...discardPile];
      
      if (newDeck.length === 0) {
        setMessage('Deck is empty! Round ends in a draw.');
        handleDraw();
        return;
      }
      
      // Smart AI: take from discard if it reduces deadwood
      const topDiscard = newDiscard[newDiscard.length - 1];
      let drawnCard;
      let drawSource;
      
      if (topDiscard) {
        const testHand = [...newAiHand, topDiscard];
        const currentDeadwood = calculateDeadwood(newAiHand);
        const testDeadwood = calculateDeadwood(testHand);
        
        // IMPROVED: AI difficulty affects decision making
        let shouldTakeDiscard = false;
        
        if (difficulty === 'Hard') {
          // Hard AI: Always takes if it reduces deadwood OR forms new meld
          const currentMelds = findMelds(newAiHand).length;
          const testMelds = findMelds(testHand).length;
          shouldTakeDiscard = testDeadwood < currentDeadwood || testMelds > currentMelds;
        } else if (difficulty === 'Medium') {
          // Medium AI: Takes if significantly reduces deadwood (70% chance)
          shouldTakeDiscard = testDeadwood < currentDeadwood && Math.random() > 0.3;
        } else {
          // Easy/Tutorial AI: Takes if greatly reduces deadwood (50% chance)
          shouldTakeDiscard = testDeadwood < currentDeadwood - 2 && Math.random() > 0.5;
        }
        
        if (shouldTakeDiscard) {
          drawnCard = newDiscard.pop();
          setDiscardPile(newDiscard);
          drawSource = 'discard';
          setMessage("The Hooded Stranger takes from the discard pile...");
        } else {
          drawnCard = newDeck.pop();
          setDeck(newDeck);
          drawSource = 'deck';
          setMessage("The Hooded Stranger draws from the deck...");
        }
      } else {
        drawnCard = newDeck.pop();
        setDeck(newDeck);
        drawSource = 'deck';
        setMessage("The Hooded Stranger draws from the deck...");
      }
      
      // Show AI drawing animation
      setAiDrawnCard(drawnCard.id);
      newAiHand.push(drawnCard);
      
      setTimeout(() => {
        setAiDrawnCard(null);
        setMessage("The Hooded Stranger considers their hand...");
        
        setTimeout(() => {
          // AI discards worst card
          const melds = findMelds(newAiHand);
          const meldedCards = new Set(melds.flat());
          const deadwoodCards = newAiHand.filter(c => !meldedCards.has(c));
          
          let cardToDiscard;
          if (deadwoodCards.length > 0) {
            deadwoodCards.sort((a, b) => b.value - a.value);
            cardToDiscard = deadwoodCards[0];
          } else {
            cardToDiscard = newAiHand[0];
          }
          
          setMessage("The Hooded Stranger discards...");
          setAiDiscardedCard(cardToDiscard.id);
          
          setTimeout(() => {
            newAiHand = newAiHand.filter(c => c.id !== cardToDiscard.id);
            setAiHand(newAiHand);
            setDiscardPile([...newDiscard, cardToDiscard]);
            setAiDiscardedCard(null);
            
            // Check if AI should knock - IMPROVED strategy
            const aiDeadwood = calculateDeadwood(newAiHand);
            let shouldKnock = false;
            
            if (difficulty === 'Hard') {
              // Hard: Knocks at 10 or less
              shouldKnock = aiDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD;
            } else if (difficulty === 'Medium') {
              // Medium: Knocks at 7 or less
              shouldKnock = aiDeadwood <= 7;
            } else {
              // Easy/Tutorial: Knocks at 5 or less
              shouldKnock = aiDeadwood <= 5;
            }
            
            if (shouldKnock) {
              setTimeout(() => {
                setMessage("The Hooded Stranger knocks!");
                setTimeout(() => endRound('ai'), 800);
              }, 500);
            } else {
              setCurrentTurn('player');
              setPhase('draw');
              setMessage('Your turn - Draw a card');
              updateTutorialGuidance('draw', playerCurrentHand, [...newDiscard, cardToDiscard], newDeck);
            }
          }, 800);
        }, 1200);
      }, 1500);
    }, 800);
  };

  // NEW: Handle draw/tie situation
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
    const playerDeadwood = calculateDeadwood(playerHand);
    const aiDeadwood = calculateDeadwood(aiHand);
    
    setGameOver(true);
    setTutorialHighlight(null);
    
    let winner, scoreDiff, reason;
    
    // Handle draw case
    if (playerDeadwood === aiDeadwood) {
      winner = 'draw';
      scoreDiff = 0;
      reason = `Both players knocked with ${playerDeadwood} deadwood. It's a draw!`;
    } else if (knocker === 'player') {
      if (playerDeadwood < aiDeadwood) {
        winner = 'player';
        scoreDiff = aiDeadwood - playerDeadwood;
        if (playerDeadwood === 0) {
          scoreDiff += GAME_CONFIG.GIN_BONUS;
          reason = `GIN! You win ${scoreDiff} gold (${GAME_CONFIG.GIN_BONUS} bonus for 0 deadwood)!`;
        } else {
          reason = `You win ${scoreDiff} gold!`;
        }
      } else {
        winner = 'ai';
        scoreDiff = playerDeadwood - aiDeadwood + GAME_CONFIG.UNDERCUT_BONUS;
        reason = `Undercut! The Stranger wins ${scoreDiff} gold (${GAME_CONFIG.UNDERCUT_BONUS} undercut bonus)!`;
      }
    } else {
      if (aiDeadwood < playerDeadwood) {
        winner = 'ai';
        scoreDiff = playerDeadwood - aiDeadwood;
        if (aiDeadwood === 0) {
          scoreDiff += GAME_CONFIG.GIN_BONUS;
          reason = `The Stranger got GIN! They win ${scoreDiff} gold (${GAME_CONFIG.GIN_BONUS} bonus)!`;
        } else {
          reason = `The Stranger wins ${scoreDiff} gold!`;
        }
      } else {
        winner = 'player';
        scoreDiff = aiDeadwood - playerDeadwood + GAME_CONFIG.UNDERCUT_BONUS;
        reason = `Undercut! You win ${scoreDiff} gold (${GAME_CONFIG.UNDERCUT_BONUS} undercut bonus)!`;
      }
    }
    
    setRoundWinner(winner);
    
    // Update scores
    const newScores = { ...scores };
    if (winner !== 'draw') {
      newScores[winner] += scoreDiff;
      setScoreAnimation(winner);
      setTimeout(() => setScoreAnimation(null), 2000);
    }
    
    // NEW: Check for match winner
    if (matchMode && (newScores.player >= GAME_CONFIG.MATCH_WIN_SCORE || newScores.ai >= GAME_CONFIG.MATCH_WIN_SCORE)) {
      const matchWinnerPlayer = newScores.player >= GAME_CONFIG.MATCH_WIN_SCORE ? 'player' : 'ai';
      setMatchWinner(matchWinnerPlayer);
    }
    
    setScores(newScores);
    
    setRoundEndData({
      winner,
      playerDeadwood,
      aiDeadwood,
      scoreDiff,
      reason
    });
    
    // If in tutorial mode, show tutorial completion prompt
    if (difficulty === 'Tutorial' && winner !== 'draw') {
      setTimeout(() => setShowTutorialComplete(true), 1500);
    }
  };

  const changeDifficulty = (newDifficulty) => {
    if (difficulty === 'Tutorial' && newDifficulty !== 'Tutorial') {
      setPendingDifficulty(newDifficulty);
      setShowDifficultyConfirm(true);
    } else {
      setDifficulty(newDifficulty);
      setTutorialMessage('');
      setTutorialHighlight(null);
    }
  };

  const confirmDifficultyChange = () => {
    setDifficulty(pendingDifficulty);
    setTutorialMessage('');
    setTutorialHighlight(null);
    setShowDifficultyConfirm(false);
  };

  const PlayingCard = ({ card, onClick, hidden = false, highlight = false }) => {
    const isRed = ['♥', '♦', '🏆', '💰'].includes(card.suit);
    const isNew = newlyDrawnCard === card.id;
    const isDiscarding = discardingCard === card.id;
    const isAiDrawing = aiDrawnCard === card.id;
    const isAiDiscarding = aiDiscardedCard === card.id;
    const shouldHighlight = tutorialHighlight === card.id;
    
    // NEW: Check if card is in a meld and get its color
    const inMeld = !hidden && isCardInMeld(card.id, playerMelds);
    const meldColor = !hidden ? getMeldColor(card.id, playerMelds) : null;
    
    return (
      <div
        onClick={onClick}
        className={`
          relative w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center
          cursor-pointer transition-all duration-300 shadow-lg
          ${hidden ? 'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-800'}
          ${inMeld && meldColor ? `${meldColor} border-4` : ''}
          ${isNew ? 'animate-pulse ring-2 ring-green-400' : ''}
          ${isDiscarding ? 'opacity-50 scale-90' : ''}
          ${isAiDrawing ? 'ring-4 ring-purple-400 animate-[pulse_1s_ease-in-out_3]' : ''}
          ${isAiDiscarding ? 'ring-4 ring-red-400 animate-[pulse_0.8s_ease-in-out_2]' : ''}
          ${shouldHighlight ? 'ring-4 ring-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}
          ${!hidden && !inMeld ? 'hover:transform hover:-translate-y-1' : ''}
        `}
      >
        {!hidden ? (
          <>
            <div className={`text-2xl font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.rank}
            </div>
            <div className="text-3xl my-1">{card.suit}</div>
            <div className={`text-xs ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.value}
            </div>
            {inMeld && (
              <div className="absolute top-0 right-0 text-xs bg-white rounded-bl px-1">
                ✓
              </div>
            )}
          </>
        ) : (
          <div className="text-amber-600 text-4xl">🃏</div>
        )}
      </div>
    );
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
          
          {/* Difficulty buttons - always visible */}
          <div className="flex gap-3 justify-center mb-3">
            <button
              onClick={() => changeDifficulty('Tutorial')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                difficulty === 'Tutorial'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📚 Tutorial
            </button>
            <button
              onClick={() => changeDifficulty('Easy')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                difficulty === 'Easy'
                  ? 'bg-green-600 border-green-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              😊 Easy
            </button>
            <button
              onClick={() => changeDifficulty('Medium')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                difficulty === 'Medium'
                  ? 'bg-yellow-600 border-yellow-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎯 Medium
            </button>
            <button
              onClick={() => changeDifficulty('Hard')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                difficulty === 'Hard'
                  ? 'bg-red-600 border-red-400 text-white shadow-lg'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔥 Hard
            </button>
          </div>
          
          {/* NEW: Game Options */}
          <div className="flex gap-3 justify-center items-center text-sm">
            <button
              onClick={() => {
                setMatchMode(!matchMode);
                setScores({ player: 0, ai: 0 });
                setMatchWinner(null);
                startNewRound();
              }}
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
        <div className="flex justify-between items-center mb-6 px-8">
          <div className={`text-center transition-all duration-500 ${scoreAnimation === 'player' ? 'scale-110' : ''}`}>
            <div className="text-sm text-amber-400 uppercase font-bold">Your Gold</div>
            <div className="text-4xl font-bold text-yellow-300 flex items-center gap-2">
              💰 {scores.player}
            </div>
          </div>
          
          <div className={`text-center transition-all duration-500 ${scoreAnimation === 'ai' ? 'scale-110' : ''}`}>
            <div className="text-sm text-amber-400 uppercase font-bold">Stranger's Gold</div>
            <div className="text-4xl font-bold text-pink-300 flex items-center gap-2">
              💰 {scores.ai}
            </div>
          </div>
        </div>

        {/* Game Messages */}
        <div className="mb-4 text-center">
          <div className="inline-block px-6 py-3 bg-amber-900 bg-opacity-70 border-2 border-amber-600 rounded-lg">
            <p className="text-amber-200 font-semibold">{message}</p>
          </div>
        </div>

        {/* Tutorial Message */}
        {tutorialMessage && difficulty === 'Tutorial' && (
          <div className="mb-4 px-6 py-4 bg-blue-900 bg-opacity-80 border-2 border-blue-400 rounded-lg">
            <p className="text-blue-200">{tutorialMessage}</p>
          </div>
        )}

        {/* AI Hand */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">👤</span>
            <h2 className="text-xl font-bold text-amber-400">The Hooded Stranger</h2>
          </div>
          <div className="flex justify-center gap-2">
            {aiHand.map((card, index) => (
              <div key={card.id} style={{ transform: `translateY(${index % 2 === 0 ? '-5px' : '5px'})` }}>
                <PlayingCard card={card} hidden={!gameOver} />
              </div>
            ))}
          </div>
        </div>

        {/* Draw and Discard Piles */}
        <div className="flex justify-center gap-8 mb-8">
          {/* Draw Pile */}
          <div 
            className={`relative ${tutorialHighlight === 'deck' ? 'ring-4 ring-blue-400 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
            ref={deckRef}
          >
            <div className="text-center mb-2">
              <p className="text-amber-300 font-bold">Draw Pile ({deck.length})</p>
            </div>
            <div
              onClick={() => drawCard('deck')}
              className={`
                relative w-24 h-36 rounded-lg border-3 border-amber-700
                bg-gradient-to-br from-amber-900 to-amber-950
                flex items-center justify-center cursor-pointer
                transition-all duration-200 shadow-2xl
                ${currentTurn === 'player' && phase === 'draw' && deck.length > 0 ? 'hover:scale-105 hover:shadow-yellow-500/50' : 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="text-amber-600 text-5xl">🃏</div>
              {deck.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                  <span className="text-red-400 font-bold">Empty</span>
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div 
            className={`relative ${tutorialHighlight === 'discard' ? 'ring-4 ring-blue-400 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
            ref={discardRef}
          >
            <div className="text-center mb-2">
              <p className="text-amber-300 font-bold">Discard Pile</p>
            </div>
            {discardPile.length > 0 ? (
              <div onClick={() => drawCard('discard')}>
                <PlayingCard 
                  card={discardPile[discardPile.length - 1]} 
                  onClick={() => drawCard('discard')}
                />
              </div>
            ) : (
              <div className="w-24 h-36 rounded-lg border-3 border-dashed border-amber-700 flex items-center justify-center bg-amber-950 bg-opacity-50">
                <span className="text-amber-600 text-sm">Empty</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Hand */}
        <div ref={playerHandRef}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-xl font-bold text-amber-400">Your Hand</h2>
            {sortCards && playerMelds.length > 0 && (
              <span className="text-xs text-amber-500">(Melds first, then deadwood)</span>
            )}
          </div>
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            {sortedPlayerHand.map((card, index) => {
              // Check if we're at the transition from melds to deadwood
              const isFirstDeadwood = sortCards && playerMelds.length > 0 && 
                index === playerMelds.flat().length;
              
              return (
                <React.Fragment key={card.id}>
                  {isFirstDeadwood && (
                    <div className="w-1 h-28 bg-amber-600 rounded mx-2 opacity-50"></div>
                  )}
                  <PlayingCard
                    card={card}
                    onClick={() => phase === 'discard' && currentTurn === 'player' && discardCard(card)}
                  />
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Player Info with Meld Legend */}
          <div className="text-center text-amber-300 mb-4">
            <p>Deadwood: <span className="font-bold text-yellow-400">{playerDeadwood}</span> points</p>
            <p className="text-sm text-amber-400 mt-1">
              {playerMelds.length > 0 ? `${playerMelds.length} meld(s) formed` : 'No melds yet'}
            </p>
            {playerMelds.length > 0 && (
              <div className="flex justify-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 border-2 border-green-500 rounded"></span>
                  Meld 1
                </span>
                {playerMelds.length > 1 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 border-2 border-blue-500 rounded"></span>
                    Meld 2
                  </span>
                )}
                {playerMelds.length > 2 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 border-2 border-purple-500 rounded"></span>
                    Meld 3
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={knock}
            disabled={playerDeadwood > GAME_CONFIG.KNOCK_THRESHOLD || phase !== 'discard' || currentTurn !== 'player'}
            className={`
              px-6 py-3 rounded-lg font-bold text-lg border-3 transition-all transform
              ${playerDeadwood <= GAME_CONFIG.KNOCK_THRESHOLD && phase === 'discard' && currentTurn === 'player'
                ? `bg-green-700 hover:bg-green-600 border-green-500 text-white hover:scale-105 shadow-lg ${tutorialHighlight === 'knock' ? 'ring-4 ring-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }
            `}
          >
            ⚔️ KNOCK ({playerDeadwood})
          </button>
          
          <button
            onClick={startNewRound}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-lg border-3 border-blue-500 transition-all hover:scale-105 shadow-lg"
          >
            🔄 NEW ROUND
          </button>
        </div>

        {/* Round End Popup */}
        {roundEndData && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
              <h2 className={`text-3xl font-bold mb-4 text-center ${
                roundEndData.winner === 'draw' 
                  ? 'text-gray-400' 
                  : roundEndData.winner === 'player' 
                    ? 'text-yellow-400' 
                    : 'text-pink-400'
              }`}>
                {roundEndData.winner === 'draw' ? '⚖️ Stalemate!' : roundEndData.winner === 'player' ? '🏆 Victory!' : '💀 Defeat!'}
              </h2>
              
              <div className="space-y-3 mb-6 text-amber-100">
                <p className="text-center text-lg">{roundEndData.reason}</p>
                <div className="flex justify-between border-t border-amber-700 pt-3">
                  <span>Your Deadwood:</span>
                  <span className="font-bold text-yellow-400">{roundEndData.playerDeadwood}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stranger's Deadwood:</span>
                  <span className="font-bold text-pink-400">{roundEndData.aiDeadwood}</span>
                </div>
                {roundEndData.winner !== 'draw' && (
                  <div className="flex justify-between border-t border-amber-700 pt-3 font-bold">
                    <span>Gold {roundEndData.winner === 'player' ? 'Won' : 'Lost'}:</span>
                    <span className={roundEndData.winner === 'player' ? 'text-yellow-400' : 'text-pink-400'}>
                      {roundEndData.scoreDiff}
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  setRoundEndData(null);
                  startNewRound();
                }}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-lg border-2 border-amber-400 transition-all"
              >
                Next Round
              </button>
            </div>
          </div>
        )}

        {/* Difficulty Change Confirmation */}
        {showDifficultyConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-amber-600 max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Leave Tutorial Mode?</h2>
              <p className="text-amber-100 mb-6">
                Are you sure you want to leave Tutorial mode? You'll no longer receive helpful tips and guidance.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmDifficultyChange}
                  className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={() => setShowDifficultyConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                >
                  Stay in Tutorial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Complete Prompt */}
        {showTutorialComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]">
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-8 rounded-lg border-4 border-yellow-500 max-w-lg shadow-2xl">
              <div className="text-center mb-4">
                <span className="text-6xl">🎓</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">Tutorial Complete!</h2>
              <p className="text-amber-100 mb-6 text-center text-lg">
                {roundWinner === 'player' 
                  ? "Well done, traveler! You've bested the Hooded Stranger and learned the ways of Tavern Rummy."
                  : "A worthy lesson learned! Even in defeat, you've grasped the fundamentals of Tavern Rummy."
                }
              </p>
              <p className="text-amber-200 mb-8 text-center">
                Would you like to test your skills in a real match? The tutorial tips will be gone, and your opponent will play more strategically!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setDifficulty('Easy');
                    setTutorialMessage('');
                    setTutorialHighlight(null);
                    setShowTutorialComplete(false);
                    setRoundEndData(null);
                    startNewRound();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold text-lg border-2 border-green-500 transition-all transform hover:scale-105"
                >
                  ⚔️ Start Real Match
                </button>
                <button
                  onClick={() => {
                    setShowTutorialComplete(false);
                    setRoundEndData(null);
                    startNewRound();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-lg border-2 border-blue-500 transition-all transform hover:scale-105"
                >
                  📚 Continue Tutorial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Match Winner Popup */}
        {matchWinner && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[70]">
            <div className="bg-gradient-to-br from-amber-900 to-gray-900 p-10 rounded-lg border-4 border-yellow-600 max-w-2xl shadow-2xl">
              <div className="text-center mb-6">
                <span className="text-8xl">
                  {matchWinner === 'player' ? '👑' : '💀'}
                </span>
              </div>
              <h2 className={`text-5xl font-bold mb-6 text-center ${
                matchWinner === 'player' ? 'text-yellow-300' : 'text-pink-300'
              }`}>
                {matchWinner === 'player' ? 'MATCH VICTORY!' : 'MATCH DEFEAT'}
              </h2>
              <div className="text-center text-amber-100 mb-8 space-y-3">
                <p className="text-2xl">
                  {matchWinner === 'player' 
                    ? `You've conquered the tavern with ${scores.player} gold!`
                    : `The Hooded Stranger claims victory with ${scores.ai} gold!`
                  }
                </p>
                <div className="flex justify-center gap-8 text-xl mt-6">
                  <div>
                    <div className="text-amber-400">Your Score</div>
                    <div className="text-3xl font-bold text-yellow-300">{scores.player}</div>
                  </div>
                  <div className="text-4xl text-amber-600">vs</div>
                  <div>
                    <div className="text-amber-400">Stranger's Score</div>
                    <div className="text-3xl font-bold text-pink-300">{scores.ai}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMatchWinner(null);
                  setScores({ player: 0, ai: 0 });
                  startNewRound();
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-2xl border-2 border-amber-400 transition-all transform hover:scale-105"
              >
                🎮 Play Again
              </button>
            </div>
          </div>
        )}

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
