/**
 * Wallet Debug Script
 * 
 * This script helps diagnose issues with wallet connection
 * and token balance retrieval.
 */

(function() {
  console.log('🔍 Wallet Debug: Initializing');
  
  // Function to check burn config
  async function checkBurnConfig() {
    try {
      console.log('🔍 Fetching burn config...');
      const response = await fetch('/api/burn-config');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const config = await response.json();
      console.log('📋 Burn config received:', config);
      
      return config;
    } catch (error) {
      console.error('❌ Failed to fetch burn config:', error);
      return null;
    }
  }
  
  // Function to check wallet connection
  function checkWalletConnection() {
    const walletAddress = localStorage.getItem('walletAddress');
    const isAuthenticated = localStorage.getItem('walletAuthenticated') === 'true';
    const balance = localStorage.getItem('simpTokenBalance');
    
    console.log('🔍 Wallet Connection Status:');
    console.log(`- Address: ${walletAddress || 'Not connected'}`);
    console.log(`- Authenticated: ${isAuthenticated}`);
    console.log(`- Cached Balance: ${balance || '0'}`);
    
    if (window.multiWalletAdapter) {
      console.log('- MultiWalletAdapter available: Yes');
      console.log(`- MultiWalletAdapter connected: ${window.multiWalletAdapter.isConnected()}`);
      const pubKey = window.multiWalletAdapter.getPublicKey();
      console.log(`- MultiWalletAdapter public key: ${pubKey ? pubKey.toString() : 'null'}`);
    } else {
      console.log('- MultiWalletAdapter available: No');
    }
    
    if (window.walletConnection) {
      console.log('- WalletConnection available: Yes');
      console.log(`- WalletConnection connected: ${window.walletConnection.isConnected()}`);
      const pubKey = window.walletConnection.getPublicKey();
      console.log(`- WalletConnection public key: ${pubKey ? pubKey.toString() : 'null'}`);
    } else {
      console.log('- WalletConnection available: No');
    }
    
    if (window.solana) {
      console.log('- Phantom available: Yes');
      console.log(`- Phantom connected: ${window.solana.isConnected}`);
      console.log(`- Phantom public key: ${window.solana.publicKey ? window.solana.publicKey.toString() : 'null'}`);
    } else {
      console.log('- Phantom available: No');
    }
  }
  
  // Function to manually check token balance
  async function checkTokenBalance(tokenAddress) {
    if (!window.solanaWeb3) {
      console.error('❌ solanaWeb3 is not defined! Library not loaded?');
      return;
    }
    
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.log('❌ No wallet connected');
      return;
    }
    
    try {
      console.log(`🔍 Checking balance for token: ${tokenAddress}`);
      console.log(`🔍 Wallet address: ${walletAddress}`);
      
      // Use Helius endpoint for better reliability
      const connection = new solanaWeb3.Connection(
        'https://mainnet.helius-rpc.com/?api-key=99b7e94e-9dff-4de3-82ac-567bfbda369c',
        { commitment: 'confirmed' }
      );
      
      const walletPubkey = new solanaWeb3.PublicKey(walletAddress);
      const tokenMint = new solanaWeb3.PublicKey(tokenAddress);
      
      console.log('📊 Fetching token accounts...');
      const accounts = await connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { mint: tokenMint }
      );
      
      console.log(`📊 Found ${accounts.value.length} token accounts`);
      
      let balance = 0;
      if (accounts.value.length > 0) {
        const accountData = accounts.value[0].account.data.parsed.info.tokenAmount;
        balance = accountData.uiAmount;
        console.log(`💰 Token balance: ${balance}`);
      } else {
        console.log('💰 No token accounts found (balance is 0)');
      }
      
      return balance;
    } catch (error) {
      console.error('❌ Error checking token balance:', error);
      return null;
    }
  }
  
  // Run diagnostics on page load
  setTimeout(async function() {
    console.log('=== 🔍 WALLET DIAGNOSTICS ===');
    
    // Check wallet connection
    checkWalletConnection();
    
    // Check burn config
    const config = await checkBurnConfig();
    
    // Check token balance if we have a config
    if (config && config.tokenAddress) {
      const balance = await checkTokenBalance(config.tokenAddress);
      console.log(`💰 Final balance: ${balance !== null ? balance : 'Error'}`);
      
      // Update balance in localStorage for testing
      if (balance !== null) {
        console.log('💾 Updating localStorage with balance:', balance);
        localStorage.setItem('simpTokenBalance', balance.toString());
        
        // Update UI directly
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
          balanceElement.textContent = balance.toLocaleString();
          console.log('✅ Updated balanceAmount element');
        }
      }
    }
    
    console.log('=== 🔍 DIAGNOSTICS COMPLETE ===');
  }, 2000);
  
  // Expose diagnostics functions globally
  window.walletDebug = {
    checkWalletConnection,
    checkBurnConfig,
    checkTokenBalance,
    runFullDiagnostics: async function() {
      console.log('=== 🔍 RUNNING FULL DIAGNOSTICS ===');
      checkWalletConnection();
      const config = await checkBurnConfig();
      if (config && config.tokenAddress) {
        await checkTokenBalance(config.tokenAddress);
      }
      console.log('=== 🔍 FULL DIAGNOSTICS COMPLETE ===');
    }
  };
  
  console.log('✅ Wallet Debug: Initialized successfully');
})();