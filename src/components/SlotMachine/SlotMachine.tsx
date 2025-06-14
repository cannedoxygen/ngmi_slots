// src/components/SlotMachine/SlotMachine.tsx
import React, { useState, useEffect } from 'react';
import Reel from './Reel';
import PaylineDisplay from './PaylineDisplay';
import GameControls from '../UI/GameControls';
import WinDisplay from '../UI/WinDisplay';
import TransactionModal from '../SolanaWallet/TransactionModal';
import useSlotMachine from '../../hooks/useSlotMachine';
import SimpCityCommentator from '../UI/SimpCityCommentator';
import { getMayorComment } from '../../config/mayorComments';
import PaytableModal from '../UI/Modals/PaytableModal';
import SettingsModal from '../UI/Modals/SettingsModal';

const SlotMachine: React.FC = () => {
  const {
    spinning,
    betAmount,
    setBetAmount,
    reels,
    winAmount,
    multiplier,
    activePaylines,
    freeSpinsRemaining,
    spin,
    error,
    paylines,
    transactionId,
    showTransactionModal,
    setShowTransactionModal,
    isWinner,
    canPlay
  } = useSlotMachine();

  const [comment, setComment] = useState<string>('');
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Check if it's the user's first visit to show the paytable automatically
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedGameBefore');
    if (!hasVisitedBefore) {
      const timer = setTimeout(() => {
        setShowPaytable(true);
        localStorage.setItem('hasVisitedGameBefore', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Update comments based on game state
  useEffect(() => {
    if (error) {
      setComment(getMayorComment('error'));
    } else if (isWinner) {
      if (winAmount >= 100) {
        setComment(getMayorComment('bigWin'));
      } else {
        setComment(getMayorComment('win'));
      }
    } else if (!spinning && activePaylines.length === 0 && reels.length > 0) {
      setComment(getMayorComment('lose'));
    } else if (spinning) {
      setComment(getMayorComment('spinning'));
    } else {
      setComment(getMayorComment('idle'));
    }
  }, [spinning, isWinner, winAmount, activePaylines, reels, error]);

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Comic Sans MS, cursive'
    }}>
      {/* Main game layout - using flexbox for better alignment */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Left side - Game controls */}
        <div style={{ flex: '0 0 300px' }}>
          {/* Character Section with Speech Bubble */}
          <div style={{
            background: '#FED90F',
            borderRadius: '12px',
            padding: '20px',
            border: '4px solid #000',
            boxShadow: '4px 4px 0px #000',
            marginBottom: '20px',
            height: '250px'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '15px',
              fontFamily: 'Comic Sans MS, cursive'
            }}>SimpCity Casino</h3>
            <div style={{ height: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SimpCityCommentator 
                comment={comment}
                imagePath="/images/about-image.png"
                isWin={isWinner}
                isBigWin={winAmount >= 100}
              />
            </div>
          </div>
          
          {/* Game Controls Section */}
          <div style={{
            background: '#77CCFF',
            borderRadius: '12px',
            padding: '20px',
            border: '4px solid #000',
            boxShadow: '4px 4px 0px #000',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '15px',
              fontFamily: 'Comic Sans MS, cursive'
            }}>Game Controls</h3>
            
            <div style={{ flex: 1 }}>
              <GameControls 
                onSpin={spin}
                spinning={spinning}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                disabled={!canPlay || spinning}
                freeSpinsActive={freeSpinsRemaining > 0}
              />
            </div>
            
            {/* Free Spins Counter */}
            {freeSpinsRemaining > 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#EB3C3C',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  border: '2px solid #000',
                  fontFamily: 'Comic Sans MS, cursive'
                }}>
                  {freeSpinsRemaining} Free Spin{freeSpinsRemaining !== 1 ? 's' : ''} Remaining
                </span>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#EB3C3C',
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '1rem',
                fontFamily: 'Comic Sans MS, cursive'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Center - Slot Machine */}
        <div style={{
          flex: 1,
          minWidth: '600px',
          background: '#FED90F',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '4px solid #000',
          boxShadow: '4px 4px 0px #000'
        }}>
          {/* Machine Header */}
          <div style={{
            background: 'linear-gradient(135deg, #77CCFF 0%, #A1DEFF 100%)',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #000'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: 'Comic Sans MS, cursive'
            }}>SimpCity Casino</h2>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Win Display moved to header */}
              {isWinner && (
                <div>
                  <span style={{
                    background: '#EB3C3C',
                    color: '#fff',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '2px solid #000',
                    fontFamily: 'Comic Sans MS, cursive'
                  }}>
                    WIN: <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>{winAmount}</span>
                    {multiplier > 1 && (
                      <span style={{
                        marginLeft: '10px',
                        background: '#8B69CD',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontSize: '0.8rem'
                      }}>x{multiplier}</span>
                    )}
                  </span>
                </div>
              )}
              
              {/* Paytable Button */}
              <button 
                onClick={() => setShowPaytable(true)}
                style={{
                  background: '#FED90F',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontFamily: 'Comic Sans MS, cursive',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '2px 2px 0px #000',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #000';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Paytable
              </button>
              
              {/* Settings Button */}
              <button 
                onClick={() => setShowSettings(true)}
                style={{
                  background: '#77CCFF',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontFamily: 'Comic Sans MS, cursive',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '2px 2px 0px #000',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #000';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* Game Area */}
          <div style={{ padding: '20px', position: 'relative', background: '#FED90F' }}>
            {/* Paylines Overlay */}
            <PaylineDisplay 
              activePaylines={activePaylines} 
              paylines={paylines} 
              visible={isWinner && activePaylines.length > 0} 
            />

            {/* Reels Container - Made more compact */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              background: '#fff',
              padding: '15px',
              borderRadius: '8px',
              border: '3px solid #000',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
            }}>
              {reels.map((reelSymbols, reelIndex) => (
                <Reel 
                  key={`reel-${reelIndex}`} 
                  symbols={reelSymbols} 
                  spinning={spinning} 
                  spinDelay={reelIndex * 300} 
                />
              ))}
            </div>

            {/* Full Win Display - Only for big wins */}
            {isWinner && winAmount >= 100 && (
              <WinDisplay 
                winAmount={winAmount} 
                multiplier={multiplier}
                visible={true}
              />
            )}
          </div>
          
          {/* Action Button on mobile */}
          <div style={{ 
            padding: '20px',
            display: 'block'
          }}>
            <button
              onClick={spin}
              disabled={!canPlay || spinning}
              style={{
                width: '100%',
                background: spinning ? '#999' : '#EB3C3C',
                color: '#fff',
                border: '3px solid #000',
                borderRadius: '8px',
                padding: '15px',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: !canPlay || spinning ? 'default' : 'pointer',
                boxShadow: '4px 4px 0px #000',
                transition: 'all 0.2s ease',
                opacity: !canPlay || spinning ? 0.7 : 1
              }}
            >
              {spinning ? 'SPINNING...' : freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transactionId={transactionId}
        action="Spin"
        amount={betAmount}
      />
      
      {/* Paytable Modal */}
      <PaytableModal 
        isOpen={showPaytable}
        onClose={() => setShowPaytable(false)}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default SlotMachine;