/**
 * Multi-Wallet Adapter for Solana
 * Supports multiple wallet providers without React dependencies
 */

class MultiWalletAdapter {
  constructor() {
    // Set proper app config to avoid wallet warnings
    this.appConfig = {
      name: 'SIMPIFICATION', // Your app name
      logo: window.location.origin + '/logo.png', // Your app logo
      url: window.location.origin,
      cluster: 'mainnet-beta', // Using mainnet-beta
      chainId: 101 // Solana mainnet chain ID
    };
    
    this.supportedWallets = {
      'Phantom': {
        name: 'Phantom',
        url: 'https://phantom.app',
        icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/phantom/src/icon.ts',
        adapter: window.phantom?.solana || window.solana,
        checkIsInstalled: () => window.phantom?.solana?.isPhantom || window.solana?.isPhantom,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Solflare': {
        name: 'Solflare',
        url: 'https://solflare.com',
        icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/solflare/src/icon.ts',
        adapter: window.solflare,
        checkIsInstalled: () => !!window.solflare?.isSolflare,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Backpack': {
        name: 'Backpack',
        url: 'https://backpack.app',
        icon: 'https://raw.githubusercontent.com/coral-xyz/backpack/master/assets/backpack.png',
        adapter: window.backpack,
        checkIsInstalled: () => !!window.backpack,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Brave': {
        name: 'Brave Wallet',
        url: 'https://brave.com/wallet',
        icon: 'https://brave.com/static-assets/images/brave-logo.svg',
        adapter: window.braveSolana,
        checkIsInstalled: () => !!window.braveSolana?.isBrave,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Coin98': {
        name: 'Coin98',
        url: 'https://coin98.com',
        icon: 'https://coin98.com/img/logo.svg',
        adapter: window.coin98?.sol || window.coin98,
        checkIsInstalled: () => !!window.coin98,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Bitget': {
        name: 'Bitget Wallet',
        url: 'https://web3.bitget.com',
        icon: 'https://img.bitgetimg.com/multiLang/web/1638179647275.png',
        adapter: window.bitkeep?.solana,
        checkIsInstalled: () => !!window.bitkeep?.solana,
        checkIsConnected: (adapter) => adapter?.isConnected
      },
      'Trust': {
        name: 'Trust Wallet',
        url: 'https://trustwallet.com',
        icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
        adapter: window.trustwallet?.solana,
        checkIsInstalled: () => !!window.trustwallet?.solana,
        checkIsConnected: (adapter) => adapter?.isConnected
      }
    };
    
    this.detectedWallets = [];
    this.selectedWallet = null;
    this.selectedAdapter = null;
  }

  /**
   * Detect all installed wallets
   */
  detectWallets() {
    this.detectedWallets = [];
    
    for (const [key, wallet] of Object.entries(this.supportedWallets)) {
      if (wallet.checkIsInstalled()) {
        console.log(`Detected ${wallet.name} wallet`);
        this.detectedWallets.push({
          key,
          ...wallet
        });
      }
    }
    
    // Special case: if window.solana exists but no specific wallet detected, it might be Phantom
    if (this.detectedWallets.length === 0 && (window.solana || window.phantom?.solana)) {
      console.log('Detected generic Solana wallet (likely Phantom)');
      this.detectedWallets.push({
        key: 'Phantom',
        ...this.supportedWallets.Phantom
      });
    }
    
    console.log(`Found ${this.detectedWallets.length} wallet(s):`, this.detectedWallets.map(w => w.name));
    return this.detectedWallets;
  }

  /**
   * Get a specific wallet by name
   */
  getWallet(walletName) {
    const wallet = this.detectedWallets.find(w => w.name === walletName || w.key === walletName);
    if (!wallet) {
      console.warn(`Wallet ${walletName} not found`);
      return null;
    }
    return wallet;
  }

  /**
   * Select a wallet to use
   */
  selectWallet(walletName) {
    const wallet = this.getWallet(walletName);
    if (!wallet) {
      throw new Error(`Wallet ${walletName} not found`);
    }
    
    this.selectedWallet = wallet;
    this.selectedAdapter = wallet.adapter;
    console.log(`Selected wallet: ${wallet.name}`);
    return wallet;
  }

  /**
   * Auto-select the first available wallet
   */
  autoSelectWallet() {
    // Detect available wallets
    this.detectWallets();
    
    if (this.detectedWallets.length === 0) {
      throw new Error('No Solana wallet found. Please install a Solana wallet extension.');
    }
    
    // Prefer Phantom if available, otherwise use the first detected wallet
    const preferredWallet = this.detectedWallets.find(function(w) { return w.key === 'Phantom' }) || this.detectedWallets[0];
    return this.selectWallet(preferredWallet.key);
  }

