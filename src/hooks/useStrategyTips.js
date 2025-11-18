import { useState, useEffect, useCallback, useRef } from 'react';
import { evaluateTips, getPrioritizedTip } from '../utils/strategyTips';
import { GAME_MODES } from '../utils/constants';

const TIP_MASTERY_STORAGE_KEY = 'tavernRummy_tipMastery';
const TIP_MASTERY_VERSION = '1.0';

/**
 * Custom hook for managing strategy tips
 * Handles tip evaluation, display, mastery tracking, and persistence
 *
 * @param {string} gameMode - Current game mode (tutorial/practice/challenging)
 * @param {Object} gameContext - Current game state for tip evaluation
 * @returns {Object} Tip state and control functions
 */
export const useStrategyTips = (gameMode, gameContext) => {
  const [activeTip, setActiveTip] = useState(null);
  const [tipMastery, setTipMastery] = useState({});
  const [dismissedThisRound, setDismissedThisRound] = useState(new Set());
  const lastEvaluationRef = useRef(null);
  const tipCooldownRef = useRef(null);

  /**
   * Load tip mastery data from localStorage
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TIP_MASTERY_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === TIP_MASTERY_VERSION) {
          setTipMastery(data.mastery || {});
        }
      }
    } catch (error) {
      console.error('Error loading tip mastery:', error);
    }
  }, []);

  /**
   * Save tip mastery data to localStorage
   */
  const saveTipMastery = useCallback((mastery) => {
    try {
      const data = {
        version: TIP_MASTERY_VERSION,
        mastery,
        lastUpdated: Date.now()
      };
      localStorage.setItem(TIP_MASTERY_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving tip mastery:', error);
    }
  }, []);

  /**
   * Update mastery tracking for a tip
   */
  const updateMastery = useCallback((tipId, applied) => {
    setTipMastery(prev => {
      const current = prev[tipId] || {
        seen: 0,
        applied: 0,
        ignored: 0,
        lastSeen: null
      };

      const updated = {
        ...prev,
        [tipId]: {
          seen: current.seen + 1,
          applied: current.applied + (applied ? 1 : 0),
          ignored: current.ignored + (applied ? 0 : 1),
          lastSeen: Date.now()
        }
      };

      saveTipMastery(updated);
      return updated;
    });
  }, [saveTipMastery]);

  /**
   * Dismiss the current tip
   */
  const dismissTip = useCallback((tipId, applied = false) => {
    // Track mastery
    updateMastery(tipId, applied);

    // Add to dismissed list for this round
    setDismissedThisRound(prev => new Set([...prev, tipId]));

    // Clear active tip
    setActiveTip(null);

    // Set cooldown before showing next tip (3 seconds)
    tipCooldownRef.current = Date.now() + 3000;
  }, [updateMastery]);

  /**
   * Clear dismissed tips (call when starting a new round)
   */
  const clearDismissed = useCallback(() => {
    setDismissedThisRound(new Set());
    setActiveTip(null);
    tipCooldownRef.current = null;
  }, []);

  /**
   * Evaluate and potentially show a new tip
   */
  useEffect(() => {
    // Only show tips in practice mode
    if (gameMode !== GAME_MODES.PRACTICE) {
      setActiveTip(null);
      return;
    }

    // Don't show tips during cooldown
    if (tipCooldownRef.current && Date.now() < tipCooldownRef.current) {
      return;
    }

    // Don't show tip if one is already active
    if (activeTip) {
      return;
    }

    // Evaluate applicable tips based on current game context
    const applicableTips = evaluateTips(gameContext);

    // Filter out tips already dismissed this round
    const availableTips = applicableTips.filter(
      tip => !dismissedThisRound.has(tip.id)
    );

    if (availableTips.length === 0) {
      return;
    }

    // Get prioritized tip based on mastery and context
    const prioritizedTip = getPrioritizedTip(availableTips, tipMastery);

    if (prioritizedTip) {
      // Avoid showing the same tip repeatedly for similar game states
      const contextKey = JSON.stringify({
        phase: gameContext.phase,
        deadwood: Math.floor(gameContext.deadwood / 5) * 5, // Round to nearest 5
        deckSize: Math.floor(gameContext.deckSize / 5) * 5
      });

      if (lastEvaluationRef.current === contextKey + prioritizedTip.id) {
        return; // Same tip for same game state
      }

      lastEvaluationRef.current = contextKey + prioritizedTip.id;
      setActiveTip(prioritizedTip);
    }
  }, [gameMode, gameContext, activeTip, dismissedThisRound, tipMastery]);

  /**
   * Get mastery statistics
   */
  const getMasteryStats = useCallback(() => {
    const stats = {
      totalTipsSeen: 0,
      totalTipsApplied: 0,
      masteryByTier: {
        1: { seen: 0, applied: 0, mastery: 0 },
        2: { seen: 0, applied: 0, mastery: 0 }
      },
      highestMasteryTips: [],
      lowestMasteryTips: []
    };

    Object.entries(tipMastery).forEach(([tipId, data]) => {
      stats.totalTipsSeen += data.seen;
      stats.totalTipsApplied += data.applied;

      // You would need tip metadata to properly categorize by tier
      // For now, we'll just track overall stats
    });

    const overallMastery = stats.totalTipsSeen > 0
      ? (stats.totalTipsApplied / stats.totalTipsSeen) * 100
      : 0;

    return {
      ...stats,
      overallMastery: Math.round(overallMastery)
    };
  }, [tipMastery]);

  /**
   * Reset all tip mastery data
   */
  const resetMastery = useCallback(() => {
    setTipMastery({});
    setDismissedThisRound(new Set());
    setActiveTip(null);
    try {
      localStorage.removeItem(TIP_MASTERY_STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting tip mastery:', error);
    }
  }, []);

  return {
    // Current tip state
    activeTip,

    // Control functions
    dismissTip,
    clearDismissed,

    // Mastery data
    tipMastery,
    getMasteryStats,
    resetMastery
  };
};

/**
 * Helper hook for post-game analysis
 * Analyzes the completed round and generates insights
 *
 * @param {Object} roundData - Data from the completed round
 * @returns {Object} Analysis insights
 */
export const usePostGameAnalysis = (roundData) => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!roundData) {
      setAnalysis(null);
      return;
    }

    const insights = [];
    let strategyScore = 5; // Base score out of 10

    // Analyze knock timing
    if (roundData.playerKnocked) {
      if (roundData.playerDeadwood <= 3) {
        insights.push({
          type: 'positive',
          message: `Excellent knock timing with only ${roundData.playerDeadwood} deadwood`
        });
        strategyScore += 2;
      } else if (roundData.playerDeadwood >= 8) {
        insights.push({
          type: 'warning',
          message: `You knocked with ${roundData.playerDeadwood} deadwood - waiting might have been better`
        });
        strategyScore -= 1;
      } else {
        insights.push({
          type: 'neutral',
          message: `Good knock timing with ${roundData.playerDeadwood} deadwood`
        });
        strategyScore += 1;
      }
    }

    // Analyze Gin achievement
    if (roundData.isGin) {
      insights.push({
        type: 'positive',
        message: '🎉 Perfect Gin! Excellent meld optimization'
      });
      strategyScore += 3;
    }

    // Analyze Undercut
    if (roundData.isUndercut && roundData.winner === 'player') {
      insights.push({
        type: 'positive',
        message: '💪 Great undercut! Your low deadwood paid off'
      });
      strategyScore += 2;
    }

    // Analyze turns taken
    if (roundData.turnCount) {
      if (roundData.turnCount <= 6 && roundData.winner === 'player') {
        insights.push({
          type: 'positive',
          message: 'Quick victory! Efficient gameplay'
        });
        strategyScore += 1;
      } else if (roundData.turnCount >= 15) {
        insights.push({
          type: 'neutral',
          message: 'Long round - sometimes patience is key'
        });
      }
    }

    // Analyze final deadwood distribution
    if (roundData.averageFinalDeadwood && roundData.playerDeadwood < roundData.averageFinalDeadwood) {
      insights.push({
        type: 'positive',
        message: 'Below average deadwood - good card management'
      });
      strategyScore += 1;
    }

    // Cap strategy score at 10
    strategyScore = Math.min(10, Math.max(0, strategyScore));

    setAnalysis({
      insights,
      strategyScore,
      hasAnalysis: insights.length > 0
    });
  }, [roundData]);

  return analysis;
};
