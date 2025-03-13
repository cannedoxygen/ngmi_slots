// scripts/verify-contract.ts
import { JsonRpcProvider, Keypair, RawSigner, TransactionBlock } from '@mysten/sui.js';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || '';
const PACKAGE_ID = process.env.PACKAGE_ID || '';
const RPC_URL = process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';

/**
 * Script to verify deployed Move contract functionality
 * Tests basic operations like spinning the slot machine
 */
async function main() {
  if (!PRIVATE_KEY) {
    console.error('Error: ADMIN_PRIVATE_KEY is required in .env file');
    process.exit(1);
  }

  if (!PACKAGE_ID) {
    console.error('Error: PACKAGE_ID is required in .env file');
    process.exit(1);
  }

  console.log('Verifying contract functionality...');
  console.log(`Package ID: ${PACKAGE_ID}`);
  console.log(`RPC URL: ${RPC_URL}`);

  try {
    // Initialize provider and signer
    const provider = new JsonRpcProvider(RPC_URL);
    const keypair = Keypair.fromSecretKey(Buffer.from(PRIVATE_KEY, 'hex'));
    const signer = new RawSigner(keypair, provider);

    // Get signer's address
    const address = await signer.getAddress();
    console.log(`Using address: ${address}`);

    // Get current gas objects
    const { data: gasObjects } = await provider.getCoins({
      owner: address,
    });

    if (gasObjects.length === 0) {
      console.error('Error: No gas objects available');
      process.exit(1);
    }

    // Get game object ID
    const gameObjects = await provider.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::ngmi_slots::Game`,
      },
    });

    if (gameObjects.data.length === 0) {
      console.log('No game object found. Creating a new game...');
      await createNewGame(signer, provider);
    } else {
      const gameId = gameObjects.data[0].data?.objectId;
      console.log(`Found game object: ${gameId}`);

      // Test spin functionality
      await testSpin(signer, provider, gameId);
    }

    console.log('Contract verification completed successfully');
  } catch (error) {
    console.error('Error verifying contract:', error);
    process.exit(1);
  }
}

/**
 * Create a new game object
 */
async function createNewGame(signer: RawSigner, provider: JsonRpcProvider) {
  const tx = new TransactionBlock();

  // Call the create_game function in the contract
  tx.moveCall({
    target: `${PACKAGE_ID}::ngmi_slots::create_game`,
    arguments: [
      tx.pure(10), // min_bet
      tx.pure(100), // max_bet
      tx.pure(5000), // house_edge (50.00% in basis points)
      tx.pure(100), // max_payout_multiplier
    ],
  });

  console.log('Creating new game...');
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  console.log('Transaction result:', JSON.stringify(result, null, 2));

  // Extract created game object
  const gameCreatedEvent = result.events?.find(
    (event) => event.type === `${PACKAGE_ID}::ngmi_slots::GameCreated`
  );

  if (!gameCreatedEvent) {
    console.error('Error: Game creation event not found');
    process.exit(1);
  }

  const gameId = gameCreatedEvent.parsedJson?.game_id;
  console.log(`Game created with ID: ${gameId}`);
  return gameId;
}

/**
 * Test spin functionality
 */
async function testSpin(signer: RawSigner, provider: JsonRpcProvider, gameId: string) {
  // Generate a random seed
  const seed = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const tx = new TransactionBlock();

  // Get a coin for betting
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(20_000_000)]); // 0.02 SUI for test bet

  // Call the spin function
  tx.moveCall({
    target: `${PACKAGE_ID}::ngmi_slots::spin`,
    arguments: [
      tx.object(gameId), // game object
      coin, // coin to bet
      tx.pure(seed), // random seed
    ],
  });

  console.log('Testing spin with bet amount 20...');
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  console.log('Spin result:', JSON.stringify(result, null, 2));

  // Extract spin result event
  const spinResultEvent = result.events?.find(
    (event) => event.type === `${PACKAGE_ID}::ngmi_slots::SpinResult`
  );

  if (!spinResultEvent) {
    console.log('No spin result event found.');
    return;
  }

  console.log('Spin result event:', spinResultEvent.parsedJson);
  const winAmount = spinResultEvent.parsedJson?.win_amount || 0;
  
  if (winAmount > 0) {
    console.log(`Win! Amount: ${winAmount}`);
  } else {
    console.log('No win this time.');
  }
}

// Run the script
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});