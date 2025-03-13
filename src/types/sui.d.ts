// src/types/sui.d.ts

/**
 * Type definitions for Sui blockchain interactions
 */

/**
 * Sui wallet adapter interface
 */
export interface SuiWalletAdapter {
    name: string;
    icon?: string;
    connected: boolean;
    connecting: boolean;
    publicKey?: string;
    addresses?: string[];
    
    // Methods
    connect: () => Promise<{ success: boolean; error?: string }>;
    disconnect: () => Promise<{ success: boolean; error?: string }>;
    signAndExecuteTransaction: (transaction: any) => Promise<any>;
    signTransaction: (transaction: any) => Promise<any>;
    signMessage: (message: any) => Promise<any>;
    getAccounts: () => Promise<string[]>;
  }
  
  /**
   * Sui wallet provider info
   */
  export interface SuiWalletProvider {
    id: string;
    name: string;
    icon?: string;
    adapter: SuiWalletAdapter;
  }
  
  /**
   * Transaction status
   */
  export type TransactionStatus = 'pending' | 'success' | 'failed';
  
  /**
   * Transaction details
   */
  export interface TransactionDetails {
    id: string;
    status: TransactionStatus;
    timestamp: number;
    sender: string;
    gasUsed?: number;
    gasFee?: number;
    effects?: any;
    events?: any[];
    error?: string;
  }
  
  /**
   * Token balance
   */
  export interface TokenBalance {
    token: string;
    symbol: string;
    decimals: number;
    balance: number;
    usdValue?: number;
  }
  
  /**
   * Sui object
   */
  export interface SuiObject {
    objectId: string;
    version: number;
    digest: string;
    type: string;
    owner: {
      AddressOwner?: string;
      ObjectOwner?: string;
      Shared?: {
        initial_shared_version: number;
      };
      Immutable?: boolean;
    };
    previousTransaction: string;
    storageRebate: number;
    content: {
      dataType: 'moveObject';
      type: string;
      hasPublicTransfer: boolean;
      fields: Record<string, any>;
    };
  }
  
  /**
   * Move event
   */
  export interface MoveEvent {
    id: {
      txDigest: string;
      eventSeq: number;
    };
    packageId: string;
    transactionModule: string;
    sender: string;
    type: string;
    parsedJson: Record<string, any>;
    bcs: string;
    timestampMs: number;
  }
  
  /**
   * Sui blockchain event structure
   */
  export interface SuiEvent {
    id: string;
    packageId: string;
    moduleName: string;
    eventName: string;
    data: any;
    sender: string;
    timestamp: number;
  }
  
  /**
   * Spin event from the blockchain
   */
  export interface SpinEvent extends SuiEvent {
    data: {
      player: string;
      betAmount: number;
      winAmount: number;
      multiplier: number;
      freeSpins: number;
      reelPositions: string[][];
      paylines: number[];
    };
  }
  
  /**
   * Blockchain network info
   */
  export interface NetworkInfo {
    name: string; // 'mainnet' | 'testnet' | 'devnet' | 'localnet'
    url: string;
    faucetUrl?: string;
    explorerUrl: string;
  }
  
  /**
   * Transaction execution result
   */
  export interface TransactionResult {
    status: 'success' | 'error';
    transactionId?: string;
    error?: string;
    data?: any;
  }