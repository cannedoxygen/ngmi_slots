// src/hooks/useTokenBalance.ts
import { useState, useEffect, useCallback } from 'react';
import { useSuiWallet } from './useSuiWallet';
import { constants } from '../utils/constants';

export const useTokenBalance = () => {
  const { connected, address } = useSuiWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch token balance
  const fetchBalance = useCallback(async () => {
    if (!connected || !address) {
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch the token balance from the blockchain
      // For development, we'll simulate a balance
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the saved balance or generate a random one
      const savedBalance = localStorage.getItem(`tardiBalance_${address}`);
      
      if (savedBalance) {
        setBalance(parseInt(savedBalance, 10));
      } else {
        // Generate a random balance between 100 and 1000
        const randomBalance = Math.floor(Math.random() * 900) + 100;
        setBalance(randomBalance);
        
        // Save to localStorage for persistence
        localStorage.setItem(`tardiBalance_${address}`, randomBalance.toString());
      }
    } catch (err: any) {
      console.error('Error fetching token balance:', err);
      setError(err.message || 'Failed to fetch token balance');
    } finally {
      setLoading(false);
    }
  }, [connected, address]);

  // Fetch balance when wallet connection changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Update balance (used after transactions)
  const updateBalance = useCallback(async (newBalance: number) => {
    if (!connected || !address) return;
    
    setBalance(newBalance);
    localStorage.setItem(`tardiBalance_${address}`, newBalance.toString());
  }, [connected, address]);

  // Mock function to add tokens (for development)
  const addTokens = useCallback(async (amount: number) => {
    if (!connected || !address) return;
    
    const newBalance = balance + amount;
    updateBalance(newBalance);
    
    return { success: true, newBalance };
  }, [connected, address, balance, updateBalance]);

  // Mock function to remove tokens (for development)
  const removeTokens = useCallback(async (amount: number) => {
    if (!connected || !address) return { success: false, error: 'Not connected' };
    
    if (balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }
    
    const newBalance = balance - amount;
    updateBalance(newBalance);
    
    return { success: true, newBalance };
  }, [connected, address, balance, updateBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
    updateBalance,
    addTokens,
    removeTokens,
    tokenSymbol: constants.tokenSymbol,
    tokenDecimals: constants.tokenDecimals
  };
};

export default useTokenBalance;