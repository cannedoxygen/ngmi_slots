// src/components/SolanaWallet/WalletInfo.tsx
import React, { useEffect } from 'react';
import { useSolanaWallet } from '../../hooks/useSolanaWallet';

const WalletInfo: React.FC = () => {
  const { address, balance, disconnect, fetchTokenBalance } = useSolanaWallet();
  
  // Display a shortened version of the address
  const shortenedAddress = address ? 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
    '';

  // Whether the address starts with SIMP
  const isSimpWallet = address?.startsWith('SIMP');
  
  // Force balance update when component mounts
  useEffect(() => {
    // First try our direct balance fetch
    fetchTokenBalance();
    
    // Then try the main site's function
    if ((window as any).updateSimpBalance) {
      console.log('WalletInfo: Triggering balance update');
      (window as any).updateSimpBalance();
    }
    
    // Also use our bridge if available
    if ((window as any).walletBridge?.triggerBalanceUpdate) {
      console.log('WalletInfo: Using wallet bridge');
      (window as any).walletBridge.triggerBalanceUpdate();
    }
    
    // Also use diagnostics if available
    if ((window as any).walletDebug?.runFullDiagnostics) {
      console.log('WalletInfo: Running diagnostics');
      (window as any).walletDebug.runFullDiagnostics();
    }
    
    // Set up periodic balance checks
    const intervalId = setInterval(() => {
      console.log('WalletInfo: Periodic balance check');
      fetchTokenBalance();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchTokenBalance]);

  return (
    <div id="walletInfo" className="wallet-info" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {/* Balance Display - Matches the exact style from main site */}
      <div id="tokenBalance" className="token-balance" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: '#000',
        padding: '4px 8px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        border: '2px solid #000',
        boxShadow: '2px 2px 0 #000',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '28px'
      }}>
        <span id="balanceAmount" style={{ marginRight: '3px' }}>{balance.toLocaleString()}</span> 
        <span id="tokenCurrency">$SIMP</span>
        {/* Debugging helpers - remove in production */}
        <span style={{ display: 'none' }} id="rawBalance">{balance}</span>
        <span style={{ display: 'none' }} id="localStorageBalance">{localStorage.getItem('simpTokenBalance')}</span>
      </div>
      
      {/* Wallet Address Display - Matches exact style from main site */}
      <div 
        className="wallet-address connected"
        id="walletDisplay"
        onClick={() => disconnect()}
        title="Click to disconnect wallet"
        style={{
          backgroundColor: isSimpWallet ? 'rgba(0, 255, 0, 0.2)' : 'white',
          color: isSimpWallet ? 'var(--wallet-purple, #9370DB)' : '#000',
          border: isSimpWallet ? '1px solid green' : '2px solid #000',
          padding: '4px 8px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          boxShadow: '2px 2px 0 #000',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          height: '28px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {shortenedAddress}
      </div>
    </div>
  );
};

export default WalletInfo;