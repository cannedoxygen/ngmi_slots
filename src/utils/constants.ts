// src/utils/constants.ts

/**
 * Application-wide constants
 */

export const constants = {
    // App information
    appName: 'T-NGMI Slots',
    appVersion: '1.0.0',
    
    // Network configuration
    network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet', // 'mainnet' or 'testnet'
    
    // Contract addresses - these would be populated from environment variables in production
    contractAddress: {
      packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
      moduleId: 'ngmi_slots',
      upgradeCapId: process.env.NEXT_PUBLIC_UPGRADE_CAP_ID || '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abc'
    },
    
    // Token configuration
    tokenSymbol: 'TARDI',
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
      settings: 'tngmiSlotSettings',
      gameHistory: 'tngmiGameHistory',
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
        'high-tardi': 5,
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
        'high-tardi': 5,
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
        'high-tardi': 5,
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