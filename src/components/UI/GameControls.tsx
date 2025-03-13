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
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Bet Controls - only show if not in free spins mode */}
        {!freeSpinsActive && (
          <div className="bet-controls flex flex-col sm:flex-row items-center gap-3">
            <span className="text-gray-400 text-sm font-medium">BET:</span>
            
            <div className="flex items-center">
              <Button
                onClick={handleDecreaseBet}
                disabled={spinning || disabled || betAmount <= 5}
                variant="ghost"
                size="small"
                className="text-lg font-bold"
              >
                -
              </Button>
              
              <div className="bet-amount-display mx-2 px-3 py-1 min-w-[80px] text-center bg-gray-800 rounded border border-gray-700">
                <span className="font-medium text-blue-300">{betAmount}</span>
                <span className="ml-1 text-xs text-gray-400">TARDI</span>
              </div>
              
              <Button
                onClick={handleIncreaseBet}
                disabled={spinning || disabled || betAmount >= balance}
                variant="ghost"
                size="small"
                className="text-lg font-bold"
              >
                +
              </Button>
            </div>
            
            <Button
              onClick={handleMaxBet}
              disabled={spinning || disabled || betAmount >= balance}
              variant="outline"
              size="small"
            >
              MAX BET
            </Button>
          </div>
        )}
        
        {/* Spin Button */}
        <Button
          onClick={onSpin}
          disabled={disabled || spinning}
          isLoading={spinning}
          variant="primary"
          size="large"
          className="spin-button min-w-[120px]"
        >
          {freeSpinsActive ? 'FREE SPIN' : 'SPIN'}
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