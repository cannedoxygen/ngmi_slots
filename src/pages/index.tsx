// src/pages/index.tsx
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import ConnectWallet from '../components/SolanaWallet/ConnectWallet';
import { useSolanaWallet } from '../hooks/useSolanaWallet';

export default function HomePage() {
  const router = useRouter();
  const { connected } = useSolanaWallet();

  return (
    <Layout>
      <Head>
        <title>SimpCity Casino | D&apos;oh! Jackpot Slots</title>
        <meta name="description" content="Play SimpCity Casino Slots and win $SIMP tokens in this exciting Simpsons-themed blockchain slot game!" />
      </Head>

      <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
        {/* Hero Section - Completely Revamped */}
        <section style={{ 
          margin: '0 auto 30px',
          padding: '0',
          width: '100%',
          position: 'relative'
        }}>
          {/* Starry background specific to hero section */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            zIndex: -1
          }} />
          
          {/* First row: Image and text container side by side */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            gap: '20px',
            position: 'relative',
            maxWidth: '1100px',
            margin: '0 auto 40px'
          }}>
            {/* Left image - business6a */}
            <div style={{ 
              flex: '1 1 45%',
              minWidth: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                borderRadius: '20px',
                padding: '12px',
                background: 'linear-gradient(135deg, #77CCFF, #9370DB)',
                boxShadow: '0 0 25px rgba(147, 112, 219, 0.8), 0 0 15px rgba(119, 204, 255, 0.6)',
                transform: 'rotate(-3deg)',
                border: '4px solid black',
                width: '100%',
                maxWidth: '500px'
              }}>
                <img 
                  src="/images/businesses/business6a.png" 
                  alt="SIMPCITY CASINO FRONT" 
                  style={{ 
                    width: '100%',
                    display: 'block',
                    borderRadius: '8px',
                    border: '3px solid black',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))'
                  }} 
                />
              </div>
            </div>
            
            {/* Right text container - styled like image 2 */}
            <div style={{ 
              flex: '1 1 45%',
              minWidth: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                borderRadius: '20px',
                padding: '12px',
                background: 'linear-gradient(135deg, #9370DB, #77CCFF)',
                boxShadow: '0 0 25px rgba(147, 112, 219, 0.8), 0 0 15px rgba(119, 204, 255, 0.6)',
                transform: 'rotate(3deg)',
                border: '4px solid black',
                width: '100%',
                maxWidth: '500px'
              }}>
                <div style={{
                  width: '100%',
                  display: 'block',
                  borderRadius: '8px',
                  border: '3px solid black',
                  background: '#FED90F',
                  padding: '20px',
                  color: 'black'
                }}>
                  <h1 style={{
                    margin: '0 0 15px',
                    padding: '0',
                    fontSize: '2.5rem',
                    color: '#000',
                    textShadow: '2px 2px 0 rgba(255,255,255,0.6)',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Welcome to SimpCity Casino!
                  </h1>
                  
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 0 15px',
                    color: 'var(--simpsons-red)',
                    textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
                    textAlign: 'center'
                  }}>
                    🎰 PLAY & WIN $SIMP TOKENS! 🎰
                  </p>
                  
                  <p style={{
                    fontSize: '1.2rem',
                    margin: '0 auto',
                    lineHeight: '1.5',
                    textAlign: 'center'
                  }}>
                    Spin the reels in our classic 3x3 slot machine for a chance to win real $SIMP tokens!
                    Match symbols across 5 paylines to claim your prizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Buttons section with a space below */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            flexWrap: 'wrap',
            margin: '0 auto 60px',
            maxWidth: '700px',
            padding: '0 20px'
          }}>
            {connected ? (
              <button
                onClick={() => router.push('/game')}
                style={{
                  backgroundColor: 'var(--simpsons-red)',
                  color: 'white',
                  border: '3px solid #000',
                  fontSize: '1.6rem',
                  padding: '15px 35px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '5px 5px 0 #000',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '5px 5px 0 #000';
                }}
              >
                PLAY NOW!
              </button>
            ) : (
              <ConnectWallet />
            )}
            
            <button
              onClick={() => router.push('/history')}
              style={{
                backgroundColor: 'var(--simpsons-green)',
                color: 'white',
                border: '3px solid #000',
                fontSize: '1.6rem',
                padding: '15px 35px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '5px 5px 0 #000',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '7px 7px 0 #000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #000';
              }}
            >
              GAME HISTORY
            </button>
          </div>
          
          {/* Second row: Slot machine symbols and image 2 side by side (opposite arrangement) */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            gap: '20px',
            position: 'relative',
            maxWidth: '1100px',
            margin: '0 auto 40px'
          }}>
            {/* Left side: Slot Machine Symbols */}
            <div style={{ 
              flex: '1 1 45%',
              minWidth: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'var(--simpsons-blue)',
                borderRadius: '15px',
                border: '4px solid #000',
                boxShadow: '8px 8px 0 rgba(0,0,0,0.7)',
                padding: '20px',
                transform: 'rotate(-3deg)'
              }}>
                <h2 style={{
                  textAlign: 'center',
                  margin: '0 0 20px',
                  fontSize: '2rem',
                  color: 'white',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.5)'
                }}>SLOT SYMBOLS</h2>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  border: '3px solid #000',
                  padding: '15px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  {/* Display 3x3 grid of 9 most important symbols */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { symbol: '🍒', name: 'Cherry' },
                      { symbol: '🍋', name: 'Lemon' },
                      { symbol: '🍊', name: 'Orange' },
                      { symbol: '💰', name: 'Money Bag' },
                      { symbol: '7️⃣', name: 'Lucky 7' },
                      { symbol: '💎', name: 'Diamond' },
                      { symbol: '3️⃣', name: '3X' },
                      { symbol: '5️⃣', name: '5X' },
                      { symbol: '🎰', name: 'Free Spin' }
                    ].map((item, index) => (
                      <div key={index} style={{ 
                        width: '90px', 
                        height: '90px', 
                        backgroundColor: '#f5f5f5',
                        border: '2px solid #000',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        boxShadow: '3px 3px 0 rgba(0,0,0,0.3)'
                      }}>
                        <div style={{ fontSize: '50px' }}>{item.symbol}</div>
                        <div style={{ fontSize: '0.7rem', textAlign: 'center', fontWeight: 'bold' }}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side: Image 2 (business6b) */}
            <div style={{ 
              flex: '1 1 45%',
              minWidth: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                borderRadius: '20px',
                padding: '12px',
                background: 'linear-gradient(135deg, #9370DB, #77CCFF)',
                boxShadow: '0 0 25px rgba(147, 112, 219, 0.8), 0 0 15px rgba(119, 204, 255, 0.6)',
                transform: 'rotate(3deg)',
                border: '4px solid black',
                width: '100%',
                maxWidth: '500px'
              }}>
                <img 
                  src="/images/businesses/business6b.png" 
                  alt="SIMPCITY CASINO INTERIOR" 
                  style={{ 
                    width: '100%',
                    display: 'block',
                    borderRadius: '8px',
                    border: '3px solid black',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))'
                  }} 
                />
              </div>
            </div>
          </div>
          
          {/* How to Play */}
          <div style={{
            backgroundColor: 'var(--simpsons-yellow)',
            border: '3px solid #000',
            borderRadius: '15px',
            padding: '30px 20px',
            margin: '0 auto 40px',
            position: 'relative',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.8)',
            maxWidth: '900px',
            color: 'black'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              marginBottom: '20px',
              textShadow: '2px 2px 0 rgba(255,255,255,0.5)'
            }}>
              HOW TO PLAY
            </h2>

            <div style={{
              backgroundColor: 'white',
              border: '3px solid #000',
              borderRadius: '10px',
              padding: '20px',
              color: '#000',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              <ol style={{
                textAlign: 'left',
                padding: '0 20px',
                margin: '10px 0',
                fontSize: '1.1rem',
                lineHeight: '1.8'
              }}>
                <li><strong>Connect Your Wallet</strong> - Link your Solana wallet</li>
                <li><strong>Set Your Bet</strong> - Choose between 5-100 $SIMP tokens</li>
                <li><strong>Spin the Reels</strong> - Click SPIN to start the game</li>
                <li><strong>Win Tokens</strong> - Match symbols on paylines to win</li>
              </ol>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            margin: '30px auto',
            padding: '30px 20px',
            backgroundColor: 'var(--simpsons-red)',
            border: '3px solid #000',
            borderRadius: '15px',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.8)',
            maxWidth: '900px',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
              Ready to Win Big?
            </h2>

            <p style={{ fontSize: '1.2rem', marginBottom: '25px' }}>
              Join thousands of players in SimpCity Casino today!
            </p>

            <button
              onClick={() => router.push('/game')}
              style={{
                backgroundColor: 'var(--simpsons-yellow)',
                color: 'black',
                border: '4px solid #000',
                fontSize: '1.8rem',
                padding: '15px 40px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '5px 5px 0 rgba(0,0,0,0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '7px 7px 0 rgba(0,0,0,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '5px 5px 0 rgba(0,0,0,0.8)';
              }}
            >
              PLAY NOW!
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
}