  /**
   * Get the current wallet adapter (compatible with existing code)
   */
  getAdapter() {
    if (!this.selectedAdapter) {
      this.autoSelectWallet();
    }
    return this.selectedAdapter;
  }

  /**
   * Connect to the selected wallet
   */
  async connect() {
    const adapter = this.getAdapter();
    
    if (!adapter) {
      throw new Error('No wallet adapter available');
    }
    
    try {
      // Most wallets use the same connect method with the proper app config to prevent warnings
      const connectOptions = {
        onlyIfTrusted: false
      };
      
      // Add app identity information to reduce warnings
      if (adapter.connect.length > 1 || this.selectedWallet.key === 'Phantom') {
        // Create proper connection options with app metadata
        const enhancedOptions = {
          ...connectOptions,
          cluster: this.appConfig.cluster,
          chainId: this.appConfig.chainId,
          app: {
            name: this.appConfig.name,
            url: this.appConfig.url,
            icon: this.appConfig.logo,
            // This is important - identify this as a trusted app
            identity: {
              name: this.appConfig.name,
              uri: this.appConfig.url,
              icon: this.appConfig.logo
            }
          }
        };
        
        console.log(`Connecting to ${this.selectedWallet.name} with enhanced app metadata:`, enhancedOptions);
        const resp = await adapter.connect(enhancedOptions);
        console.log(`Connected to ${this.selectedWallet.name}:`, resp.publicKey.toString());
        return resp;
      }
      
      // Fallback to standard connect
      const resp = await adapter.connect(connectOptions);
      console.log(`Connected to ${this.selectedWallet.name}:`, resp.publicKey.toString());
      return resp;
    } catch (error) {
      console.error(`Failed to connect to ${this.selectedWallet.name}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from the current wallet
   */
  async disconnect() {
    const adapter = this.getAdapter();
    
    if (!adapter) {
      return;
    }
    
    try {
      if (adapter.disconnect) {
        await adapter.disconnect();
      }
      console.log(`Disconnected from ${this.selectedWallet.name}`);
    } catch (error) {
      console.error(`Failed to disconnect from ${this.selectedWallet.name}:`, error);
    }
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    const adapter = this.getAdapter();
    if (!adapter) return false;
    
    return this.selectedWallet.checkIsConnected(adapter);
  }

  /**
   * Get the public key of the connected wallet
   */
  getPublicKey() {
    const adapter = this.getAdapter();
    if (!adapter || !adapter.publicKey) return null;
    
    return adapter.publicKey;
  }

  /**
   * Sign a transaction (compatible with existing code)
   */
  async signTransaction(transaction) {
    const adapter = this.getAdapter();
    
    if (!adapter) {
      throw new Error('No wallet adapter available');
    }
    
    if (!adapter.signTransaction) {
      throw new Error(`${this.selectedWallet.name} does not support signing transactions`);
    }
    
    return await adapter.signTransaction(transaction);
  }

  /**
   * Sign and send a transaction (compatible with existing code)
   */
  async signAndSendTransaction(transaction, options) {
    // ADD DETAILED TRACKING
    console.log('%c [BURN TRACKING] 📝 MultiWalletAdapter.signAndSendTransaction called', 'background: #00f; color: white; font-size: 14px; font-weight: bold');
    console.log('%c [BURN TRACKING] Transaction:', 'background: #00f; color: white;', transaction);
    console.log('%c [BURN TRACKING] Options:', 'background: #00f; color: white;', options);
    console.log('%c [BURN TRACKING] Call stack in signAndSendTransaction:', 'background: #00f; color: white;');
    console.trace();
    console.log('%c [BURN TRACKING] Transaction instructions:', 'background: #00f; color: white;', transaction.instructions ? transaction.instructions.length : 'none');
    console.log('%c [BURN TRACKING] Transaction signatures:', 'background: #00f; color: white;', transaction.signatures ? transaction.signatures.length : 'none');
    
    // Record signature attempt
    const signAttempts = parseInt(localStorage.getItem('signAttempts') || '0') + 1;
    localStorage.setItem('signAttempts', signAttempts.toString());
    console.log(`%c [BURN TRACKING] Signature attempt #${signAttempts}`, 'background: #00f; color: white; font-size: 14px');
    
    // BEGIN DEDUPLICATION - Check for duplicate signature requests
    const txSignature = transaction.signatures && transaction.signatures.length > 0 
        ? transaction.signatures[0].signature?.toString() 
        : null;
    const txInstructions = transaction.instructions ? transaction.instructions.length : 0;
    
    // Create a transaction fingerprint
    const txFingerprint = `${txSignature || 'nosig'}-${txInstructions}-${transaction.recentBlockhash || 'nohash'}`;
    const lastTxFingerprint = localStorage.getItem('lastTxFingerprint');
    const lastTxTime = parseInt(localStorage.getItem('lastTxTime') || '0');
    const now = Date.now();
    
    // If we've seen this exact transaction signature very recently, it may be a duplicate
    if (lastTxFingerprint === txFingerprint && (now - lastTxTime < 30000)) {
        console.log(`%c [BURN TRACKING] 🚨 POTENTIAL DUPLICATE TX FINGERPRINT DETECTED within ${Math.floor((now - lastTxTime)/1000)}s`, 'background: #f00; color: white; font-size: 16px; font-weight: bold');
        // ACTIVELY BLOCK DUPLICATES - prevent double signature by returning the previous transaction ID
        // This is a critical fix for immediate double signature issues
        console.log(`%c [BURN TRACKING] 🛑 BLOCKING DUPLICATE TRANSACTION!`, 'background: #f00; color: white; font-size: 16px; font-weight: bold');
        const lastTxId = localStorage.getItem('lastTxId');
        if (lastTxId) {
            console.log(`%c [BURN TRACKING] Returning cached transaction ID: ${lastTxId}`, 'background: #f00; color: white;');
            return lastTxId;
        }
    }
    
    // Store this transaction fingerprint
    localStorage.setItem('lastTxFingerprint', txFingerprint);
    localStorage.setItem('lastTxTime', now.toString());
    // END DEDUPLICATION
    
    const adapter = this.getAdapter();
    
    if (!adapter) {
      throw new Error('No wallet adapter available');
    }
    
    // IMPORTANT: Create a wrapper object with skipPreflightBlockhashCheck
    // This prevents the adapter from fetching a new blockhash
    const txOptions = {
      ...(options || {}),
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      // This is the key fix - prevents wallet adapters from refetching the blockhash
      // which was causing the double signature issue
      skipPreflightBlockhashCheck: true,
      // Enhanced options to reduce wallet warnings
      // Set cluster identity to avoid malicious site warnings
      cluster: this.appConfig.cluster,
      chainId: this.appConfig.chainId,
      // Add app metadata
      app: {
        name: this.appConfig.name,
        url: this.appConfig.url,
        logo: this.appConfig.logo
      }
    };
    
    console.log("%c [BURN TRACKING] Using enhanced transaction options to prevent warnings and double signatures:", 'background: #00f; color: white;', txOptions);
    
    try {
      // Try signAndSendTransaction first (newer method)
      if (adapter.signAndSendTransaction) {
        console.log("%c [BURN TRACKING] Using adapter.signAndSendTransaction method", 'background: #00f; color: white;');
        const result = await adapter.signAndSendTransaction(transaction, txOptions);
        console.log("%c [BURN TRACKING] signAndSendTransaction succeeded:", 'background: #00f; color: white;', result);
        
        // CRITICAL FIX - Store the transaction ID for duplicate prevention
        localStorage.setItem('lastTxId', result);
        console.log(`%c [BURN TRACKING] Stored transaction ID: ${result}`, 'background: #00f; color: white;');
        
        return result;
      }
      
      // Fallback to sendTransaction
      if (adapter.sendTransaction) {
        console.log("%c [BURN TRACKING] Using adapter.sendTransaction method", 'background: #00f; color: white;');
        const result = await adapter.sendTransaction(transaction, txOptions);
        console.log("%c [BURN TRACKING] sendTransaction succeeded:", 'background: #00f; color: white;', result);
        
        // CRITICAL FIX - Store the transaction ID for duplicate prevention
        localStorage.setItem('lastTxId', result);
        console.log(`%c [BURN TRACKING] Stored transaction ID: ${result}`, 'background: #00f; color: white;');
        
        return result;
      }
      
      throw new Error(`${this.selectedWallet.name} does not support sending transactions`);
    } catch (error) {
      console.error("%c [BURN TRACKING] Transaction signing/sending FAILED:", 'background: #00f; color: white;', error);
      throw error;
    }
  }

  /**
   * Sign multiple transactions
   */
  async signAllTransactions(transactions) {
    const adapter = this.getAdapter();
    
    if (!adapter) {
      throw new Error('No wallet adapter available');
    }
    
    if (!adapter.signAllTransactions) {
      throw new Error(`${this.selectedWallet.name} does not support signing multiple transactions`);
    }
    
    return await adapter.signAllTransactions(transactions);
  }

  /**
   * Sign a message
   */
  async signMessage(message) {
    const adapter = this.getAdapter();
    
    if (!adapter) {
      throw new Error('No wallet adapter available');
    }
    
    if (!adapter.signMessage) {
      throw new Error(`${this.selectedWallet.name} does not support signing messages`);
    }
    
    return await adapter.signMessage(message);
  }

  /**
   * Show wallet selector modal
   */
  async showWalletSelector() {
    // Detect available wallets
    this.detectWallets();
    
    if (this.detectedWallets.length === 0) {
      alert('No Solana wallet detected. Please install Phantom, Solflare, or another Solana wallet.');
      return null;
    }
    
    // If only one wallet is available, select it automatically
    if (this.detectedWallets.length === 1) {
      return this.selectWallet(this.detectedWallets[0].key);
    }
    
    // Create modal for wallet selection with Simpsons theme
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Comic Sans MS', cursive, sans-serif;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: #FED90F;
      border: 5px solid #000;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.5);
      position: relative;
      animation: modalBounceIn 0.5s ease-out;
    `;
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes modalBounceIn {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    modalContent.innerHTML = `
      <h2 style="
        margin-bottom: 30px; 
        text-align: center; 
        font-size: 2.5rem;
        color: #E70013;
        text-shadow: 3px 3px 0 #000;
        font-weight: bold;
        letter-spacing: 2px;
      ">SELECT WALLET</h2>
      <div id="wallet-options"></div>
      <button id="cancel-wallet-selection" style="
        margin-top: 30px;
        width: 100%;
        padding: 15px;
        background-color: #333;
        color: white;
        border: 3px solid #000;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
        transition: all 0.2s;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      ">CANCEL</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add wallet options
    const optionsContainer = modalContent.querySelector('#wallet-options');
    
    for (const wallet of this.detectedWallets) {
      const option = document.createElement('button');
      option.style.cssText = `
        display: flex;
        align-items: center;
        width: 100%;
        padding: 20px;
        margin-bottom: 15px;
        background-color: #FFF;
        border: 4px solid #000;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.3);
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;
      
      option.innerHTML = `
        <div style="margin-left: 15px; text-align: left;">
          <div style="font-weight: bold; font-size: 1.4rem; color: #000;">${wallet.name}</div>
          <div style="font-size: 1rem; color: #666; margin-top: 5px;">Click to connect</div>
        </div>
      `;
      
      option.addEventListener('mouseenter', () => {
        option.style.backgroundColor = '#77CCFF';
        option.style.transform = 'translateY(-2px)';
        option.style.boxShadow = '7px 7px 0 rgba(0, 0, 0, 0.4)';
      });
      
      option.addEventListener('mouseleave', () => {
        option.style.backgroundColor = '#FFF';
        option.style.transform = 'translateY(0)';
        option.style.boxShadow = '5px 5px 0 rgba(0, 0, 0, 0.3)';
      });
      
      option.addEventListener('click', () => {
        modal.remove();
        this.selectWallet(wallet.key);
      });
      
      optionsContainer.appendChild(option);
    }
    
    // Handle cancel with hover effects
    const cancelButton = modalContent.querySelector('#cancel-wallet-selection');
    cancelButton.addEventListener('mouseenter', () => {
      cancelButton.style.backgroundColor = '#E70013';
      cancelButton.style.transform = 'translateY(-2px)';
      cancelButton.style.boxShadow = '5px 5px 0 rgba(0, 0, 0, 0.4)';
    });
    
    cancelButton.addEventListener('mouseleave', () => {
      cancelButton.style.backgroundColor = '#333';
      cancelButton.style.transform = 'translateY(0)';
      cancelButton.style.boxShadow = '3px 3px 0 rgba(0, 0, 0, 0.3)';
    });
    
    cancelButton.addEventListener('click', () => {
      modal.remove();
    });
    
    // Return a promise that resolves when a wallet is selected
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.selectedWallet) {
          clearInterval(checkInterval);
          resolve(this.selectedWallet);
        }
        if (!document.contains(modal)) {
          clearInterval(checkInterval);
          reject(new Error('Wallet selection cancelled'));
        }
      }, 100);
    });
  }
}

// Create global instance
window.multiWalletAdapter = new MultiWalletAdapter();

// Register the app identity with Phantom wallet if available
// This will reduce the warning messages about potentially malicious sites
if (window.phantom?.solana) {
  try {
    console.log('Registering app with Phantom wallet...');
    const adapter = window.multiWalletAdapter;
    window.phantom.solana.on('connect', () => {
      console.log('Connected to Phantom wallet');
    });
    
    // Using additional events to ensure trusted status
    if (window.phantom.solana.isConnected) {
      console.log('Phantom wallet is already connected - sending app metadata...');
      // Try to re-broadcast app metadata for existing connection
      if (typeof window.phantom.solana.setIdentity === 'function') {
        window.phantom.solana.setIdentity({
          name: adapter.appConfig.name,
          uri: adapter.appConfig.url,
          icon: adapter.appConfig.logo,
          isTrusted: true
        });
      }
    }
  } catch (e) {
    console.error('Error registering app with Phantom wallet:', e);
  }
}

console.log('Multi-wallet adapter initialized with enhanced app identity');