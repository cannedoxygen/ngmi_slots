// src/hooks/useSolanaTransaction.ts
import { useState, useCallback } from 'react';
import { useSolanaWallet } from './useSolanaWallet';
import { generateRandomSeed } from '../utils/randomGenerator';

interface TransactionResult {
  status: 'success' | 'error' | 'pending';
  transactionId: string | null;
  error?: string;
}

interface TransactionOptions {
  amount: number;
  seed?: string;
  gasBudget?: number;
}

/**
 * Custom hook for handling Solana transactions
 * Replaces the Sui useMoveCall hook
 */
export const useSolanaTransaction = () => {
  const { address, connected } = useSolanaWallet();
  const [pendingTransaction, setPendingTransaction] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  /**
   * Execute a Solana transaction 
   */
  const executeTransaction = useCallback(async (options: TransactionOptions): Promise<TransactionResult> => {
    if (!connected || !address) {
      return {
        status: 'error',
        transactionId: null,
        error: 'Wallet not connected'
      };
    }

    try {
      setPendingTransaction(true);
      console.log(`Starting Solana transaction for amount: ${options.amount}`);

      // Generate a random transaction ID for development
      // In production, this would be the actual transaction signature
      const mockTransactionId = generateTransactionId();
      setLastTransactionId(mockTransactionId);

      // In real implementation, would construct and send the actual Solana transaction
      // using either @solana/web3.js directly or the main site's multiWalletAdapter

      // Simulate transaction latency
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      console.log(`Transaction completed with ID: ${mockTransactionId}`);
      
      // For development, we'll just use localStorage to simulate a balance update
      if (process.env.NODE_ENV === 'development') {
        const currentBalance = parseFloat(localStorage.getItem('simpTokenBalance') || '0');
        const newBalance = Math.max(0, currentBalance - options.amount);
        localStorage.setItem('simpTokenBalance', newBalance.toString());
        
        // Trigger a balance update event for the main application
        window.dispatchEvent(new CustomEvent('balanceUpdated'));
        
        // Also try to use the main site's updateSimpBalance function
        if ((window as any).updateSimpBalance) {
          (window as any).updateSimpBalance();
        }
      }

      return {
        status: 'success',
        transactionId: mockTransactionId
      };
    } catch (error: any) {
      console.error('Transaction error:', error);
      return {
        status: 'error',
        transactionId: null,
        error: error.message || 'Transaction failed'
      };
    } finally {
      setPendingTransaction(false);
    }
  }, [connected, address]);

  /**
   * Generate a random transaction ID
   */
  const generateTransactionId = () => {
    // Format like a Solana transaction signature
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let signature = '';
    for (let i = 0; i < 88; i++) {
      signature += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return signature;
  };

  return {
    executeTransaction,
    pendingTransaction,
    lastTransactionId
  };
};

export default useSolanaTransaction;