// src/utils/sui.ts
import { constants } from './constants';

/**
 * Formats a date for display
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Shortens a transaction ID or address for display
 * @param id The full transaction ID or address
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Shortened string with ellipsis in the middle
 */
export const shortenTxId = (
  id: string,
  startChars = 6,
  endChars = 4
): string => {
  if (!id || id.length <= startChars + endChars + 3) {
    return id || '';
  }
  
  return `${id.substring(0, startChars)}...${id.substring(id.length - endChars)}`;
};

/**
 * Formats a token amount for display
 * @param amount The amount in base units
 * @param decimals Number of decimal places the token has
 * @param symbol Token symbol to append
 * @returns Formatted amount string
 */
export const formatTokenAmount = (
  amount: number | string,
  decimals: number = constants.tokenDecimals,
  symbol: string = constants.tokenSymbol
): string => {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // If it's NaN or undefined, return zero
  if (isNaN(numAmount)) return `0 ${symbol}`;
  
  // Format with the correct number of decimal places
  const formattedAmount = (numAmount / Math.pow(10, decimals)).toLocaleString(
    undefined, // Use browser locale
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }
  );
  
  return `${formattedAmount} ${symbol}`;
};

/**
 * Converts a token amount from display format to base units
 * @param displayAmount The amount in display format (e.g. "1.5")
 * @param decimals Number of decimal places the token has
 * @returns Amount in base units
 */
export const parseTokenAmount = (
  displayAmount: string,
  decimals: number = constants.tokenDecimals
): number => {
  // Remove any non-numeric characters except periods
  const cleanedAmount = displayAmount.replace(/[^\d.]/g, '');
  
  // Convert to number
  const numAmount = parseFloat(cleanedAmount);
  
  // If it's NaN or undefined, return zero
  if (isNaN(numAmount)) return 0;
  
  // Convert to base units
  return Math.floor(numAmount * Math.pow(10, decimals));
};

/**
 * Gets the explorer URL for a transaction
 * @param txId The transaction ID
 * @returns Full URL to the explorer page for this transaction
 */
export const getExplorerUrl = (txId: string): string => {
  // Use testnet explorer by default
  const baseUrl = constants.network === 'mainnet'
    ? 'https://explorer.sui.io/txblock/'
    : 'https://explorer.sui.io/testnet/txblock/';
  
  return `${baseUrl}${txId}`;
};

/**
 * Gets the explorer URL for an address
 * @param address The wallet address
 * @returns Full URL to the explorer page for this address
 */
export const getAddressExplorerUrl = (address: string): string => {
  // Use testnet explorer by default
  const baseUrl = constants.network === 'mainnet'
    ? 'https://explorer.sui.io/address/'
    : 'https://explorer.sui.io/testnet/address/';
  
  return `${baseUrl}${address}`;
};

/**
 * Check if a string is a valid Sui address
 * @param address The string to check
 * @returns Boolean indicating if it's a valid address
 */
export const isValidSuiAddress = (address: string): boolean => {
  // Simple check - Sui addresses start with 0x and are 66 characters long (including 0x)
  return address?.startsWith('0x') && address.length === 66;
};

export default {
  formatDate,
  shortenTxId,
  formatTokenAmount,
  parseTokenAmount,
  getExplorerUrl,
  getAddressExplorerUrl,
  isValidSuiAddress,
};