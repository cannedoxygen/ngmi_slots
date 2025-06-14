// src/utils/constants.ts

/**
 * Application-wide constants
 */

export const constants = {
    // App information
    appName: 'SimpCity Casino Slots',
    appVersion: '1.0.0',
    
    // Network configuration
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet', // 'mainnet-beta', 'testnet', or 'devnet'
    
    // Contract addresses - these would be populated from environment variables in production
    contractAddress: {
      programId: process.env.NEXT_PUBLIC_PROGRAM_ID || 'Simpc1tyS1otsxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      moduleId: 'simpcity_slots',
      authorityId: process.env.NEXT_PUBLIC_AUTHORITY_ID || 'Simpc1tyAuth0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
    
    // Token configuration
    tokenSymbol: 'SIMP',
    tokenDecimals: 9,
    tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
    
    // Game settings
    minBet: 5,
    maxBet: 100,
    defaultBet: 10,
    maxPaylines: 5,
    
    // RTP (Return to Player) percentage
    rtp: 95, // 95% RTP
    
    // Animation settings
    spinDuration: 2000, // 2 seconds for regular spin
    fastSpinDuration: 1000, // 1 second for fast spin
    
    // API endpoints
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '/api',
    
    // Local storage keys
    storageKeys: {
      settings: 'simpCasinoSettings',
      gameHistory: 'simpCasinoGameHistory',
      connectedWalletId: 'connectedWalletId',
      walletAddress: 'walletAddress',
    }
  };
  
  // Reel settings (symbol weights for each reel)
  export const reelSettings = {
    // Symbol weights for each reel
    // Higher weight = more likely to appear
    weights: [
      // Reel 1
      {
        'low-gear': 20,
        'low-token': 20,
        'low-badge': 20,
        'mid-robot': 15,
        'mid-helmet': 10,
        'mid-future': 10,
        'high-simp': 5,
        'multiplier-2x': 5,
        'multiplier-5x': 3,
        'multiplier-10x': 2,
        'free-spin': 10,
      },
      // Reel 2
      {
        'low-gear': 20,
        'low-token': 20,
        'low-badge': 20,
        'mid-robot': 15,
        'mid-helmet': 10,
        'mid-future': 10,
        'high-simp': 5,
        'multiplier-2x': 5,
        'multiplier-5x': 3,
        'multiplier-10x': 2,
        'free-spin': 10,
      },
      // Reel 3
      {
        'low-gear': 20,
        'low-token': 20,
        'low-badge': 20,
        'mid-robot': 15,
        'mid-helmet': 10,
        'mid-future': 10,
        'high-simp': 5,
        'multiplier-2x': 5,
        'multiplier-5x': 3,
        'multiplier-10x': 2,
        'free-spin': 10,
      }
    ]
  };
  
  // Errors
  export const errors = {
    walletNotConnected: 'Wallet not connected',
    insufficientBalance: 'Insufficient balance',
    invalidBetAmount: 'Invalid bet amount',
    networkError: 'Network error, please try again',
    transactionFailed: 'Transaction failed',
    contractError: 'Smart contract error',
  };
  
  export default constants;