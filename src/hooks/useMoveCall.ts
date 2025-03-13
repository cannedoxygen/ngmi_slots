// src/hooks/useMoveCall.ts
import { useState, useCallback } from 'react';
import { useSuiWallet } from './useSuiWallet';

interface MoveCallParams {
  packageId: string;
  module: string;
  function: string;
  arguments?: any[];
  typeArguments?: string[];
  gasBudget?: number;
}

interface MoveCallResult {
  status: 'success' | 'error';
  transactionId?: string;
  error?: string;
  data?: any;
}

export const useMoveCall = () => {
  const { connected, executeTransaction } = useSuiWallet();
  const [pendingTransaction, setPendingTransaction] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<MoveCallResult | null>(null);

  const callMoveFunction = useCallback(
    async (params: MoveCallParams): Promise<MoveCallResult> => {
      if (!connected) {
        return {
          status: 'error',
          error: 'Wallet not connected'
        };
      }

      try {
        setPendingTransaction(true);

        // In a real implementation, this would construct and send a transaction
        // to call the specified Move function on the blockchain
        // For now, we'll simulate a response
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate a mock transaction result
        const isSuccess = Math.random() > 0.1; // 90% success rate for simulation
        
        let result: MoveCallResult;
        
        if (isSuccess) {
          // Successful transaction
          result = {
            status: 'success',
            transactionId: `0x${Math.random().toString(16).substring(2, 42)}`,
            data: simulateMoveResult(params)
          };
        } else {
          // Failed transaction
          result = {
            status: 'error',
            error: 'Transaction execution failed'
          };
        }

        setLastResult(result);
        return result;
      } catch (error: any) {
        const errorResult: MoveCallResult = {
          status: 'error',
          error: error.message || 'Unknown error occurred'
        };
        setLastResult(errorResult);
        return errorResult;
      } finally {
        setPendingTransaction(false);
      }
    },
    [connected, executeTransaction]
  );

  // Function to generate simulated results based on the called function
  const simulateMoveResult = (params: MoveCallParams): any => {
    const { module, function: func } = params;
    
    // For the slot machine game
    if (module === 'ngmi_slots' && func === 'spin') {
      // Generate a simulated spin result
      const reelPositions = generateRandomReelPositions();
      const winAmount = calculateWinAmount(reelPositions, params.arguments?.[0] || 10);
      
      return {
        reelPositions,
        winAmount: winAmount.amount,
        multiplier: winAmount.multiplier,
        freeSpins: winAmount.freeSpins
      };
    }
    
    // Default response for other functions
    return { success: true };
  };
  
  // Helper function to generate random reel positions
  const generateRandomReelPositions = () => {
    const symbolTypes = [
      'low-gear', 'low-token', 'low-badge',
      'mid-robot', 'mid-helmet', 'mid-future',
      'high-tardi', 'multiplier-2x', 'free-spin'
    ];
    
    const reels: string[][] = [];
    
    for (let i = 0; i < 3; i++) {
      const reel: string[] = [];
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * symbolTypes.length);
        reel.push(symbolTypes[randomIndex]);
      }
      reels.push(reel);
    }
    
    return reels;
  };
  
  // Helper function to calculate win amount
  const calculateWinAmount = (reels: string[][], betAmount: number) => {
    // This is a simplified version - in production, this would be
    // calculated on the blockchain by the Move contract
    
    // Check for a win pattern (simplified for demo)
    const hasWin = Math.random() > 0.6; // 40% win rate
    
    if (!hasWin) {
      return { amount: 0, multiplier: 1, freeSpins: 0 };
    }
    
    // Determine multiplier (if any)
    const hasMultiplier = Math.random() > 0.7; // 30% chance of multiplier
    const multiplier = hasMultiplier ? (Math.random() > 0.5 ? 2 : 5) : 1;
    
    // Determine win amount
    const baseAmount = betAmount * (Math.floor(Math.random() * 5) + 1);
    const finalAmount = baseAmount * multiplier;
    
    // Determine free spins (if any)
    const hasFreeSpins = Math.random() > 0.8; // 20% chance of free spins
    const freeSpins = hasFreeSpins ? Math.floor(Math.random() * 3) + 1 : 0;
    
    return {
      amount: finalAmount,
      multiplier,
      freeSpins
    };
  };

  return {
    callMoveFunction,
    pendingTransaction,
    lastResult
  };
};

export default useMoveCall;