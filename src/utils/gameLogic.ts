// src/utils/gameLogic.ts
import { gameConfig } from '../config/gameConfig';
import { paylines, activePaylines } from '../config/paylines';
import { GameSymbol, Payline, WinResult } from '../types/game';

/**
 * Evaluates a spin result to determine wins
 * @param reelPositions 3x3 grid of symbol identifiers
 * @param betAmount The amount bet on this spin
 * @param paylinesToCheck The paylines to check for wins (defaults to active paylines)
 * @returns Object containing win information
 */
export const evaluateWin = (
  reelPositions: string[][],
  betAmount: number,
  paylinesToCheck = activePaylines
): WinResult => {
  // Initialize result object
  const result: WinResult = {
    totalWin: 0,
    winningPaylines: [],
    winsByPayline: {},
    multiplier: 1,
    freeSpins: 0,
    symbols: []
  };
  
  // Check if we have a valid 3x3 grid
  if (!reelPositions || reelPositions.length !== 3) {
    return result;
  }
  
  // Check for multipliers anywhere on the grid
  let highestMultiplier = 1;
  let freeSpinsCount = 0;
  
  // Collect all symbols for later reference
  const allSymbols: string[] = [];
  
  // Process the grid to collect special symbols and all displayed symbols
  for (let reel = 0; reel < reelPositions.length; reel++) {
    for (let row = 0; row < reelPositions[reel].length; row++) {
      const symbolId = reelPositions[reel][row];
      allSymbols.push(symbolId);
      
      // Check if this is a multiplier symbol
      if (symbolId.startsWith('multiplier-')) {
        const symbolConfig = gameConfig.symbols[symbolId];
        if (symbolConfig && symbolConfig.multiplier) {
          highestMultiplier = Math.max(highestMultiplier, symbolConfig.multiplier);
        }
      }
      
      // Check if this is a free spin symbol
      if (symbolId === 'free-spin') {
        const symbolConfig = gameConfig.symbols[symbolId];
        if (symbolConfig && symbolConfig.freeSpins) {
          freeSpinsCount += symbolConfig.freeSpins;
        }
      }
    }
  }
  
  // Store all symbols in result
  result.symbols = allSymbols;
  
  // Check for jackpot (all positions have the high-tardi symbol)
  const isJackpot = allSymbols.every(symbol => symbol === 'high-tardi');
  
  if (isJackpot) {
    // Jackpot win!
    const jackpotAmount = betAmount * gameConfig.jackpotMultiplier * highestMultiplier;
    result.totalWin = jackpotAmount;
    result.multiplier = highestMultiplier;
    result.isJackpot = true;
    
    // In a jackpot, all paylines are winners
    result.winningPaylines = paylinesToCheck.map(pl => pl.id);
    
    // Add individual payline wins
    paylinesToCheck.forEach(payline => {
      result.winsByPayline[payline.id] = jackpotAmount / paylinesToCheck.length;
    });
    
    result.freeSpins = freeSpinsCount;
    return result;
  }
  
  // Check each payline for wins
  paylinesToCheck.forEach(payline => {
    const paylineWin = checkPaylineWin(reelPositions, payline, betAmount);
    
    if (paylineWin > 0) {
      result.winningPaylines.push(payline.id);
      result.winsByPayline[payline.id] = paylineWin;
      result.totalWin += paylineWin;
    }
  });
  
  // Apply multiplier to total win
  if (result.totalWin > 0 && highestMultiplier > 1) {
    result.totalWin *= highestMultiplier;
    result.multiplier = highestMultiplier;
  }
  
  // Add free spins
  result.freeSpins = freeSpinsCount;
  
  return result;
};

/**
 * Checks if a specific payline has a winning combination
 * @param reelPositions 3x3 grid of symbol identifiers
 * @param payline The payline to check
 * @param betAmount The amount bet on this spin
 * @returns The win amount for this payline (0 if no win)
 */
export const checkPaylineWin = (
  reelPositions: string[][],
  payline: Payline,
  betAmount: number
): number => {
  // Extract symbols along this payline
  const symbolsOnPayline = payline.positions.map(([row, col]) => 
    reelPositions[col][row] // Note the [col][row] order since reelPositions is organized by columns first
  );
  
  // Check if all symbols are the same (excluding special symbols that don't form winning lines)
  const firstSymbol = symbolsOnPayline[0];
  
  // Special symbols that don't form winning combinations by themselves
  const nonWinningSymbols = ['multiplier-2x', 'multiplier-5x', 'multiplier-10x', 'free-spin'];
  
  // Skip checking if the first symbol is a special symbol
  if (nonWinningSymbols.includes(firstSymbol)) {
    return 0;
  }
  
  // Check if all symbols match the first one
  const allMatch = symbolsOnPayline.every(symbol => 
    symbol === firstSymbol || nonWinningSymbols.includes(symbol)
  );
  
  if (allMatch) {
    // Get the payout for this symbol
    const symbolConfig = gameConfig.symbols[firstSymbol];
    if (symbolConfig && symbolConfig.payout) {
      return symbolConfig.payout * betAmount;
    }
  }
  
  return 0;
};

/**
 * Gets the positions of symbols on a specific payline
 * @param paylineId The ID of the payline
 * @returns Array of positions or null if payline doesn't exist
 */
export const getPaylinePositions = (paylineId: number): [number, number][] | null => {
  const payline = paylines.find(p => p.id === paylineId);
  return payline ? payline.positions : null;
};

export default {
  evaluateWin,
  checkPaylineWin,
  getPaylinePositions,
};