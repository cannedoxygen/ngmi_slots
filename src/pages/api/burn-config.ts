// src/pages/api/burn-config.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// This is a proxy endpoint that forwards the request to the main site's burn-config API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Determine the correct API URL
    // During development, we need to forward to the actual server
    // In production, we can just use the relative path since both are served from the same origin
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'https://simpcity.io/api/burn-config' // Replace with your actual domain in development
      : '/api/burn-config'; // In production, use relative path
    
    console.log(`Forwarding burn-config request to: ${apiUrl}`);
    
    // Make the request to the main site's API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch burn config: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // For development debugging, log the token address
    console.log(`Token address from burn config: ${data.tokenAddress}`);
    
    // Send the response back to the client
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in burn-config API:', error);
    
    // Fallback if the main API is unavailable
    const fallbackConfig = {
      tokenAddress: '88KKUzT9B5sHRopVgRNn3VEfKh7g4ykLXqqjPT7Hpump', // Hardcoded SIMP token address
      burnAmount: 1000,
      burnAmountLamports: 1000000000000, // 1000 * 10^9
      decimals: 9,
      network: 'mainnet-beta',
      rpcEndpoint: 'https://mainnet.helius-rpc.com/?api-key=99b7e94e-9dff-4de3-82ac-567bfbda369c'
    };
    
    console.log('Using fallback burn config with token address:', fallbackConfig.tokenAddress);
    
    res.status(200).json(fallbackConfig);
  }
}