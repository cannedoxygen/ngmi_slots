// src/hooks/useSlotMachine.ts
import { useState, useEffect, useCallback } from 'react';
import { useSuiWallet } from './useSuiWallet';
import { useMoveCall } from './useMoveCall';
import { useTokenBalance } from './useTokenBalance';
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
  const { connected, address } = useSuiWallet();
  const { callMoveFunction, pendingTransaction } = useMoveCall();
  const { balance, refetch: refetchBalance } = useTokenBalance();

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
      
      // For development, we'll simulate a blockchain call
      // In production, this would call the actual smart contract
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === 'true') {
        await simulateBlockchainSpin();
      } else {
        // Generate a random seed for the spin
        const seed = generateRandomSeed();
        
        // Call the Move contract's spin function
        const result = await callMoveFunction({
          packageId: gameConfig.contractAddress.packageId,
          module: 'ngmi_slots',
          function: 'spin',
          arguments: [betAmount, seed],
          gasBudget: 10000,
        });
        
        if (result.status === 'success') {
          setTransactionId(result.transactionId);
          setShowTransactionModal(true);
          
          // Process the result - in a real app, you'd wait for transaction confirmation
          // and then fetch the events from the blockchain
          
          // For now, we'll just refetch the balance after a delay
          setTimeout(() => {
            refetchBalance();
          }, 3000);
        } else {
          throw new Error(result.error || 'Transaction failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to spin');
      console.error('Spin error:', err);
    } finally {
      // In a real app, you would set spinning to false after the transaction is confirmed
      // For development, we'll just use a timeout
      setTimeout(() => {
        setSpinning(false);
      }, 3000);
    }
  }, [
    spinning, 
    connected, 
    pendingTransaction, 
    balance, 
    betAmount, 
    freeSpinsRemaining, 
    resetGameState, 
    callMoveFunction, 
    refetchBalance
  ]);

  // Simulate a blockchain spin for development
  const simulateBlockchainSpin = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulate random reel positions
        const reelPositions = getRandomReelPositions();
        
        // Evaluate win based on the random positions
        const result = evaluateWin(reelPositions, betAmount, paylines);
        
        setLastSpinResult({
          reelPositions,
          winAmount: result.totalWin,
          multiplier: result.multiplier,
          winningPaylines: result.winningPaylines,
          freeSpinsAwarded: result.freeSpins
        });
        
        resolve();
      }, 2000); // Simulate blockchain delay
    });
  };

  // Generate random reel positions
  const getRandomReelPositions = () => {
    const symbolKeys = Object.keys(gameConfig.symbols);
    const reelPositions: string[][] = [];
    
    for (let i = 0; i < 3; i++) {
      const reel: string[] = [];
      for (let j = 0; j < 3; j++) {
        // Weighted random selection based on symbol probabilities
        let random = Math.random();
        let selectedSymbol = symbolKeys[0];
        
        for (const symbol of symbolKeys) {
          const probability = gameConfig.symbols[symbol].probability;
          if (random <= probability) {
            selectedSymbol = symbol;
            break;
          }
          random -= probability;
        }
        
        reel.push(selectedSymbol);
      }
      reelPositions.push(reel);
    }
    
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