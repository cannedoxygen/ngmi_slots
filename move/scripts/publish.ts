// move/scripts/publish.ts
import { execSync } from 'child_process';
import { JsonRpcProvider, Ed25519Keypair, RawSigner, TransactionBlock } from '@mysten/sui.js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '../../.env.local') });

// Constants
const RPC_URL = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '';
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '';
const UPGRADE_CAP_ID = process.env.UPGRADE_CAP_ID || '';
const DEPLOY_OUTPUT_FILE = path.join(__dirname, '../deployed-address.json');
const MOVE_TOML_PATH = path.join(__dirname, '../Move.toml');

/**
 * Script to publish updates to the NGMI Slots smart contract
 * This is used for upgrades after the initial deployment
 */
async function main() {
  console.log('Publishing NGMI Slots contract update...');
  
  if (!ADMIN_PRIVATE_KEY) {
    console.error('Error: ADMIN_PRIVATE_KEY is required in .env.local file');
    process.exit(1);
  }

  if (!PACKAGE_ID) {
    console.error('Error: NEXT_PUBLIC_PACKAGE_ID is required in .env.local file');
    process.exit(1);
  }

  if (!UPGRADE_CAP_ID) {
    console.error('Error: UPGRADE_CAP_ID is required in .env.local file');
    console.error('You need to set this to the Upgrade capability object ID from the initial deployment');
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
    
    // Update Move.toml with the published-at address
    updateMoveToml(PACKAGE_ID);

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
    
    // Check the digest
    let digest;
    try {
      const digestOutput = execSync('sui move build --dump-bytecode-as-base64', { 
        cwd: path.join(__dirname, '..') 
      });
      digest = digestOutput.toString().trim();
      console.log('Package bytecode digest prepared for upgrade');
    } catch (error) {
      console.error('Failed to get digest:', error);
      process.exit(1);
    }
    
    // Publish the upgrade using the upgrade cap
    console.log('Publishing upgrade...');
    try {
      // Create transaction block
      const tx = new TransactionBlock();
      
      // Call the upgrade function with the upgrade cap
      tx.moveCall({
        target: '0x2::package::upgrade_from_metadata',
        arguments: [
          tx.object(UPGRADE_CAP_ID),
          tx.pure(['base64:' + digest]),
        ],
      });
      
      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      
      console.log('Upgrade transaction successful!');
      console.log('Transaction digest:', result.digest);
      
      // Extract any important information from the result
      if (result.effects?.status.status === 'success') {
        console.log('Contract upgrade completed successfully');
        
        // Save upgrade info
        const upgradeInfo = {
          network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
          packageId: PACKAGE_ID,
          upgradedAt: new Date().toISOString(),
          upgradedBy: address,
          transactionDigest: result.digest
        };
        
        const deployInfo = JSON.parse(fs.readFileSync(DEPLOY_OUTPUT_FILE, 'utf8'));
        deployInfo.upgrades = deployInfo.upgrades || [];
        deployInfo.upgrades.push(upgradeInfo);
        
        fs.writeFileSync(DEPLOY_OUTPUT_FILE, JSON.stringify(deployInfo, null, 2));
        console.log(`Upgrade info saved to ${DEPLOY_OUTPUT_FILE}`);
      } else {
        console.error('Upgrade failed:', result.effects?.status);
        process.exit(1);
      }
    } catch (error) {
      console.error('Upgrade transaction failed:', error);
      process.exit(1);
    }
    
    console.log('\nContract upgrade complete!');
  } catch (error) {
    console.error('Upgrade failed:', error);
    process.exit(1);
  }
}

/**
 * Update the Move.toml file with the published-at address
 */
function updateMoveToml(packageId: string) {
  if (!fs.existsSync(MOVE_TOML_PATH)) {
    console.error(`Error: Move.toml not found at ${MOVE_TOML_PATH}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(MOVE_TOML_PATH, 'utf8');
  
  // Check if there's a commented published-at line
  const commentedPublishedAtRegex = /^#\s*published-at\s*=\s*"0x[0-9a-fA-F]+"/m;
  
  // Check if there's an active published-at line
  const publishedAtRegex = /^published-at\s*=\s*"0x[0-9a-fA-F]+"/m;
  
  if (commentedPublishedAtRegex.test(content)) {
    // Uncomment and update the published-at line
    content = content.replace(commentedPublishedAtRegex, `published-at = "${packageId}"`);
  } else if (publishedAtRegex.test(content)) {
    // Update the existing published-at line
    content = content.replace(publishedAtRegex, `published-at = "${packageId}"`);
  } else {
    // Add a new published-at line
    const addressesSection = content.indexOf('[addresses]');
    if (addressesSection !== -1) {
      const lines = content.split('\n');
      let addressesSectionLine = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '[addresses]') {
          addressesSectionLine = i;
          break;
        }
      }
      
      lines.splice(addressesSectionLine + 1, 0, `published-at = "${packageId}"`);
      content = lines.join('\n');
    } else {
      // If there's no [addresses] section, append it
      content += `\n\n[addresses]\npublished-at = "${packageId}"\n`;
    }
  }
  
  console.log(`Updated Move.toml with published-at = "${packageId}"`);
  fs.writeFileSync(MOVE_TOML_PATH, content);
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});