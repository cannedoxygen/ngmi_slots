// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ConnectWallet from '../SolanaWallet/ConnectWallet';
import WalletInfo from '../SolanaWallet/WalletInfo';
import { useSolanaWallet } from '../../hooks/useSolanaWallet';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useSolanaWallet();

  // This effect ensures that the global wallet system and the React state stay in sync
  useEffect(() => {
    // Listen for global wallet events
    const handleWalletConnected = () => {
      console.log('Global wallet connected event detected in Header');
    };

    const handleWalletDisconnected = () => {
      console.log('Global wallet disconnected event detected in Header');
    };

    // Add event listeners
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    // Cleanup
    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      backgroundColor: 'var(--simpsons-yellow)',
      position: 'relative',
      zIndex: 2000,
      padding: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      borderBottom: '3px solid #000',
      borderTop: '2px solid #000',
      marginBottom: 0,
      width: '100%',
      overflow: 'visible',
      height: '42px',
      marginTop: '8px'
    }}>
      <div style={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 15px',
        height: '100%',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <img 
              src="/assets/images/symbols/high-tier/simpcity.png" 
              alt="SIMPCITY" 
              style={{
                height: '70px',
                width: 'auto',
                margin: '-12px 0 -20px',
                padding: 0,
                objectFit: 'contain',
                cursor: 'pointer',
                transformOrigin: 'center',
                position: 'relative',
                zIndex: 1999
              }}
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ul style={{
            display: 'flex',
            listStyleType: 'none',
            alignItems: 'center',
            height: '100%',
            margin: 0,
            padding: 0,
            justifyContent: 'center'
          }}>
            <li style={{ margin: '0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <a 
                href="https://simp.wtf/main" 
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  margin: '0 1px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: 'white',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  boxShadow: '2px 2px 0 #000',
                  width: '85px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  height: '28px',
                  lineHeight: '17px'
                }}
              >
                Home
              </a>
            </li>
            <li style={{ margin: '0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Link href="/game" style={{
                textDecoration: 'none',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                padding: '4px 8px',
                margin: '0 1px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: 'white',
                border: '2px solid #000',
                borderRadius: '8px',
                boxShadow: '2px 2px 0 #000',
                width: '85px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                height: '28px',
                lineHeight: '17px'
              }}>
                Play Slots
              </Link>
            </li>
            <li style={{ margin: '0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Link href="/history" style={{
                textDecoration: 'none',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                padding: '4px 8px',
                margin: '0 1px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: 'white',
                border: '2px solid #000',
                borderRadius: '8px',
                boxShadow: '2px 2px 0 #000',
                width: '85px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                height: '28px',
                lineHeight: '17px'
              }}>
                History
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Right Section - Wallet Area */}
        <div className="header-right" style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
          gap: '8px'
        }}>
          {/* Use the WalletInfo or ConnectWallet components */}
          {connected ? (
            <WalletInfo />
          ) : (
            <ConnectWallet />
          )}

          {/* Mobile Menu Toggle */}
          <button 
            style={{
              display: 'none',
              backgroundColor: 'white',
              border: '2px solid #000',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '2px 2px 0 #000',
              height: '32px',
              width: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2003
            }}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '20px',
              height: '14px',
              justifyContent: 'space-between'
            }}>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: isMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                opacity: isMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: isMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
              }}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--simpsons-yellow)',
          borderTop: '3px solid #000',
          borderBottom: '3px solid #000',
          boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
          zIndex: 2000,
          padding: '15px'
        }}>
          <div>
            <Link href="/game" style={{
              display: 'block',
              width: '100%',
              padding: '12px 15px',
              margin: '8px 0',
              backgroundColor: 'white',
              border: '2px solid #000',
              borderRadius: '8px',
              boxShadow: '2px 2px 0 #000',
              textDecoration: 'none',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsMenuOpen(false)}>
              Play Slots
            </Link>

            <Link href="/history" style={{
              display: 'block',
              width: '100%',
              padding: '12px 15px',
              margin: '8px 0',
              backgroundColor: 'white',
              border: '2px solid #000',
              borderRadius: '8px',
              boxShadow: '2px 2px 0 #000',
              textDecoration: 'none',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsMenuOpen(false)}>
              History
            </Link>

            <a 
              href="https://simp.wtf/main" 
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 15px',
                margin: '8px 0',
                backgroundColor: 'white',
                border: '2px solid #000',
                borderRadius: '8px',
                boxShadow: '2px 2px 0 #000',
                textDecoration: 'none',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              >
                Back to Main Site
              </a>
          </div>
        </div>
      )}
      
    </header>
  );
};

export default Header;