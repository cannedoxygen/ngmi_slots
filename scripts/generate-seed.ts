// scripts/generate-seed.ts
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to generate secure random seeds for the slot game
 * These seeds are critical for the provably fair gaming mechanism
 * 
 * The script generates:
 * 1. Server seeds - private seeds used by the server
 * 2. Server seed hashes - shared with clients before the game
 * 3. Client seeds - additional entropy provided by clients
 */

// Configuration
const COUNT = process.env.SEED_COUNT ? parseInt(process.env.SEED_COUNT) : 100;
const OUTPUT_DIR = path.join(__dirname, '..', 'seeds');
const SERVER_SEEDS_FILE = path.join(OUTPUT_DIR, 'server-seeds.json');
const SERVER_SEED_HASHES_FILE = path.join(OUTPUT_DIR, 'server-seed-hashes.json');
const CLIENT_SEEDS_FILE = path.join(OUTPUT_DIR, 'client-seeds.json');

/**
 * Generate a secure random hex string
 * @param length Length of the output string (hex characters)
 * @returns Random hex string
 */
function generateRandomHex(length: number): string {
  // Each byte becomes 2 hex characters
  const bytes = Math.ceil(length / 2);
  const buffer = crypto.randomBytes(bytes);
  return buffer.toString('hex').slice(0, length);
}

/**
 * Generate a SHA-256 hash
 * @param input String to hash
 * @returns Hex string of the hash
 */
function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Main function
 */
async function main() {
  console.log(`Generating ${COUNT} secure random seeds...`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate seeds
  const serverSeeds: string[] = [];
  const serverSeedHashes: string[] = [];
  const clientSeeds: string[] = [];
  
  for (let i = 0; i < COUNT; i++) {
    // Generate server seed (64 hex characters = 32 bytes = 256 bits)
    const serverSeed = generateRandomHex(64);
    serverSeeds.push(serverSeed);
    
    // Generate hash of server seed
    const serverSeedHash = sha256(serverSeed);
    serverSeedHashes.push(serverSeedHash);
    
    // Generate client seed (32 hex characters = 16 bytes = 128 bits)
    const clientSeed = generateRandomHex(32);
    clientSeeds.push(clientSeed);
    
    if ((i + 1) % 10 === 0 || i === COUNT - 1) {
      process.stdout.write(`\rGenerated ${i + 1} seeds`);
    }
  }
  
  console.log('\nSaving seeds to files...');
  
  // Save server seeds (keep these private!)
  fs.writeFileSync(
    SERVER_SEEDS_FILE,
    JSON.stringify(serverSeeds, null, 2)
  );
  console.log(`Server seeds saved to ${SERVER_SEEDS_FILE}`);
  
  // Save server seed hashes (these are public)
  fs.writeFileSync(
    SERVER_SEED_HASHES_FILE,
    JSON.stringify(serverSeedHashes, null, 2)
  );
  console.log(`Server seed hashes saved to ${SERVER_SEED_HASHES_FILE}`);
  
  // Save client seeds (these can be public)
  fs.writeFileSync(
    CLIENT_SEEDS_FILE,
    JSON.stringify(clientSeeds, null, 2)
  );
  console.log(`Client seeds saved to ${CLIENT_SEEDS_FILE}`);
  
  // Print verification examples
  console.log('\nVerification example:');
  console.log(`Server seed: ${serverSeeds[0]}`);
  console.log(`Hash: ${serverSeedHashes[0]}`);
  console.log(`Verify: ${sha256(serverSeeds[0]) === serverSeedHashes[0] ? 'VALID' : 'INVALID'}`);
  
  console.log('\nSeed generation complete!');
  console.log('\nIMPORTANT: Keep server seeds secure. Only reveal them to verify game outcomes after the fact.');
}

// Run the script
main().catch((error) => {
  console.error('Error generating seeds:', error);
  process.exit(1);
});