// src/hooks/useSlotMachine.ts
import { useState, useEffect, useCallback } from 'react';
import { useSolanaWallet } from './useSolanaWallet';
import { useSolanaTransaction } from './useSolanaTransaction';
// Removed the useMoveCall import since we're now using Solana
import { gameConfig } from '../config/gameConfig';
import { paylines } from '../config/paylines';
import { evaluateWin } from '../utils/gameLogic';
import { generateRandomSeed } from '../utils/randomGenerator';

export interface SpinResult {
  reelPositions: string[][];
  winAmount: number;
  multiplier: number;
  winningPaylines: number[];
  freeSpinsAwarded: number;
}

export const useSlotMachine = () => {
  // Game state
  const [spinning, setSpinning] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [reels, setReels] = useState<string[][]>(getInitialReels());
  const [lastSpinResult, setLastSpinResult] = useState<SpinResult | null>(null);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [activePaylines, setActivePaylines] = useState<number[]>([]);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState<number>(0);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { connected, address, balance } = useSolanaWallet();
  const { executeTransaction, pendingTransaction } = useSolanaTransaction();

  // Helper function to generate initial reels
  function getInitialReels(): string[][] {
    const symbolKeys = Object.keys(gameConfig.symbols);
    const initialReels: string[][] = [];
    
    for (let i = 0; i < 3; i++) {
      const reel: string[] = [];
      for (let j = 0; j < 3; j++) {
        // Pick random symbols for initial state
        const randomIndex = Math.floor(Math.random() * symbolKeys.length);
        reel.push(symbolKeys[randomIndex]);
      }
      initialReels.push(reel);
    }
    
    return initialReels;
  }

  // Reset game state
  const resetGameState = useCallback(() => {
    setWinAmount(0);
    setMultiplier(1);
    setActivePaylines([]);
    setError(null);
  }, []);

  // Update UI when spin result changes
  useEffect(() => {
    if (lastSpinResult) {
      const { reelPositions, winAmount, multiplier, winningPaylines, freeSpinsAwarded } = lastSpinResult;
      
      setReels(reelPositions);
      setWinAmount(winAmount);
      setMultiplier(multiplier);
      setActivePaylines(winningPaylines);
      
      if (freeSpinsAwarded > 0) {
        setFreeSpinsRemaining(prev => prev + freeSpinsAwarded);
      }
    }
  }, [lastSpinResult]);

  // Spin function
  const spin = useCallback(async () => {
    if (spinning || !connected || pendingTransaction) return;
    
    // Check if player has enough balance
    if (balance < betAmount && freeSpinsRemaining <= 0) {
      setError('Insufficient balance');
      return;
    }
    
    try {
      setSpinning(true);
      resetGameState();
      
      // Use free spin if available
      const usingFreeSpin = freeSpinsRemaining > 0;
      if (usingFreeSpin) {
        setFreeSpinsRemaining(prev => prev - 1);
      }
      
      // For development or when using mock mode, we'll simulate a spin
      if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === 'true') {
        await simulateBlockchainSpin();
      } else {
        // In production, execute a real Solana transaction
        // Generate a random seed for the spin
        const seed = generateRandomSeed();
        
        // Execute the Solana transaction
        const result = await executeTransaction({
          amount: betAmount,
          seed
        });
        
        if (result.status === 'success') {
          setTransactionId(result.transactionId);
          setShowTransactionModal(true);
          
          // After transaction confirmation, simulate the spin result
          // In a real app, you would listen for a program event from the blockchain
          await simulateBlockchainSpin();
        } else {
          throw new Error(result.error || 'Transaction failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to spin');
      console.error('Spin error:', err);
    } finally {
      // In a real app, you would set spinning to false after the transaction is confirmed
      // For development, we'll just use a timeout with slight variance
      setTimeout(() => {
        setSpinning(false);
      }, 2500 + Math.random() * 1000); // Random time between 2.5-3.5 seconds
    }
  }, [
    spinning, 
    connected, 
    pendingTransaction, 
    balance, 
    betAmount, 
    freeSpinsRemaining, 
    resetGameState, 
    executeTransaction
  ]);

  // Simulate a blockchain spin for development
  const simulateBlockchainSpin = async () => {
    return new Promise<void>((resolve) => {
      // Use a variable timeout to simulate network variance
      const spinDelay = 1500 + Math.random() * 1000;
      
      setTimeout(() => {
        // Simulate random reel positions with fresh randomization each time
        const reelPositions = getRandomReelPositions();
        
        // Evaluate win based on the random positions
        const result = evaluateWin(reelPositions, betAmount, paylines);
        
        // Log the result for debugging
        console.log('Spin result:', {
          reelPositions,
          totalWin: result.totalWin,
          multiplier: result.multiplier,
          winningPaylines: result.winningPaylines,
          freeSpins: result.freeSpins
        });
        
        setLastSpinResult({
          reelPositions,
          winAmount: result.totalWin,
          multiplier: result.multiplier,
          winningPaylines: result.winningPaylines,
          freeSpinsAwarded: result.freeSpins
        });
        
        resolve();
      }, spinDelay); // Simulate blockchain delay with variance
    });
  };

  // Generate random reel positions
  const getRandomReelPositions = () => {
    const symbolKeys = Object.keys(gameConfig.symbols);
    const reelPositions: string[][] = [];
    
    for (let i = 0; i < 3; i++) {
      const reel: string[] = [];
      for (let j = 0; j < 3; j++) {
        // Create a weighted probability array for better randomization
        const weightedSymbols: string[] = [];
        
        // Fill weighted array based on probability
        for (const symbol of symbolKeys) {
          const probability = gameConfig.symbols[symbol].probability;
          // Scale probability by 100 to get integer count
          const count = Math.round(probability * 100);
          for (let k = 0; k < count; k++) {
            weightedSymbols.push(symbol);
          }
        }
        
        // Truly randomize using a different random value each time
        const randomIndex = Math.floor(Math.random() * weightedSymbols.length);
        const selectedSymbol = weightedSymbols[randomIndex];
        
        reel.push(selectedSymbol);
      }
      reelPositions.push(reel);
    }
    
    // Add console log to see results (for debugging)
    console.log('New spin result:', reelPositions);
    
    return reelPositions;
  };

  return {
    spinning,
    betAmount,
    setBetAmount,
    reels,
    winAmount,
    multiplier,
    activePaylines,
    freeSpinsRemaining,
    spin,
    error,
    symbols: gameConfig.symbols,
    paylines,
    transactionId,
    showTransactionModal,
    setShowTransactionModal,
    isWinner: winAmount > 0,
    canPlay: connected && (balance >= betAmount || freeSpinsRemaining > 0)
  };
};

export default useSlotMachine;