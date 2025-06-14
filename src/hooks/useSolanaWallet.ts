// src/hooks/useSolanaWallet.ts
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for Solana wallet integration.
 * This hook seamlessly integrates with the main site's wallet connection system
 * and provides fallback options when needed.
 */
export const useSolanaWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  // Function to directly check token balance
  const checkTokenBalance = useCallback(async (tokenAddress: string, walletAddress: string) => {
    try {
      console.log(`Directly checking token balance for ${walletAddress}`);
      console.log(`Token address: ${tokenAddress}`);
      
      if (!(window as any).solanaWeb3) {
        console.error('solanaWeb3 is not available');
        return null;
      }
      
      // Use Helius RPC for reliable connection
      const connection = new (window as any).solanaWeb3.Connection(
        'https://mainnet.helius-rpc.com/?api-key=99b7e94e-9dff-4de3-82ac-567bfbda369c',
        { commitment: 'confirmed' }
      );
      
      const walletPubkey = new (window as any).solanaWeb3.PublicKey(walletAddress);
      const tokenMint = new (window as any).solanaWeb3.PublicKey(tokenAddress);
      
      const accounts = await connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { mint: tokenMint }
      );
      
      console.log(`Found ${accounts.value.length} token accounts`);
      
      if (accounts.value.length > 0) {
        const accountData = accounts.value[0].account.data.parsed.info.tokenAmount;
        const balance = accountData.uiAmount;
        console.log(`Token balance: ${balance}`);
        
        // Update state and localStorage
        setBalance(balance);
        localStorage.setItem('simpTokenBalance', balance.toString());
        
        return balance;
      } else {
        console.log('No token accounts found (balance is 0)');
        setBalance(0);
        localStorage.setItem('simpTokenBalance', '0');
        return 0;
      }
    } catch (error) {
      console.error('Error checking token balance:', error);
      return null;
    }
  }, []);
  
  // Function to get token config and check balance
  const fetchTokenBalance = useCallback(async () => {
    try {
      if (!address) {
        console.log('No wallet address to check balance for');
        return;
      }
      
      console.log('Fetching token config...');
      
      // Get token config
      const response = await fetch('/api/burn-config');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const config = await response.json();
      console.log('Token config:', config);
      
      if (config.tokenAddress) {
        // Check balance with the token address
        await checkTokenBalance(config.tokenAddress, address);
      } else {
        console.error('No token address in config');
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  }, [address, checkTokenBalance]);

  // On mount, check for existing wallet connection
  useEffect(() => {
    // Check localStorage for existing connection
    const checkExistingConnection = () => {
      const storedAddress = localStorage.getItem('walletAddress');
      const isAuthenticated = localStorage.getItem('walletAuthenticated') === 'true';
      const storedBalance = parseFloat(localStorage.getItem('simpTokenBalance') || '0');
      
      if (storedAddress && isAuthenticated) {
        setAddress(storedAddress);
        setConnected(true);
        setBalance(storedBalance);
        
        // Log wallet connection status
        console.log('Restoring wallet connection from localStorage:', {
          address: storedAddress,
          balance: storedBalance
        });
      }
    };

    checkExistingConnection();

    // Listen for wallet connection events
    const handleWalletConnected = (event: any) => {
      const pubKey = event.detail?.publicKey;
      if (pubKey) {
        console.log('Wallet connected event received:', pubKey);
        setAddress(pubKey);
        setConnected(true);
      }
    };

    // Listen for wallet disconnection events
    const handleWalletDisconnected = () => {
      console.log('Wallet disconnected event received');
      setAddress(null);
      setConnected(false);
      setBalance(0);
    };

    // Listen for balance update
    const handleBalanceUpdate = () => {
      const storedBalance = parseFloat(localStorage.getItem('simpTokenBalance') || '0');
      if (storedBalance !== balance) {
        console.log('Balance updated from localStorage:', storedBalance);
        setBalance(storedBalance);
      }
    };

    // Add event listeners
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);
    
    // Poll for balance updates
    const balanceInterval = setInterval(handleBalanceUpdate, 2000);

    // Force a balance update when the component mounts
    setTimeout(() => {
      // Try to use the main site's balance update function first
      if ((window as any).updateSimpBalance) {
        console.log('Triggering main site updateSimpBalance function');
        (window as any).updateSimpBalance();
      } else {
        console.log('Main site updateSimpBalance function not found, using direct check');
        fetchTokenBalance();
      }
      
      // Also use our wallet debug if available
      if ((window as any).walletDebug?.runFullDiagnostics) {
        console.log('Running wallet diagnostics');
        (window as any).walletDebug.runFullDiagnostics();
      }
    }, 1000); // Longer delay to ensure scripts are loaded

    // Cleanup
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
      clearInterval(balanceInterval);
    };
  }, [balance]);

  // Connect to wallet
  const connect = useCallback(async (providerId: string) => {
    try {
      setConnecting(true);
      setError(null);
      
      // Try to use the main website's wallet connection logic first
      if ((window as any).multiWalletAdapter) {
        // We handle this in the button click handler
        console.log('Using main site wallet connection');
        return { success: true };
      }
      
      // Fallback to direct Phantom connection
      if ((window as any).solana?.isPhantom) {
        // We handle this in the button click handler
        console.log('Using direct Phantom connection');
        return { success: true };
      }
      
      // Last resort, create a mock connection
      console.log('Using mock wallet connection');
      
      // Generate a SIMP-prefixed mock address
      const simpAddress = generateSimpAddress();
      
      // Store connection info in localStorage for compatibility with main site
      localStorage.setItem('walletAddress', simpAddress);
      localStorage.setItem('walletAuthenticated', 'true');
      localStorage.setItem('simpTokenBalance', '1000'); // Mock balance
      
      // Update state
      setAddress(simpAddress);
      setConnected(true);
      setBalance(1000);
      
      // Dispatch connection event for compatibility
      window.dispatchEvent(new CustomEvent('walletConnected', { 
        detail: { publicKey: simpAddress }
      }));
      
      // Trigger balance update using the main site's function if available
      if ((window as any).updateSimpBalance) {
        (window as any).updateSimpBalance();
      }
      
      return { success: true, address: simpAddress };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      console.log('Disconnecting wallet...');
      
      // Try to use the main site's wallet disconnection logic
      if ((window as any).multiWalletAdapter) {
        console.log('Using multiWalletAdapter for disconnection');
        await (window as any).multiWalletAdapter.disconnect();
      } else if ((window as any).walletConnection) {
        console.log('Using walletConnection for disconnection');
        await (window as any).walletConnection.disconnect();
      } else if ((window as any).solana?.isConnected) {
        console.log('Using direct Solana connection for disconnection');
        await (window as any).solana.disconnect();
      }
      
      // Clear localStorage
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletAuthenticated');
      localStorage.removeItem('simpTokenBalance');
      
      // Update state
      setAddress(null);
      setConnected(false);
      setBalance(0);
      
      // Dispatch disconnection event
      window.dispatchEvent(new CustomEvent('walletDisconnected'));
      
      console.log('Wallet disconnected successfully');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to disconnect wallet';
      setError(errorMessage);
      console.error('Wallet disconnection error:', err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Generates a mock Solana address with SIMP prefix
  const generateSimpAddress = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';
    
    // Generate a random string for the rest of the address
    for (let i = 0; i < 40; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return `SIMP${randomPart}`;
  };

  return {
    address,
    connected,
    connecting,
    balance,
    error,
    connect,
    disconnect,
    checkTokenBalance,
    fetchTokenBalance
  };
};

export default useSolanaWallet;