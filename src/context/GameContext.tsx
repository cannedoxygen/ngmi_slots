// src/context/GameContext.tsx
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import { gameConfig } from '../config/gameConfig';

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  fastMode: boolean;
  autoSpin: boolean;
  showWinAnimations: boolean;
}

interface GameContextValue {
  // Game state from hook
  spinning: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  reels: string[][];
  winAmount: number;
  multiplier: number;
  activePaylines: number[];
  freeSpinsRemaining: number;
  isWinner: boolean;
  canPlay: boolean;
  spin: () => Promise<void>;
  
  // Game settings
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  
  // Paytable and settings modals
  showPaytable: boolean;
  setShowPaytable: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  
  // Game history
  gameHistory: any[];
  addToHistory: (gameResult: any) => void;
  clearHistory: () => void;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  fastMode: false,
  autoSpin: false,
  showWinAnimations: true,
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get slot machine state from hook
  const slotMachine = useSlotMachine();
  
  // Settings state
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Modal state
  const [showPaytable, setShowPaytable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Game history state
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tngmiSlotSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
        }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    
    // Load game history
    const savedHistory = localStorage.getItem('tngmiGameHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setGameHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse saved history:', error);
      }
    }
  }, []);
  
  // Update settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Save to localStorage
      localStorage.setItem('tngmiSlotSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  }, []);
  
  // Add game result to history
  const addToHistory = useCallback((gameResult: any) => {
    setGameHistory(prevHistory => {
      const newHistory = [
        {
          ...gameResult,
          timestamp: Date.now(),
        },
        ...prevHistory.slice(0, 49), // Keep last 50 games
      ];
      
      // Save to localStorage
      localStorage.setItem('tngmiGameHistory', JSON.stringify(newHistory));
      
      return newHistory;
    });
  }, []);
  
  // Clear game history
  const clearHistory = useCallback(() => {
    setGameHistory([]);
    localStorage.removeItem('tngmiGameHistory');
  }, []);
  
  // Store game result in history when a spin completes
  useEffect(() => {
    if (slotMachine.isWinner && !slotMachine.spinning && slotMachine.winAmount > 0) {
      addToHistory({
        betAmount: slotMachine.betAmount,
        winAmount: slotMachine.winAmount,
        multiplier: slotMachine.multiplier,
        reels: slotMachine.reels,
        activePaylines: slotMachine.activePaylines,
      });
    }
  }, [
    slotMachine.isWinner, 
    slotMachine.spinning, 
    slotMachine.winAmount, 
    slotMachine.betAmount, 
    slotMachine.multiplier, 
    slotMachine.reels, 
    slotMachine.activePaylines,
    addToHistory
  ]);
  
  const contextValue: GameContextValue = {
    ...slotMachine,
    settings,
    updateSettings,
    showPaytable,
    setShowPaytable,
    showSettings,
    setShowSettings,
    gameHistory,
    addToHistory,
    clearHistory,
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextValue => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export default GameContext;