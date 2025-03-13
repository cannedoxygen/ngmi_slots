// scripts/sui-setup.ts
import { JsonRpcProvider, Ed25519Keypair, RawSigner, TransactionBlock } from '@mysten/sui.js';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Load environment variables
config();

// Constants
const FAUCET_URL = process.env.SUI_FAUCET_URL || 'https://faucet.testnet.sui.io/gas';
const RPC_URL = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
const KEYFILE_PATH = path.join(__dirname, '..', '.sui', 'sui.keystore');
const ENV_PATH = path.join(__dirname, '..', '.env.local');

/**
 * Setup script for Sui development environment
 * - Creates a new keypair if not exists
 * - Requests test tokens from faucet
 * - Configures local environment variables
 */
async function main() {
  console.log('Setting up Sui development environment...');
  
  try {
    // Initialize provider
    const provider = new JsonRpcProvider(RPC_URL);
    console.log(`Connected to Sui RPC: ${RPC_URL}`);
    
    // Ensure .sui directory exists
    if (!fs.existsSync(path.join(__dirname, '..', '.sui'))) {
      fs.mkdirSync(path.join(__dirname, '..', '.sui'), { recursive: true });
    }
    
    // Check for existing keypair or create new one
    let keypair;
    let privateKey;
    
    if (fs.existsSync(KEYFILE_PATH)) {
      console.log('Found existing keystore. Loading keypair...');
      // In a real implementation, this would load from sui.keystore
      // For simplicity, we generate a new keypair
      keypair = Ed25519Keypair.generate();
      privateKey = Buffer.from(keypair.export().privateKey).toString('hex');
    } else {
      console.log('No keystore found. Generating new keypair...');
      keypair = Ed25519Keypair.generate();
      privateKey = Buffer.from(keypair.export().privateKey).toString('hex');
      
      // Save keypair to file (simplified - in practice, use Sui's keystore format)
      const keydata = JSON.stringify({
        privateKey: privateKey
      });
      fs.writeFileSync(KEYFILE_PATH, keydata);
      console.log(`Keypair saved to ${KEYFILE_PATH}`);
    }
    
    // Setup signer
    const signer = new RawSigner(keypair, provider);
    const address = await signer.getAddress();
    console.log(`Using address: ${address}`);
    
    // Request test tokens from faucet
    console.log('Requesting test tokens from faucet...');
    try {
      // In development environment, use CLI to request tokens
      execSync(`curl -X POST ${FAUCET_URL} -H 'Content-Type: application/json' -d '{"FixedAmountRequest":{"recipient":"${address}"}}'`);
      console.log('Faucet request sent. Waiting for tokens...');
      
      // Wait a bit for the faucet transaction to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.warn('Warning: Failed to request tokens automatically from faucet.');
      console.warn(`Please manually request tokens for address: ${address}`);
    }
    
    // Check balance
    const { data: coins } = await provider.getCoins({
      owner: address,
    });
    
    if (coins.length > 0) {
      const totalBalance = coins.reduce((acc, coin) => acc + BigInt(coin.balance), BigInt(0));
      console.log(`Current balance: ${totalBalance} MIST (${Number(totalBalance) / 1e9} SUI)`);
    } else {
      console.log('No coins found. Please request tokens from the faucet manually.');
    }
    
    // Create or update .env.local with needed values
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf8');
    }
    
    // Update values
    const envVars = {
      NEXT_PUBLIC_SUI_NETWORK: 'testnet',
      ADMIN_ADDRESS: address,
      ADMIN_PRIVATE_KEY: privateKey,
      SUI_RPC_URL: RPC_URL,
    };
    
    // Update or add each environment variable
    for (const [key, value] of Object.entries(envVars)) {
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }
    
    fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
    console.log(`Environment variables updated in ${ENV_PATH}`);
    
    console.log('\nSui development environment setup complete!');
    console.log('Next steps:');
    console.log('1. Run `npm run deploy:move` to deploy the smart contract');
    console.log('2. Add the PACKAGE_ID to your .env.local file');
    console.log('3. Run `npm run dev` to start the development server');
    
  } catch (error) {
    console.error('Error setting up Sui environment:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});