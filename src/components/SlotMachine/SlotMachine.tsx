// src/components/SlotMachine/SlotMachine.tsx
import React, { useState, useEffect } from 'react';
import Reel from './Reel';
import PaylineDisplay from './PaylineDisplay';
import GameControls from '../UI/GameControls';
import WinDisplay from '../UI/WinDisplay';
import TNGMICharacter from '../UI/TNGMICharacter';
import TransactionModal from '../SuiWallet/TransactionModal';
import useSlotMachine from '../../hooks/useSlotMachine';
import { getTNGMIComment } from '../../config/tngmiComments';
import Button from '../common/Button';

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

  const [tngmiComment, setTngmiComment] = useState<string>('');
  const [showPaytable, setShowPaytable] = useState<boolean>(false);

  // Update T-NGMI character comments based on game state
  useEffect(() => {
    if (error) {
      setTngmiComment(getTNGMIComment('error'));
    } else if (isWinner) {
      if (winAmount >= 100) {
        setTngmiComment(getTNGMIComment('bigWin'));
      } else {
        setTngmiComment(getTNGMIComment('win'));
      }
    } else if (!spinning && activePaylines.length === 0 && reels.length > 0) {
      setTngmiComment(getTNGMIComment('lose'));
    } else if (spinning) {
      setTngmiComment(getTNGMIComment('spinning'));
    } else {
      setTngmiComment(getTNGMIComment('idle'));
    }
  }, [spinning, isWinner, winAmount, activePaylines, reels, error]);

  return (
    <div className="slot-machine-container relative bg-gray-800 rounded-lg overflow-hidden border border-blue-900/30 shadow-lg">
      {/* Machine Header */}
      <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 p-4 text-center border-b border-blue-800">
        <h2 className="text-2xl font-bold text-blue-300 tracking-wider uppercase">T-NGMI Slots</h2>
      </div>

      {/* Game Area */}
      <div className="p-6 relative">
        {/* Paylines Overlay */}
        <PaylineDisplay 
          activePaylines={activePaylines} 
          paylines={paylines} 
          visible={isWinner && activePaylines.length > 0} 
        />

        {/* Reels Container */}
        <div className="reels-container grid grid-cols-3 gap-2 bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6">
          {reels.map((reelSymbols, reelIndex) => (
            <Reel 
              key={`reel-${reelIndex}`} 
              symbols={reelSymbols} 
              spinning={spinning} 
              spinDelay={reelIndex * 300} 
            />
          ))}
        </div>

        {/* Win Display */}
        {isWinner && (
          <WinDisplay 
            winAmount={winAmount} 
            multiplier={multiplier}
            visible={true}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message text-red-400 text-center mb-4">
            {error}
          </div>
        )}

        {/* Free Spins Counter */}
        {freeSpinsRemaining > 0 && (
          <div className="free-spins-counter text-center mb-4">
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {freeSpinsRemaining} Free Spin{freeSpinsRemaining !== 1 ? 's' : ''} Remaining
            </span>
          </div>
        )}

        {/* Game Controls */}
        <div className="game-controls-container">
          <GameControls 
            onSpin={spin}
            spinning={spinning}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            disabled={!canPlay || spinning}
            freeSpinsActive={freeSpinsRemaining > 0}
          />
        </div>

        {/* Paytable Button */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="small" 
            onClick={() => setShowPaytable(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Paytable
          </Button>
        </div>
      </div>

      {/* T-NGMI Character */}
      <div className="tngmi-container absolute right-6 top-24">
        <TNGMICharacter comment={tngmiComment} />
      </div>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transactionId={transactionId}
        action="Spin"
        amount={betAmount}
      />
    </div>
  );
};

export default SlotMachine;