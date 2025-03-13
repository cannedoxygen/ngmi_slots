// src/types/game.d.ts

/**
 * Game symbol configuration
 */
export interface GameSymbol {
    name: string;
    imagePath: string;
    tier: 'low' | 'mid' | 'high' | 'special';
    payout: number;
    probability: number;
    multiplier?: number;
    freeSpins?: number;
  }
  
  /**
   * Game configuration
   */
  export interface GameConfig {
    name: string;
    description: string;
    version: string;
    reelCount: number;
    rowCount: number;
    minBet: number;
    maxBet: number;
    defaultBet: number;
    paylineCount: number;
    rtp: number;
    symbols: Record<string, GameSymbol>;
    contractAddress: {
      packageId: string;
      moduleId: string;
      upgradeCapId: string;
    };
    tokenConfig: {
      symbol: string;
      decimals: number;
      iconUrl: string;
    };
    jackpotMultiplier: number;
    animationSpeed: {
      default: number;
      fast: number;
    };
    sounds: Record<string, string>;
    music: Record<string, string>;
  }
  
  /**
   * Payline definition
   */
  export interface Payline {
    id: number;
    positions: [number, number][]; // [row, column] pairs
    color: string;
    name: string;
    active?: boolean;
  }
  
  /**
   * Result of a spin evaluation
   */
  export interface WinResult {
    totalWin: number;
    winningPaylines: number[];
    winsByPayline: Record<number, number>;
    multiplier: number;
    freeSpins: number;
    symbols: string[];
    isJackpot?: boolean;
  }
  
  /**
   * Game history entry
   */
  export interface GameHistoryEntry {
    id: string;
    timestamp: number;
    betAmount: number;
    winAmount: number;
    multiplier: number;
    reels: string[][];
    paylines: number[];
    freeSpinsAwarded: number;
    isJackpot: boolean;
    transactionId?: string;
  }
  
  /**
   * Spin options
   */
  export interface SpinOptions {
    betAmount: number;
    useFreeSpin?: boolean;
    clientSeed?: string;
  }
  
  /**
   * Spin result from the blockchain
   */
  export interface SpinResult {
    reelPositions: string[][];
    winAmount: number;
    multiplier: number;
    winningPaylines: number[];
    freeSpinsAwarded: number;
    isJackpot: boolean;
    transactionId?: string;
  }
  
  /**
   * Game statistics
   */
  export interface GameStats {
    totalBet: number;
    totalWin: number;
    spinsCount: number;
    winCount: number;
    bigWinCount: number;
    jackpotCount: number;
    averageRTP: number;
    bestWin: {
      amount: number;
      multiplier: number;
      timestamp: number;
    };
  }
  
  /**
   * Game settings
   */
  export interface GameSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    fastMode: boolean;
    autoSpin: boolean;
    showWinAnimations: boolean;
    darkMode: boolean;
  }