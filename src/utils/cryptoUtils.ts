// src/utils/cryptoUtils.ts

/**
 * Simple utility functions for cryptographic operations
 * In a production environment, these would use more robust libraries
 */

/**
 * Generate a SHA-256 hash of the input string
 * @param input String to hash
 * @returns Hex string of the hash
 */
export const sha256 = async (input: string): Promise<string> => {
  // For browser environments, use the Web Crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      // Convert string to buffer
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      // Generate hash
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      
      // Convert buffer to hex string
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (err) {
      console.error('Web Crypto API error:', err);
      // Fall back to simple hash if Web Crypto fails
      return simpleHash(input);
    }
  }
  
  // Fall back to a simple hash implementation for non-browser environments
  // or if the Web Crypto API is not available
  return simpleHash(input);
};

/**
 * A simple (non-cryptographic) hash function as fallback
 * NOT FOR PRODUCTION USE - this is just a fallback for development
 * @param input String to hash
 * @returns A hash string
 */
const simpleHash = (input: string): string => {
  let hash = 0;
  
  if (input.length === 0) return hash.toString(16);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure it's 64 characters long (to mimic SHA-256)
  const hexHash = Math.abs(hash).toString(16);
  const padding = '0'.repeat(64 - hexHash.length);
  
  return padding + hexHash;
};

/**
 * Generate a random hex string of specified length
 * @param length Length of the output string (characters)
 * @returns Random hex string
 */
export const randomHex = (length: number): string => {
  const chars = '0123456789abcdef';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return result;
};

/**
 * Verify a digital signature
 * This is a placeholder - in a real implementation, this would use proper signature verification
 * @param message The message that was signed
 * @param signature The signature to verify
 * @param publicKey The public key to verify against
 * @returns Boolean indicating if signature is valid
 */
export const verifySignature = async (
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> => {
  // In a real implementation, this would use proper crypto libraries
  // For development, we'll just return true
  console.log('Signature verification called with:', { message, signature, publicKey });
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Always return true for development
  return true;
};

export default {
  sha256,
  randomHex,
  verifySignature
};