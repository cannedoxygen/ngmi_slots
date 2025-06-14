// src/components/UI/GameControls.tsx
import React from 'react';
import { useSolanaWallet } from '../../hooks/useSolanaWallet';
// Balance is now provided by useSolanaWallet

interface GameControlsProps {
  onSpin: () => void;
  spinning: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  disabled: boolean;
  freeSpinsActive?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onSpin,
  spinning,
  betAmount,
  setBetAmount,
  disabled,
  freeSpinsActive = false
}) => {
  const { connected, balance } = useSolanaWallet();
  
  // Force balance update when component mounts
  React.useEffect(() => {
    // Force wallet balance update from main site
    if ((window as any).updateSimpBalance) {
      console.log('GameControls: Triggering main site updateSimpBalance function');
      (window as any).updateSimpBalance();
      
      // Set up periodic updates
      const intervalId = setInterval(() => {
        (window as any).updateSimpBalance();
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, []);
  // Balance is now provided by useSolanaWallet
  
  // Define bet increment values
  const betIncrements = [5, 10, 25, 50, 100];
  
  // Find the next higher bet increment
  const handleIncreaseBet = () => {
    const nextHigherBet = betIncrements.find(increment => increment > betAmount);
    if (nextHigherBet && nextHigherBet <= balance) {
      setBetAmount(nextHigherBet);
    } else if (betAmount < balance) {
      // If there's no standard increment, just set to max balance
      setBetAmount(balance);
    }
  };
  
  // Find the next lower bet increment
  const handleDecreaseBet = () => {
    // Find the highest bet increment that's lower than current bet
    const reversedIncrements = [...betIncrements].reverse();
    const nextLowerBet = reversedIncrements.find(increment => increment < betAmount);
    
    if (nextLowerBet) {
      setBetAmount(nextLowerBet);
    } else if (betAmount > 5) {
      // If no standard decrement, set to minimum (5)
      setBetAmount(5);
    }
  };
  
  // Set to max possible bet
  const handleMaxBet = () => {
    // Find the highest standard increment that's <= balance
    const highestPossibleIncrement = [...betIncrements].reverse()
      .find(increment => increment <= balance);
    
    if (highestPossibleIncrement) {
      setBetAmount(highestPossibleIncrement);
    } else if (balance >= 5) {
      // If balance is at least minimum bet but less than any increment
      setBetAmount(Math.floor(balance / 5) * 5); // Round to nearest 5
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      padding: '20px',
      border: '3px solid #000',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Balance display */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        background: '#FED90F',
        borderRadius: '6px',
        border: '2px solid #000',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          fontFamily: 'Comic Sans MS, cursive'
        }}>Balance:</div>
        <div style={{
          color: '#000',
          fontFamily: 'Comic Sans MS, cursive',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>{balance} SIMP</div>
      </div>
      
      {/* Bet Controls - only show if not in free spins mode */}
      {!freeSpinsActive && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <span style={{
              color: '#000',
              fontSize: '1rem',
              fontWeight: 'bold',
              fontFamily: 'Comic Sans MS, cursive'
            }}>BET AMOUNT:</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <button
              onClick={handleDecreaseBet}
              disabled={spinning || disabled || betAmount <= 5}
              style={{
                background: betAmount <= 5 ? '#ccc' : '#77CCFF',
                color: '#000',
                border: '2px solid #000',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: betAmount <= 5 ? 'default' : 'pointer',
                boxShadow: '2px 2px 0px #000',
                transition: 'all 0.2s ease',
                opacity: spinning || disabled || betAmount <= 5 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (betAmount > 5 && !spinning && !disabled) {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #000';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '2px 2px 0px #000';
              }}
            >
              -
            </button>
            
            <div style={{
              padding: '10px 20px',
              minWidth: '120px',
              textAlign: 'center',
              background: '#FFE8B8',
              borderRadius: '6px',
              border: '2px solid #000'
            }}>
              <span style={{
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1.2rem'
              }}>{betAmount}</span>
              <span style={{
                marginLeft: '5px',
                fontSize: '0.9rem',
                color: '#666',
                fontFamily: 'Comic Sans MS, cursive'
              }}>SIMP</span>
            </div>
            
            <button
              onClick={handleIncreaseBet}
              disabled={spinning || disabled || betAmount >= balance}
              style={{
                background: betAmount >= balance ? '#ccc' : '#77CCFF',
                color: '#000',
                border: '2px solid #000',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: betAmount >= balance ? 'default' : 'pointer',
                boxShadow: '2px 2px 0px #000',
                transition: 'all 0.2s ease',
                opacity: spinning || disabled || betAmount >= balance ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (betAmount < balance && !spinning && !disabled) {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #000';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '2px 2px 0px #000';
              }}
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleMaxBet}
            disabled={spinning || disabled || betAmount >= balance}
            style={{
              width: '100%',
              marginTop: '15px',
              background: betAmount >= balance ? '#ccc' : '#EB3C3C',
              color: '#fff',
              border: '2px solid #000',
              borderRadius: '6px',
              padding: '8px',
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '1rem',
              cursor: betAmount >= balance ? 'default' : 'pointer',
              boxShadow: '2px 2px 0px #000',
              transition: 'all 0.2s ease',
              opacity: spinning || disabled || betAmount >= balance ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (betAmount < balance && !spinning && !disabled) {
                e.currentTarget.style.transform = 'translate(-1px, -1px)';
                e.currentTarget.style.boxShadow = '3px 3px 0px #000';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '2px 2px 0px #000';
            }}
          >
            MAX BET
          </button>
        </div>
      )}
      
      {/* Spacer to push the spin button to the bottom */}
      <div style={{ flexGrow: 1 }}></div>
      
      {/* Spin Button */}
      <div style={{
        display: 'block',
        marginTop: '20px'
      }}>
        <button
          onClick={onSpin}
          disabled={disabled || spinning}
          style={{
            width: '100%',
            padding: '20px',
            background: spinning ? '#999' : '#EB3C3C',
            color: '#fff',
            border: '3px solid #000',
            borderRadius: '8px',
            fontFamily: 'Comic Sans MS, cursive',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: disabled || spinning ? 'default' : 'pointer',
            boxShadow: '4px 4px 0px #000',
            transition: 'all 0.2s ease',
            opacity: disabled || spinning ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!disabled && !spinning) {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px #000';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '3px 3px 0px #000';
          }}
        >
          {spinning ? 'SPINNING...' : freeSpinsActive ? 'FREE SPIN' : 'SPIN'}
        </button>
      </div>
      
      {/* Not connected message */}
      {!connected && (
        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          color: '#FFB800',
          fontSize: '0.9rem',
          fontFamily: 'Comic Sans MS, cursive'
        }}>
          Connect your wallet to play
        </div>
      )}
      
      {/* Insufficient balance message */}
      {connected && balance < betAmount && !freeSpinsActive && (
        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          color: '#EB3C3C',
          fontSize: '0.9rem',
          fontFamily: 'Comic Sans MS, cursive'
        }}>
          Insufficient SIMP balance
        </div>
      )}
    </div>
  );
};

export default GameControls;