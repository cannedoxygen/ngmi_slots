// src/components/UI/GameControls.tsx
import React from 'react';
import Button from '../common/Button';
import { useSuiWallet } from '../../hooks/useSuiWallet';
import { useTokenBalance } from '../../hooks/useTokenBalance';

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
  const { connected } = useSuiWallet();
  const { balance } = useTokenBalance();
  
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
    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex flex-col h-full">
      {/* Balance display */}
      <div className="balance-display mb-6 p-2 bg-gray-800 rounded border border-gray-700 text-center">
        <div className="text-xs text-gray-400">Balance:</div>
        <div className="text-blue-300 font-medium">{balance} TARDI</div>
      </div>
      
      {/* Bet Controls - only show if not in free spins mode */}
      {!freeSpinsActive && (
        <div className="bet-controls space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">BET AMOUNT:</span>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              onClick={handleDecreaseBet}
              disabled={spinning || disabled || betAmount <= 5}
              variant="ghost"
              size="small"
              className="text-lg font-bold h-8 w-8 p-0 flex items-center justify-center"
            >
              -
            </Button>
            
            <div className="bet-amount-display mx-2 px-3 py-1 min-w-[100px] text-center bg-gray-800 rounded border border-gray-700">
              <span className="font-medium text-blue-300">{betAmount}</span>
              <span className="ml-1 text-xs text-gray-400">TARDI</span>
            </div>
            
            <Button
              onClick={handleIncreaseBet}
              disabled={spinning || disabled || betAmount >= balance}
              variant="ghost"
              size="small"
              className="text-lg font-bold h-8 w-8 p-0 flex items-center justify-center"
            >
              +
            </Button>
          </div>
          
          <Button
            onClick={handleMaxBet}
            disabled={spinning || disabled || betAmount >= balance}
            variant="outline"
            size="small"
            className="w-full"
          >
            MAX BET
          </Button>
        </div>
      )}
      
      {/* Spacer to push the spin button to the bottom */}
      <div className="flex-grow"></div>
      
      {/* Spin Button - Hidden on mobile as it's moved to bottom of slot machine */}
      <div className="hidden lg:block mt-4">
        <Button
          onClick={onSpin}
          disabled={disabled || spinning}
          isLoading={spinning}
          variant="primary"
          size="large"
          className="spin-button w-full py-4 text-lg"
        >
          {spinning ? 'SPINNING...' : freeSpinsActive ? 'FREE SPIN' : 'SPIN'}
        </Button>
      </div>
      
      {/* Not connected message */}
      {!connected && (
        <div className="mt-3 text-center text-yellow-400 text-sm">
          Connect your wallet to play
        </div>
      )}
      
      {/* Insufficient balance message */}
      {connected && balance < betAmount && !freeSpinsActive && (
        <div className="mt-3 text-center text-yellow-400 text-sm">
          Insufficient TARDI balance
        </div>
      )}
    </div>
  );
};

export default GameControls;