// src/config/gameConfig.ts
import { GameConfig, GameSymbol } from '../types/game';

// Symbol configuration
const symbols: Record<string, GameSymbol> = {
  // Low tier symbols
  'low-gear': {
    name: 'Gear',
    imagePath: '/assets/images/symbols/low-tier/gear.png',
    tier: 'low',
    payout: 5,
    probability: 0.15, // Higher probability for low tier
  },
  'low-token': {
    name: 'Token',
    imagePath: '/assets/images/symbols/low-tier/token.png',
    tier: 'low',
    payout: 8,
    probability: 0.15,
  },
  'low-badge': {
    name: 'Badge',
    imagePath: '/assets/images/symbols/low-tier/badge.png',
    tier: 'low',
    payout: 10,
    probability: 0.15,
  },
  
  // Mid tier symbols
  'mid-robot': {
    name: 'Robot',
    imagePath: '/assets/images/symbols/mid-tier/robot.png',
    tier: 'mid',
    payout: 15,
    probability: 0.1,
  },
  'mid-helmet': {
    name: 'Helmet',
    imagePath: '/assets/images/symbols/mid-tier/helmet.png',
    tier: 'mid',
    payout: 20,
    probability: 0.1,
  },
  'mid-future': {
    name: 'Future Tech',
    imagePath: '/assets/images/symbols/mid-tier/future.png',
    tier: 'mid',
    payout: 25,
    probability: 0.1,
  },
  
  // High tier symbols
  'high-tardi': {
    name: 'TARDI Logo',
    imagePath: '/assets/images/symbols/high-tier/tardi.png',
    tier: 'high',
    payout: 50,
    probability: 0.05, // Lower probability for high payout
  },
  
  // Special symbols
  'multiplier-2x': {
    name: '2x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-2x.png',
    tier: 'special',
    payout: 0, // No direct payout, multiplies win instead
    probability: 0.05,
    multiplier: 2,
  },
  'multiplier-5x': {
    name: '5x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-5x.png',
    tier: 'special',
    payout: 0,
    probability: 0.03,
    multiplier: 5,
  },
  'multiplier-10x': {
    name: '10x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-10x.png',
    tier: 'special',
    payout: 0,
    probability: 0.02,
    multiplier: 10,
  },
  'free-spin': {
    name: 'Free Spin',
    imagePath: '/assets/images/symbols/special/free-spin.png',
    tier: 'special',
    payout: 0, // No direct payout, gives free spins instead
    probability: 0.1,
    freeSpins: 1,
  },
};

// Game configuration
export const gameConfig: GameConfig = {
  // Basic game settings
  name: 'T-NGMI Slots',
  description: 'T-NGMI themed 3x3 slot machine game on the Sui blockchain',
  version: '1.0.0',
  
  // Game rules
  reelCount: 3,
  rowCount: 3,
  minBet: 5,
  maxBet: 100,
  defaultBet: 10,
  paylineCount: 5,
  
  // RTP (Return to Player) percentage
  rtp: 95, // 95% RTP
  
  // Symbols configuration
  symbols,
  
  // Contract addresses
  contractAddress: {
    packageId: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
    moduleId: 'ngmi_slots',
    upgradeCapId: '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abc'
  },
  
  // Token configuration
  tokenConfig: {
    symbol: 'TARDI',
    decimals: 9,
    iconUrl: '/assets/images/tardi-token.png'
  },
  
  // Win calculation
  jackpotMultiplier: 50, // Jackpot is 50x the bet amount
  
  // Animation speeds
  animationSpeed: {
    default: 1.0,
    fast: 0.5, // 2x faster
  },
  
  // Sound configuration
  sounds: {
    spin: '/assets/audio/spin.mp3',
    win: '/assets/audio/win.mp3',
    bigWin: '/assets/audio/big-win.mp3',
    jackpot: '/assets/audio/jackpot.mp3',
    reelStop: '/assets/audio/reel-stop.mp3',
    buttonClick: '/assets/audio/button-click.mp3',
  },
  
  // Music tracks
  music: {
    background: '/assets/audio/music/background.mp3',
  }
};

export default gameConfig;