// src/utils/randomGenerator.ts
import { sha256 } from './cryptoUtils';

/**
 * Generate a cryptographically secure random seed
 * @returns A random seed string
 */
export const generateRandomSeed = (): string => {
  // In a real implementation, this would generate a cryptographically secure random seed
  // For development, we'll use a simple random string
  const randomBytes = new Uint8Array(32);
  
  // Fill with random values
  for (let i = 0; i < randomBytes.length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  
  // Convert to hex string
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Generate a client seed for additional randomness
 * @returns A client seed string
 */
export const generateClientSeed = (): string => {
  // Generate a client seed based on current time and some random values
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString().slice(2);
  
  // Combine and hash
  return sha256(`${timestamp}:${randomPart}`);
};

/**
 * Verify that a server seed matches its hash
 * @param serverSeed The revealed server seed after the game
 * @param serverSeedHash The hash of the server seed shown before the game
 * @returns Boolean indicating if the verification passed
 */
export const verifyServerSeed = async (
  serverSeed: string,
  serverSeedHash: string
): Promise<boolean> => {
  const calculatedHash = await sha256(serverSeed);
  return calculatedHash === serverSeedHash;
};

/**
 * Generate a random number using a combination of seeds
 * @param serverSeed The server seed
 * @param clientSeed The client seed
 * @param nonce The nonce (typically the round number)
 * @param min The minimum value (inclusive)
 * @param max The maximum value (exclusive)
 * @returns A random number between min and max
 */
export const generateRandomNumber = async (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  min: number,
  max: number
): Promise<number> => {
  // Combine inputs
  const input = `${serverSeed}:${clientSeed}:${nonce}`;
  
  // Hash the input
  const hash = await sha256(input);
  
  // Convert first 8 characters of hash to a number between 0 and 1
  const decimal = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  
  // Scale to the desired range
  return Math.floor(decimal * (max - min)) + min;
};

/**
 * Generate multiple random numbers using a single seed combination
 * @param serverSeed The server seed
 * @param clientSeed The client seed
 * @param nonce The starting nonce
 * @param count How many random numbers to generate
 * @param min The minimum value (inclusive)
 * @param max The maximum value (exclusive)
 * @returns An array of random numbers
 */
export const generateMultipleRandomNumbers = async (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  count: number,
  min: number,
  max: number
): Promise<number[]> => {
  const results: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomNum = await generateRandomNumber(
      serverSeed,
      clientSeed,
      nonce + i,
      min,
      max
    );
    results.push(randomNum);
  }
  
  return results;
};

/**
 * Generate random reel positions using a seed combination
 * @param serverSeed The server seed
 * @param clientSeed The client seed
 * @param nonce The nonce
 * @returns A 3x3 array of indices representing symbol positions
 */
export const generateReelPositions = async (
  serverSeed: string,
  clientSeed: string,
  nonce: number
): Promise<number[][]> => {
  // Generate 9 random numbers (3 reels x 3 positions)
  const randomNumbers = await generateMultipleRandomNumbers(
    serverSeed,
    clientSeed,
    nonce,
    9,
    0,
    100 // Range 0-99 for percentage-based symbol selection
  );
  
  // Convert to a 3x3 grid (organized by reels)
  const positions: number[][] = [[], [], []];
  
  for (let i = 0; i < randomNumbers.length; i++) {
    const reel = Math.floor(i / 3);
    positions[reel].push(randomNumbers[i]);
  }
  
  return positions;
};

export default {
  generateRandomSeed,
  generateClientSeed,
  verifyServerSeed,
  generateRandomNumber,
  generateMultipleRandomNumbers,
  generateReelPositions,
};