// src/components/SolanaWallet/ConnectWallet.tsx
import React, { useState, useEffect } from 'react';
import { useSolanaWallet } from '../../hooks/useSolanaWallet';

const ConnectWallet: React.FC = () => {
  const { connect } = useSolanaWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [windowSolana, setWindowSolana] = useState<any>(null);

  // Check if window.solana exists on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSolana((window as any).solana);
    }
  }, []);

  const handleConnectClick = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);

      // First, check if we have the real wallet adapter
      if ((window as any).multiWalletAdapter) {
        console.log('Using multiWalletAdapter for connection');
        try {
          await (window as any).multiWalletAdapter.showWalletSelector();
          const pubKey = (window as any).multiWalletAdapter.getPublicKey()?.toString();
          
          if (pubKey) {
            localStorage.setItem('walletAddress', pubKey);
            localStorage.setItem('walletAuthenticated', 'true');
            window.dispatchEvent(new CustomEvent('walletConnected', { 
              detail: { publicKey: pubKey }
            }));
            connect('phantom');
          }
        } catch (error) {
          console.error('Wallet selection failed:', error);
        }
      } 
      // Fallback to direct Phantom connection if available
      else if (windowSolana?.isPhantom) {
        console.log('Using direct Phantom connection');
        try {
          const resp = await windowSolana.connect();
          const pubKey = resp.publicKey.toString();
          
          localStorage.setItem('walletAddress', pubKey);
          localStorage.setItem('walletAuthenticated', 'true');
          window.dispatchEvent(new CustomEvent('walletConnected', { 
            detail: { publicKey: pubKey }
          }));
          connect('phantom');
        } catch (error) {
          console.error('Phantom connection failed:', error);
        }
      } 
      // Last resort, use our mock implementation
      else {
        console.log('Using mock wallet connection');
        connect('phantom');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Styling exactly matches the main site's purple wallet button
  return (
    <button
      onClick={handleConnectClick}
      disabled={isConnecting}
      style={{
        backgroundColor: 'var(--wallet-purple, #9370DB)',
        color: 'white',
        padding: '0 12px',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        border: '2px solid #000',
        borderRadius: '8px',
        boxShadow: '2px 2px 0 #000',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: isConnecting ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isConnecting) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '4px 4px 0 #000';
        }
      }}
      onMouseLeave={(e) => {
        if (!isConnecting) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '2px 2px 0 #000';
        }
      }}
    >
      {isConnecting ? 'Connecting...' : 'CONNECT WALLET'}
    </button>
  );
};

export default ConnectWallet;