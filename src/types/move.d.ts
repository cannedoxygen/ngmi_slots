// src/types/move.d.ts

/**
 * Type definitions for Move smart contract interactions
 */

/**
 * Move function call parameters
 */
export interface MoveCallParams {
    packageId: string;
    module: string;
    function: string;
    arguments?: any[];
    typeArguments?: string[];
    gasBudget?: number;
  }
  
  /**
   * Move function call result
   */
  export interface MoveCallResult {
    status: 'success' | 'error';
    transactionId?: string;
    error?: string;
    data?: any;
  }
  
  /**
   * Move object reference
   */
  export interface MoveObjectRef {
    objectId: string;
    version: number;
    digest: string;
  }
  
  /**
   * Move package structure
   */
  export interface MovePackage {
    packageId: string;
    modules: Record<string, MoveModule>;
    version: number;
    published: number; // timestamp
  }
  
  /**
   * Move module structure
   */
  export interface MoveModule {
    name: string;
    functions: Record<string, MoveFunction>;
    structs: Record<string, MoveStruct>;
    fileFormat: string;
  }
  
  /**
   * Move function structure
   */
  export interface MoveFunction {
    name: string;
    visibility: 'public' | 'private' | 'friend';
    isEntry: boolean;
    parameters: MoveType[];
    returns: MoveType[];
  }
  
  /**
   * Move struct structure
   */
  export interface MoveStruct {
    name: string;
    abilities: string[];
    fields: MoveField[];
    isResource: boolean;
  }
  
  /**
   * Move field structure
   */
  export interface MoveField {
    name: string;
    type: MoveType;
  }
  
  /**
   * Move type definition
   */
  export type MoveType =
    | { type: 'address' }
    | { type: 'bool' }
    | { type: 'u8' }
    | { type: 'u16' }
    | { type: 'u32' }
    | { type: 'u64' }
    | { type: 'u128' }
    | { type: 'u256' }
    | { type: 'vector'; elementType: MoveType }
    | { type: 'struct'; module: string; name: string; typeParameters: MoveType[] };
  
  /**
   * Slot machine game state
   */
  export interface SlotGameState {
    id: MoveObjectRef;
    owner: string;
    betAmount: number;
    jackpotPool: number;
    totalBets: number;
    totalWins: number;
    spinsCount: number;
    paused: boolean;
    version: number;
  }
  
  /**
   * Player state for the slot game
   */
  export interface PlayerState {
    id: MoveObjectRef;
    player: string;
    totalBets: number;
    totalWins: number;
    spinsCount: number;
    bestWin: number;
    freeSpinsRemaining: number;
    lastSpin: number; // timestamp
  }
  
  /**
   * Spin function parameters
   */
  export interface SpinParams {
    gameId: string;
    betAmount: number;
    seed: string; // Client-side random seed
  }
  
  /**
   * Spin result from the Move contract
   */
  export interface SpinResultMove {
    reelPositions: number[][];
    winAmount: number;
    multiplier: number;
    winningPaylines: number[];
    freeSpinsAwarded: number;
    seed: string; // Server seed revealed after spin
    seedHash: string; // Hash of server seed shown before spin
  }
  
  /**
   * Game configuration from Move contract
   */
  export interface GameConfigMove {
    minBet: number;
    maxBet: number;
    houseEdge: number; // e.g., 5% = 5000 (in basis points)
    maxPayoutMultiplier: number;
    paused: boolean;
    owner: string;
  }