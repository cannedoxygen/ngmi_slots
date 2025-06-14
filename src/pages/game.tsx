// src/pages/game.tsx
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import SlotMachine from '../components/SlotMachine/SlotMachine';
import { useSolanaWallet } from '../hooks/useSolanaWallet';

const GamePage: React.FC = () => {
  const router = useRouter();
  const { connected } = useSolanaWallet();

  return (
    <>
      <Head>
        <title>Play Now | SimpCity Casino</title>
        <meta name="description" content="Play SimpCity Casino on the Solana blockchain and win SIMP tokens!" />
      </Head>

      <Layout>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '20px',
          fontFamily: 'Comic Sans MS, cursive'
        }}>
          {/* Game Header */}
          <div style={{ 
            marginBottom: '30px', 
            textAlign: 'center'
          }}>
            <img 
              src="/images/businesses/business6b.png" 
              alt="SimpCity Casino" 
              style={{ 
                width: 'auto', 
                maxWidth: '600px', 
                height: 'auto', 
                margin: '0 auto 20px', 
                padding: '0',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))'
              }} 
            />
          </div>
          
          {/* Removed controls row as it's being moved to the SlotMachine component */}
          
          {/* Connection Notice */}
          {!connected && (
            <div style={{
              marginBottom: '30px',
              background: '#FFE8B8',
              border: '3px solid #000',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '4px 4px 0px #000'
            }}>
              <p style={{ 
                color: '#000',
                fontSize: '1.2rem',
                marginBottom: '10px',
                fontFamily: 'Comic Sans MS, cursive'
              }}>Connect your wallet to play with SIMP tokens</p>
              <button 
                onClick={() => router.push('/')}
                style={{
                  background: '#77CCFF',
                  color: '#000',
                  border: '3px solid #000',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontFamily: 'Comic Sans MS, cursive',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px #000',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '5px 5px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #000';
                }}
              >
                Learn More
              </button>
            </div>
          )}
          
          {/* Slot Machine */}
          <SlotMachine />
          
          {/* Game Description */}
          <div style={{
            marginTop: '40px',
            background: '#FED90F',
            border: '4px solid #000',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '4px 4px 0px #000'
          }}>
            <h2 style={{ 
              fontSize: '2rem',
              color: '#000',
              marginBottom: '20px',
              fontFamily: 'Comic Sans MS, cursive',
              borderBottom: '3px solid #000',
              paddingBottom: '10px'
            }}>How to Play</h2>
            <p style={{ 
              color: '#000',
              fontSize: '1.1rem',
              marginBottom: '20px',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              Match 3 identical symbols on any of the 5 paylines to win SIMP tokens! Look out for special symbols for multipliers and free spins!
            </p>
            
            {/* Symbol Showcase */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '30px',
              padding: '20px',
              background: '#fff',
              borderRadius: '10px',
              border: '3px solid #000'
            }}>
              {/* Symbol Rows */}
              <div style={{ width: '100%', marginBottom: '15px' }}>
                <h3 style={{ 
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '15px',
                  color: '#000',
                  fontFamily: 'Comic Sans MS, cursive'
                }}>Game Symbols</h3>
                
                {/* High Tier Symbols */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  marginBottom: '20px',
                  gap: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#2A2A2A',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>7️⃣</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>Lucky 7</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#2A2A2A',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>💯</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>Bar</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#2A2A2A',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>💎</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>Diamond</span>
                  </div>
                </div>
                
                {/* Special Symbols */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#612B89',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>3️⃣</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>3x Multiplier</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#612B89',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>5️⃣</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>5x Multiplier</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#025E1C',
                      borderRadius: '8px',
                      border: '2px solid #000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '40px' }}>🎰</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#000' }}>Free Spin</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ul style={{ 
              listStyle: 'disc',
              paddingLeft: '30px',
              color: '#000',
              fontSize: '1.1rem',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              <li style={{ marginBottom: '10px' }}>Adjust your bet using the controls below the reels</li>
              <li style={{ marginBottom: '10px' }}>Click the SPIN button to start the game</li>
              <li style={{ marginBottom: '10px' }}>Match symbols on paylines to win prizes</li>
              <li style={{ marginBottom: '10px' }}>Look for 3️⃣ and 5️⃣ multipliers to increase your winnings</li>
              <li style={{ marginBottom: '10px' }}>🎰 Free Spin symbols award additional spins</li>
              <li style={{ marginBottom: '10px' }}>Wins are automatically added to your wallet balance</li>
            </ul>
          </div>
        </div>
        
        {/* Modals are now handled in the SlotMachine component */}
      </Layout>
    </>
  );
};

export default GamePage;