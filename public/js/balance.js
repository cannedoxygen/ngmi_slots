/**
 * SIMPLE BALANCE SOLUTION - One source of truth
 */

// Cache for burn config to reduce server calls
let cachedBurnConfig = null;
let configCacheTime = 0;
const CONFIG_CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

async function getBurnConfig() {
  const now = Date.now();
  
  // Use cached config if it's still fresh
  if (cachedBurnConfig && (now - configCacheTime) < CONFIG_CACHE_DURATION) {
    console.log('Using cached burn config');
    return cachedBurnConfig;
  }
  
  console.log('Fetching fresh burn config');
  const response = await fetch('/api/burn-config');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  cachedBurnConfig = await response.json();
  console.log('Burn config received from server:', cachedBurnConfig);
  configCacheTime = now;
  return cachedBurnConfig;
}

async function updateSimpBalance() {
  // Skip balance updates during burns to prevent double signatures
  if (window._burnInProgress) {
    console.log('%c Balance update skipped - burn in progress', 'background: #222; color: #bada55; font-size: 14px;');
    return;
  }

  console.log('🎯 SIMPLE BALANCE UPDATE STARTING', new Date().toISOString());
  console.log('%c DEBUG INFO: updateSimpBalance called', 'background: #222; color: #bada55; font-size: 14px;');
  
  // Track performance
  const startTime = performance.now();
  
  const walletAddress = localStorage.getItem('walletAddress');
  console.log('Wallet address from localStorage:', walletAddress);
  
  if (!walletAddress) {
    console.log('No wallet connected');
    // Update wallet display to show disconnected
    const walletDisplay = document.getElementById('walletDisplay');
    if (walletDisplay) {
      walletDisplay.textContent = 'Not connected';
      console.log('Updated walletDisplay to "Not connected"');
    } else {
      console.log('walletDisplay element not found in DOM');
    }
    return;
  }
  
  // Update wallet display to show connected address
  const walletDisplay = document.getElementById('walletDisplay');
  const walletInfo = document.getElementById('walletInfo');
  if (walletDisplay) {
    const truncatedAddress = walletAddress.substring(0, 6) + '...' + walletAddress.slice(-4);
    walletDisplay.textContent = truncatedAddress;
    console.log('Updated walletDisplay with truncated address:', truncatedAddress);
    
    // Add title attribute for tooltip
    if (walletInfo) {
      walletInfo.title = 'Click to disconnect wallet';
    } else {
      console.log('walletInfo element not found in DOM');
    }
  } else {
    console.log('walletDisplay element not found in DOM');
  }
  
  try {
    // Get token address from cached config
    console.log('Fetching burn config...');
    const config = await getBurnConfig();
    console.log('Full burn config:', config);
    const tokenAddress = config.tokenAddress;
    
    console.log('Token address from .env:', tokenAddress);
    console.log('RPC endpoint from config:', config.rpcEndpoint);
    
    // CORS AND REGION-FRIENDLY RPC ENDPOINTS
    // These endpoints work better in regions with IP restrictions and avoid CORS issues 
    const publicEverstakeEndpoint = 'https://solana-mainnet.everstake.one';
    const chainStackEndpoint = 'https://solana-mainnet.chainstacklabs.com';
    const cryptoStakeEndpoint = 'https://api-mainnet.stake2earn.com';
    const shinobi = 'https://api.mainnet-beta.solana.com';
    const heliusEndpoint = 'https://mainnet.helius-rpc.com/?api-key=99b7e94e-9dff-4de3-82ac-567bfbda369c';
    
    console.log('Setting up CORS-friendly RPC connection for balance checks...');
    
    // Check if solanaWeb3 is available
    if (!window.solanaWeb3) {
      console.error('solanaWeb3 is not defined! Library not loaded?');
      throw new Error('Solana Web3 library not loaded');
    }
    
    let connection = null;
    
    // Smaller list of endpoints that are more CORS-friendly and work better internationally
    const endpoints = [
      { url: publicEverstakeEndpoint, name: 'Everstake (CORS-friendly)' },
      { url: chainStackEndpoint, name: 'ChainStack (Asia-friendly)' },
      { url: cryptoStakeEndpoint, name: 'Stake2Earn (Global)' },
      { url: shinobi, name: 'Default (Fallback)' },
      { url: heliusEndpoint, name: 'Helius (if available)' }
    ];
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying ${endpoint.name} RPC for balance check...`);
        
        connection = new solanaWeb3.Connection(endpoint.url, {
          commitment: 'confirmed',
          // Disable WebSocket for browser compatibility
          wsEndpoint: null,
          disableRetryOnRateLimit: false,
          confirmTransactionInitialTimeout: 90000
        });
        
        // Test the connection with a timeout
        const blockHashPromise = connection.getLatestBlockhash('confirmed');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );
        
        await Promise.race([blockHashPromise, timeoutPromise]);
        console.log(`✅ Connected to ${endpoint.name} RPC successfully for balance check`);
        break;
      } catch (error) {
        console.warn(`Failed to connect to ${endpoint.name}:`, error.message);
        
        // If this is the last endpoint, continue with the last attempt anyway
        if (endpoint === endpoints[endpoints.length - 1]) {
          console.log('All endpoints failed, using last endpoint anyway and hoping for the best');
          connection = new solanaWeb3.Connection(endpoint.url, {
            commitment: 'confirmed',
            wsEndpoint: null,
            disableRetryOnRateLimit: true
          });
        }
      }
    }
      
    // Final connection test
    try {
      console.log('Performing final connection test...');
      const blockHashResult = await connection.getLatestBlockhash();
      console.log('✅ Successfully established RPC connection. Blockhash result:', blockHashResult);
    } catch (finalError) {
      console.error('⚠️ Final connection test failed but continuing anyway:', finalError.message);
      // Continue anyway - we'll try to make the best of what we have
    }
    
    // Print network status
    console.log('Network status - Navigator online:', navigator.onLine);
    
    // Get token balance
    try {
      console.log('Creating PublicKey from wallet address:', walletAddress);
      const walletPubkey = new solanaWeb3.PublicKey(walletAddress);
      console.log('Wallet pubkey created:', walletPubkey.toString());
      
      console.log('Creating PublicKey from token address:', tokenAddress);
      const tokenMint = new solanaWeb3.PublicKey(tokenAddress);
      console.log('Token mint pubkey created:', tokenMint.toString());
      
      // Get balance immediately
      console.log('Calling getParsedTokenAccountsByOwner...');
      // Don't use console.time at all - it can cause issues in some browsers
      const startTime = performance.now();
      const accounts = await connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { mint: tokenMint }
      );
      const endTime = performance.now();
      console.log(`getParsedTokenAccountsByOwner completed in ${Math.round(endTime - startTime)}ms`);
      
      console.log('Token accounts response:', accounts);
      console.log('Number of accounts found:', accounts.value.length);
      
      let balance = 0;
      if (accounts.value.length > 0) {
        try {
          console.log('First account data:', accounts.value[0]);
          const accountData = accounts.value[0].account.data.parsed.info.tokenAmount;
          console.log('Account token amount data:', accountData);
          balance = accountData.uiAmount;
        } catch (dataError) {
          console.error('Error parsing account data:', dataError);
          console.log('Raw account data:', accounts.value[0]);
        }
      } else {
        console.log('No token accounts found for this wallet');
      }
      
      console.log('💰 Balance:', balance);
      
      // Store balance in localStorage as a backup
      localStorage.setItem('simpTokenBalance', balance.toString());
      console.log('Saved balance to localStorage:', balance);
      
      // UPDATE THE DISPLAY DIRECTLY
      const balanceElement = document.getElementById('balanceAmount');
      if (balanceElement) {
        balanceElement.textContent = balance.toLocaleString();
        console.log('✅ Display updated to:', balance);
      } else {
        console.log('balanceAmount element not found in DOM');
      }
      
      // Also update anywhere else that shows balance
      const matchingElements = document.querySelectorAll('#simp-balance, .token-balance-amount, .balance-display');
      console.log(`Found ${matchingElements.length} other balance display elements`);
      matchingElements.forEach((el, index) => {
        if (el) {
          el.textContent = balance.toLocaleString();
          console.log(`Updated element ${index+1} with balance:`, el);
        }
      });
    } catch (balanceError) {
      console.error('Error getting token balance:', balanceError);
      throw balanceError;
    }
  } catch (error) {
    console.error('Balance update failed:', error);
    
    // Try to use cached balance
    const cachedBalance = localStorage.getItem('simpTokenBalance');
    console.log('Trying to use cached balance:', cachedBalance);
    
    // Show error to user
    const balanceElement = document.getElementById('balanceAmount');
    if (balanceElement) {
      if (cachedBalance) {
        balanceElement.textContent = parseFloat(cachedBalance).toLocaleString();
        console.log('Using cached balance for display:', cachedBalance);
      } else {
        balanceElement.textContent = 'Error';
      }
      balanceElement.title = 'Failed to fetch balance. Check console for details.';
    }
  }
}

// Add click handler for wallet address to disconnect
function addWalletClickHandler() {
  const walletDisplay = document.getElementById('walletDisplay');
  const walletInfo = document.getElementById('walletInfo');
  
  if (walletInfo) {
    walletInfo.style.cursor = 'pointer';
    walletInfo.addEventListener('click', async () => {
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        console.log('Disconnecting wallet...');
        
        // Show disconnecting feedback
        if (walletDisplay) {
          walletDisplay.textContent = 'Disconnecting...';
        }
        
        // Clear localStorage
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletAuthenticated');
        localStorage.removeItem('simpTokenBalance');
        
        // Update display
        if (walletDisplay) {
          walletDisplay.textContent = 'Not connected';
        }
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
          balanceElement.textContent = '0';
        }
        
        // Clear title attribute
        walletInfo.removeAttribute('title');
        
        // Disconnect using multi-wallet adapter
        if (window.multiWalletAdapter) {
          try {
            await window.multiWalletAdapter.disconnect();
          } catch (err) {
            console.error('Error disconnecting wallet:', err);
          }
        }
        
        // Dispatch disconnect event
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
        
        // Redirect to landing page
        window.location.href = '/';
      }
    });
  }
}

// Update balance when page loads
document.addEventListener('DOMContentLoaded', () => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (!walletAddress) {
    // Make sure wallet display shows disconnected on page load
    const walletDisplay = document.getElementById('walletDisplay');
    if (walletDisplay) {
      walletDisplay.textContent = 'Not connected';
    }
  }
  
  // Add click handler
  addWalletClickHandler();
  
  updateSimpBalance(); // Update immediately, no delay
});

// Update balance when wallet connects
window.addEventListener('walletConnected', () => {
  updateSimpBalance(); // Update immediately, no delay
});

// Handle wallet disconnection
window.addEventListener('walletDisconnected', () => {
  console.log('Wallet disconnected event received');
  const walletDisplay = document.getElementById('walletDisplay');
  if (walletDisplay) {
    walletDisplay.textContent = 'Not connected';
  }
  const balanceElement = document.getElementById('balanceAmount');
  if (balanceElement) {
    balanceElement.textContent = '0';
  }
});

// Update balance less frequently (15 seconds) to avoid conflicts with minting operations
// This is especially important for international users with higher latency
setInterval(updateSimpBalance, 15000);

// Function to diagnose wallet connection issues
async function diagnoseWalletConnection() {
  console.log('%c 🔍 DIAGNOSING WALLET CONNECTION', 'background: #000; color: #0f0; font-size: 16px; font-weight: bold;');
  
  // Check localStorage values
  const storedAddress = localStorage.getItem('walletAddress');
  const authenticated = localStorage.getItem('walletAuthenticated');
  const storedBalance = localStorage.getItem('simpTokenBalance');
  console.log('localStorage walletAddress:', storedAddress);
  console.log('localStorage walletAuthenticated:', authenticated);
  console.log('localStorage simpTokenBalance:', storedBalance);
  
  // Check for multi-wallet adapter (without using its methods)
  if (window.multiWalletAdapter) {
    console.log('Multi-wallet adapter found (but not accessing its methods)');
  } else {
    console.log('Multi-wallet adapter not found');
  }
  
  // Check single wallet connection (legacy)
  const walletConn = window.walletConnection;
  if (walletConn) {
    console.log('Legacy wallet connection found');
    console.log('Legacy wallet isConnected():', walletConn.isConnected());
    console.log('Legacy wallet pubkey:', walletConn.getPublicKey() ? walletConn.getPublicKey().toString() : 'null');
    
    // Check if legacy pubkey matches localStorage
    const legacyPubkey = walletConn.getPublicKey();
    if (legacyPubkey && storedAddress) {
      const matches = legacyPubkey.toString() === storedAddress;
      console.log('Legacy pubkey matches localStorage address:', matches);
      
      if (!matches) {
        console.warn('WARNING: Legacy wallet pubkey does not match the one in localStorage!');
      }
    }
  } else {
    console.log('Legacy wallet connection not found');
  }
  
  // Check for solana provider in window
  if (window.solana) {
    console.log('window.solana found:');
    console.log('- isPhantom:', window.solana.isPhantom);
    console.log('- isConnected:', window.solana.isConnected);
    console.log('- publicKey:', window.solana.publicKey ? window.solana.publicKey.toString() : 'null');
    
    // Check if window.solana pubkey matches localStorage
    if (window.solana.publicKey && storedAddress) {
      const matches = window.solana.publicKey.toString() === storedAddress;
      console.log('window.solana pubkey matches localStorage address:', matches);
      
      if (!matches) {
        console.warn('WARNING: window.solana pubkey does not match the one in localStorage!');
      }
    }
  } else {
    console.log('window.solana not found');
  }
  
  // Check for specific wallet providers
  const providers = [
    { name: 'Phantom', check: () => window.phantom?.solana },
    { name: 'Solflare', check: () => window.solflare },
    { name: 'Backpack', check: () => window.backpack },
    { name: 'Brave', check: () => window.braveSolana },
    { name: 'Coin98', check: () => window.coin98?.sol || window.coin98 },
    { name: 'Bitget', check: () => window.bitkeep?.solana },
    { name: 'Trust', check: () => window.trustwallet?.solana }
  ];
  
  providers.forEach(provider => {
    const instance = provider.check();
    console.log(`${provider.name} provider:`, instance ? 'Found' : 'Not found');
    if (instance) {
      console.log(`- ${provider.name} isConnected:`, instance.isConnected);
      console.log(`- ${provider.name} publicKey:`, instance.publicKey ? instance.publicKey.toString() : 'null');
      
      // Check if this provider's pubkey matches localStorage
      if (instance.publicKey && storedAddress) {
        const matches = instance.publicKey.toString() === storedAddress;
        console.log(`- ${provider.name} pubkey matches localStorage:`, matches);
      }
    }
  });
  
  // Check RPC connection
  try {
    await testRpcConnection();
  } catch (error) {
    console.error('RPC connection test failed:', error);
  }
  
  console.log('%c 🔍 WALLET CONNECTION DIAGNOSIS COMPLETE', 'background: #000; color: #0f0; font-size: 16px; font-weight: bold;');
}

// Function to test RPC connection
async function testRpcConnection() {
  console.log('%c TESTING RPC CONNECTION', 'background: #222; color: yellow; font-size: 14px;');
  
  try {
    // Get config
    const config = await getBurnConfig();
    const rpcEndpoint = config.rpcEndpoint;
    console.log('Using RPC endpoint:', rpcEndpoint);
    
    // Create test connection
    const connection = new solanaWeb3.Connection(rpcEndpoint, {
      commitment: 'confirmed',
      // Disable WebSocket for browser compatibility
      wsEndpoint: null,
      disableRetryOnRateLimit: false,
      confirmTransactionInitialTimeout: 90000
    });
    
    console.log('Testing getLatestBlockhash...');
    console.time('getLatestBlockhash');
    const blockhash = await connection.getLatestBlockhash();
    console.timeEnd('getLatestBlockhash');
    console.log('Blockhash result:', blockhash);
    
    console.log('Testing getSlot...');
    console.time('getSlot');
    const slot = await connection.getSlot();
    console.timeEnd('getSlot');
    console.log('Current slot:', slot);
    
    // Test health
    console.log('Testing health...');
    console.time('health');
    const health = await fetch(`${rpcEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth'
      })
    }).then(res => res.json());
    console.timeEnd('health');
    console.log('Health result:', health);
    
    // Test network status
    try {
      console.log('Testing network status...');
      console.time('networkStatus');
      const response = await fetch(`${rpcEndpoint.replace('/rpc', '')}/status`, {
        method: 'GET'
      });
      const status = response.ok ? await response.json() : `Error: ${response.status}`;
      console.timeEnd('networkStatus');
      console.log('Network status:', status);
    } catch (statusError) {
      console.log('Network status check failed:', statusError);
    }
    
    console.log('%c ✅ RPC CONNECTION TESTS PASSED', 'background: #222; color: lime; font-size: 14px;');
    return true;
    
  } catch (error) {
    console.error('%c ❌ RPC CONNECTION TESTS FAILED', 'background: #222; color: red; font-size: 14px;', error);
    throw error;
  }
}

