// src/pages/api/verify-seed.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyServerSeed } from '../../utils/randomGenerator';

type ResponseData = {
  valid: boolean;
  error?: string;
};

/**
 * API endpoint for verifying server seeds to ensure provably fair gameplay
 * 
 * This allows players to verify that the outcome of their spins was fair
 * by confirming that the server seed revealed after the spin matches the 
 * hashed seed they were shown before the spin.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  try {
    // Extract the server seed and its hash from the request body
    const { serverSeed, serverSeedHash } = req.body;

    // Validate inputs
    if (!serverSeed || !serverSeedHash) {
      return res.status(400).json({
        valid: false,
        error: 'Both serverSeed and serverSeedHash are required'
      });
    }

    // Verify the server seed
    const isValid = await verifyServerSeed(serverSeed, serverSeedHash);

    // Return the verification result
    return res.status(200).json({ valid: isValid });
  } catch (error: any) {
    console.error('Error verifying seed:', error);
    
    return res.status(500).json({
      valid: false,
      error: 'Failed to verify seed: ' + (error.message || 'Unknown error')
    });
  }
}