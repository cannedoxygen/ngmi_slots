/**
 * Wallet Connection Module
 * Handles all Phantom wallet connection functionality
 */

class WalletConnection {
  constructor() {
    this.provider = null;
    this.publicKey = null;
    this.isConnecting = false;
  }

  /**
   * Initialize the wallet connection module
   */
  async initialize() {
    console.log('🔗 Initializing wallet connection module');
    
    // Try to detect Phantom provider
    this.detectProvider();
    
    // Check if already connected from previous session
    if (this.isStoredConnection()) {
      await this.restoreConnection();
    }
    
    return this;
  }

  /**
   * Detect Phantom wallet provider
   */
  detectProvider() {
    if ("solana" in window) {
      this.provider = window.solana;
      if (this.provider.isPhantom) {
        console.log("✅ Phantom wallet detected");
        // Don't try to reassign window.solana - it's already there
        return true;
      }
    }
    
    console.warn("❌ Phantom wallet not found");
    return false;
  }

  /**
   * Connect to Phantom wallet
   */
  async connect() {
    if (this.isConnecting) return;
    
    try {
      this.isConnecting = true;
      
      // Ensure provider is available
      if (!this.provider && !this.detectProvider()) {
        throw new Error("Phantom wallet not found");
      }
      
      console.log("🔌 Connecting to Phantom wallet...");
      
      // Request connection
      const resp = await this.provider.connect();
      this.publicKey = resp.publicKey;
      
      // Store connection info
      localStorage.setItem('walletAddress', this.publicKey.toString());
      localStorage.setItem('walletAuthenticated', 'true');
      
      console.log('✅ Connected:', this.publicKey.toString());
      
      // Emit connection event
      window.dispatchEvent(new CustomEvent('walletConnected', { 
        detail: { publicKey: this.publicKey.toString() }
      }));
      
      return this.publicKey.toString();
      
    } catch (error) {
      console.error('❌ Connection failed:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    try {
      if (this.provider) {
        await this.provider.disconnect();
      }
      
      // Clear stored data
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletAuthenticated');
      localStorage.removeItem('walletBalance');
      localStorage.removeItem('simpTokenBalance');
      localStorage.removeItem('realTokenBalance');  // Remove the cached balance!
      
      this.publicKey = null;
      
      console.log('🔌 Disconnected');
      
      // Emit disconnection event
      window.dispatchEvent(new CustomEvent('walletDisconnected'));
      
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return this.provider?.isConnected && this.publicKey !== null;
  }

  /**
   * Check if there's a stored connection
   */
  isStoredConnection() {
    const address = localStorage.getItem('walletAddress');
    const authenticated = localStorage.getItem('walletAuthenticated');
    return address && authenticated === 'true';
  }

  /**
   * Restore connection from storage
   */
  async restoreConnection() {
    const address = localStorage.getItem('walletAddress');
    
    if (!address) return false;
    
    try {
      // Detect provider if not already done
      if (!this.provider) {
        this.detectProvider();
      }
      
      // If provider is available and connected, restore the public key
      if (this.provider && this.provider.isConnected) {
        this.publicKey = this.provider.publicKey;
        console.log('✅ Connection restored:', address);
        return true;
      }
      
      // Try to reconnect
      await this.connect();
      return true;
      
    } catch (error) {
      console.error('Failed to restore connection:', error);
      return false;
    }
  }

  /**
   * Get the current provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Get the current public key
   */
  getPublicKey() {
    return this.publicKey;
  }

  /**
   * Sign a transaction
   */
  async signTransaction(transaction) {
    if (!this.provider || !this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    console.log('🖊️ Signing transaction...');
    return await this.provider.signTransaction(transaction);
  }

  /**
   * Sign a message
   */
  async signMessage(message) {
    if (!this.provider || !this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    const encodedMessage = new TextEncoder().encode(message);
    return await this.provider.signMessage(encodedMessage);
  }
}

// Export singleton instance
const walletConnection = new WalletConnection();
window.walletConnection = walletConnection;

// Export is not needed - using window reference