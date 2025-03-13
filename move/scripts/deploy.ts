// move/scripts/deploy.ts
import { execSync } from 'child_process';
import { JsonRpcProvider, Ed25519Keypair, RawSigner, SuiObjectRef } from '@mysten/sui.js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '../../.env.local') });

// Constants
const RPC_URL = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '';
const DEPLOY_OUTPUT_FILE = path.join(__dirname, '../deployed-address.json');
const MOVE_TOML_PATH = path.join(__dirname, '../Move.toml');

/**
 * Script to deploy the NGMI Slots smart contract to the Sui blockchain
 */
async function main() {
  console.log('Deploying NGMI Slots smart contract...');
  
  if (!ADMIN_PRIVATE_KEY) {
    console.error('Error: ADMIN_PRIVATE_KEY is required in .env.local file');
    process.exit(1);
  }

  try {
    // Initialize provider and signer
    const provider = new JsonRpcProvider(RPC_URL);
    const keypair = Ed25519Keypair.fromSecretKey(Buffer.from(ADMIN_PRIVATE_KEY, 'hex'));
    const signer = new RawSigner(keypair, provider);
    
    // Get signer's address
    const address = await signer.getAddress();
    console.log(`Using address: ${address}`);
    
    // Check if Move.toml has a published-at address - if so, we'll need to fix it
    updateMoveToml();

    // Build the package
    console.log('Building Move package...');
    try {
      execSync('sui move build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit' 
      });
    } catch (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
    
    // Publish the package
    console.log('Publishing package to the Sui blockchain...');
    try {
      const result = execSync('sui client publish --gas-budget 100000000 --json', { 
        cwd: path.join(__dirname, '..') 
      });
      
      // Parse the JSON output
      const publishResult = JSON.parse(result.toString());
      console.log('Publish transaction successful!');
      
      // Extract package ID
      const packageId = getPackageIdFromPublishResult(publishResult);
      if (!packageId) {
        console.error('Error: Could not find package ID in publish result');
        process.exit(1);
      }
      
      console.log(`Package ID: ${packageId}`);
      
      // Save deployment info
      const deployInfo = {
        network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
        packageId: packageId,
        deployedAt: new Date().toISOString(),
        deployedBy: address
      };
      
      fs.writeFileSync(DEPLOY_OUTPUT_FILE, JSON.stringify(deployInfo, null, 2));
      console.log(`Deployment info saved to ${DEPLOY_OUTPUT_FILE}`);
      
      // Update .env.local with the package ID
      updateEnvFile(packageId);
      
      console.log('\nDeployment complete!');
      console.log(`\nNGMI Slots contract deployed at: ${packageId}`);
      console.log(`Network: ${process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'}`);
    } catch (error) {
      console.error('Publish failed:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

/**
 * Extract the package ID from the publish result
 */
function getPackageIdFromPublishResult(publishResult: any): string | null {
  // Logic depends on the structure of the Sui CLI publish result
  // This is a simplified version
  try {
    // Check for effects
    if (publishResult.effects && publishResult.effects.created) {
      // Look for the created object with the Package type
      const packageObj = publishResult.effects.created.find(
        (item: any) => item.owner === 'Immutable' && item.type === 'package'
      );
      
      if (packageObj && packageObj.reference) {
        return packageObj.reference.objectId;
      }
    }
    
    // Fallback to looking in events
    if (publishResult.events) {
      const publishEvent = publishResult.events.find(
        (event: any) => event.type === 'publish'
      );
      
      if (publishEvent && publishEvent.packageId) {
        return publishEvent.packageId;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing publish result:', error);
    return null;
  }
}

/**
 * Update the .env.local file with the package ID
 */
function updateEnvFile(packageId: string) {
  const envPath = path.join(__dirname, '../../.env.local');
  
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add package ID
    const packageIdVar = 'NEXT_PUBLIC_PACKAGE_ID';
    const regex = new RegExp(`^${packageIdVar}=.*`, 'm');
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${packageIdVar}=${packageId}`);
    } else {
      envContent += `\n${packageIdVar}=${packageId}`;
    }
    
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log(`Updated ${envPath} with NEXT_PUBLIC_PACKAGE_ID=${packageId}`);
  } catch (error) {
    console.error(`Warning: Failed to update ${envPath}:`, error);
    console.log(`Please manually add NEXT_PUBLIC_PACKAGE_ID=${packageId} to your .env.local file`);
  }
}

/**
 * Update the Move.toml file to fix published-at if needed
 */
function updateMoveToml() {
  if (!fs.existsSync(MOVE_TOML_PATH)) {
    console.error(`Error: Move.toml not found at ${MOVE_TOML_PATH}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(MOVE_TOML_PATH, 'utf8');
  
  // Check if there's a published-at line and comment it out
  const publishedAtRegex = /^published-at\s*=\s*"0x[0-9a-fA-F]+"/m;
  if (publishedAtRegex.test(content)) {
    content = content.replace(publishedAtRegex, '# $&');
    console.log('Commented out published-at in Move.toml for fresh deployment');
    fs.writeFileSync(MOVE_TOML_PATH, content);
  }
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});