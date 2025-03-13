// src/context/SuiWalletContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { SuiWalletProvider } from '../types/sui';

interface SuiWalletContextValue {
  // Wallet connection state
  connected: boolean;
  connecting: boolean;
  address: string | null;
  provider: SuiWalletProvider | null;
  walletProviders: SuiWalletProvider[];
  error: string | null;
  
  // Balance state
  balance: number;
  balanceLoading: boolean;
  balanceError: string | null;
  
  // Functions
  connect: (providerId: string) => Promise<{ success: boolean; address?: string; error?: string }>;
  disconnect: () => Promise<{ success: boolean; error?: string }>;
  executeTransaction: (transaction: any) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  refetchBalance: () => Promise<void>;
}

const SuiWalletContext = createContext<SuiWalletContextValue | undefined>(undefined);

export const SuiWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get wallet connection state from hook
  const { 
    connected,
    connecting,
    address,
    provider,
    walletProviders,
    error,
    connect,
    disconnect,
    executeTransaction
  } = useSuiWallet();
  
  // Get balance state from hook
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance
  } = useTokenBalance();
  
  const contextValue: SuiWalletContextValue = {
    connected,
    connecting,
    address,
    provider,
    walletProviders,
    error,
    balance,
    balanceLoading,
    balanceError,
    connect,
    disconnect,
    executeTransaction,
    refetchBalance
  };
  
  return (
    <SuiWalletContext.Provider value={contextValue}>
      {children}
    </SuiWalletContext.Provider>
  );
};

export const useSuiWalletContext = (): SuiWalletContextValue => {
  const context = useContext(SuiWalletContext);
  if (context === undefined) {
    throw new Error('useSuiWalletContext must be used within a SuiWalletProvider');
  }
  return context;
};

export default SuiWalletContext;