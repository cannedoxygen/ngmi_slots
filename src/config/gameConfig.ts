// src/config/gameConfig.ts
import { GameConfig, GameSymbol } from '../types/game';

// Symbol configuration - SimpCity Theme
const symbols: Record<string, GameSymbol> = {
  // Low tier symbols - Classic slot symbols
  'low-cherry': {
    name: 'Cherry',
    imagePath: '/assets/images/symbols/low-tier/cherry.png',
    emoji: '🍒',
    tier: 'low',
    payout: 8,
    probability: 0.15, // Higher probability for low tier
  },
  'low-lemon': {
    name: 'Lemon',
    imagePath: '/assets/images/symbols/low-tier/lemon.png',
    emoji: '🍋',
    tier: 'low',
    payout: 12,
    probability: 0.15,
  },
  'low-orange': {
    name: 'Orange',
    imagePath: '/assets/images/symbols/low-tier/orange.png',
    emoji: '🍊',
    tier: 'low',
    payout: 15,
    probability: 0.15,
  },
  
  // Mid tier symbols - Classic slot symbols
  'mid-bell': {
    name: 'Bell',
    imagePath: '/assets/images/symbols/mid-tier/bell.png',
    emoji: '💰',
    tier: 'mid',
    payout: 15,
    probability: 0.1,
  },
  'mid-grapes': {
    name: 'Grapes',
    imagePath: '/assets/images/symbols/mid-tier/grapes.png',
    emoji: '🍇',
    tier: 'mid',
    payout: 20,
    probability: 0.1,
  },
  'mid-watermelon': {
    name: 'Watermelon',
    imagePath: '/assets/images/symbols/mid-tier/watermelon.png',
    emoji: '🍉',
    tier: 'mid',
    payout: 25,
    probability: 0.1,
  },
  
  // High tier symbols - Classic slot symbols
  'high-seven': {
    name: 'Lucky Seven',
    imagePath: '/assets/images/symbols/high-tier/seven.png',
    emoji: '7️⃣',
    tier: 'high',
    payout: 50,
    probability: 0.05, // Lower probability for high payout
  },
  'high-bar': {
    name: 'Bar',
    imagePath: '/assets/images/symbols/high-tier/bar.png',
    emoji: '💯',
    tier: 'high',
    payout: 75,
    probability: 0.03,
  },
  'high-diamond': {
    name: 'Diamond',
    imagePath: '/assets/images/symbols/high-tier/diamond.png',
    emoji: '💎',
    tier: 'high',
    payout: 100,
    probability: 0.02,
  },
  
  // Special symbols
  'multiplier-3x': {
    name: '3x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-3x.png',
    emoji: '3️⃣',
    tier: 'special',
    payout: 0, // No direct payout, multiplies win instead
    probability: 0.05,
    multiplier: 3,
  },
  'multiplier-5x': {
    name: '5x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-5x.png',
    emoji: '5️⃣',
    tier: 'special',
    payout: 0,
    probability: 0.03,
    multiplier: 5,
  },
  'multiplier-10x': {
    name: '10x Multiplier',
    imagePath: '/assets/images/symbols/special/multiplier-10x.png',
    emoji: '🔟',
    tier: 'special',
    payout: 0,
    probability: 0.02,
    multiplier: 10,
  },
  'free-spin': {
    name: 'Free Spin',
    imagePath: '/assets/images/symbols/special/free-spin.png',
    emoji: '🎰',
    tier: 'special',
    payout: 0, // No direct payout, gives free spins instead
    probability: 0.1,
    freeSpins: 1,
  },
};

// Game configuration
export const gameConfig: GameConfig = {
  // Basic game settings
  name: 'SimpCity Casino Slots',
  description: 'Simpsons-themed 3x3 slot machine game on the Solana blockchain',
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
  
  // Solana Contract addresses
  contractAddress: {
    programId: '88KKUzT9B5sHRopVgRNn3VEfKh7g4ykLXqqjPT7Hpump', // SIMP token address
    authorityId: '9a6GpmxKqZMnKqYCkg33yZNZxpxeXPKvUHAbZuoGsiF9'  // SIMP token authority
  },
  
  // Token configuration
  tokenConfig: {
    symbol: 'SIMP',
    decimals: 9,
    iconUrl: '/assets/images/symbols/low-tier/simp-token.png'
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