// Add burn event listeners to prevent double signatures
window.addEventListener('burnInProgress', (event) => {
  // Skip balance updates during burns
  window._burnInProgress = true;
  
  // Set a timeout to ensure the flag gets reset eventually, even if the burn fails
  setTimeout(() => {
    window._burnInProgress = false;
  }, 30000); // 30 second timeout
});

window.addEventListener('burnComplete', () => {
  window._burnInProgress = false;
  // Force an immediate balance update
  updateSimpBalance();
});

// Make functions globally available
window.updateSimpBalance = updateSimpBalance;
window.diagnoseWalletConnection = diagnoseWalletConnection;

// WINDOWS COMPATIBILITY FIX: Verify that updateSimpBalance is properly attached to window object
// Some browsers (especially on Windows) have issues with property assignment to window
// This ensures the function is properly attached by testing and reattaching if needed
try {
  if (typeof window.updateSimpBalance !== 'function') {
    console.log('⚠️ window.updateSimpBalance not properly attached - fixing...');
    // Force reassign with Object.defineProperty
    Object.defineProperty(window, 'updateSimpBalance', {
      value: updateSimpBalance,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log('✅ updateSimpBalance reassigned to window object');
  }
} catch (e) {
  console.error('Error fixing window.updateSimpBalance:', e);
}

// Run diagnostic on load
document.addEventListener('DOMContentLoaded', () => {
  // Add click handler to balance display for easier debugging
  const balanceElement = document.getElementById('balanceAmount');
  if (balanceElement) {
    balanceElement.addEventListener('click', function(event) {
      if (event.ctrlKey || event.metaKey) {
        console.log('Manual diagnosis triggered via balance element');
        diagnoseWalletConnection();
        updateSimpBalance();
      }
    });
    balanceElement.title = 'Ctrl+Click to run wallet diagnostics';
  }
  
  // Debug button removed for production
  
  // Check if there's a wallet mismatch immediately on load
  setTimeout(() => {
    // Run a silent check to see if there's a mismatch between localStorage and real wallet
    const walletAddress = localStorage.getItem('walletAddress');
    if (walletAddress) {
      // Check if any wallet has a different address than localStorage
      let mismatchFound = false;
      
      // Check standard window.solana
      if (window.solana && window.solana.publicKey) {
        const pubkey = window.solana.publicKey.toString();
        if (pubkey !== walletAddress) {
          mismatchFound = true;
          console.warn('WARNING: Wallet address mismatch detected with window.solana!', {
            localStorage: walletAddress,
            solana: pubkey
          });
        }
      }
      
      // If mismatch found, show warning in console with instructions
      if (mismatchFound) {
        console.warn('%c WALLET MISMATCH DETECTED', 'background: red; color: white; font-size: 16px; padding: 5px;');
        console.warn('Try disconnecting your wallet and reconnecting to fix balance issues.');
        console.warn('Run diagnoseWalletConnection() for more details.');
      }
    }
  }, 2000); // Delay check to ensure wallets are fully loaded
});