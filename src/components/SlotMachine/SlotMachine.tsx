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
    <div className="game-container max-w-6xl mx-auto">
      {/* Main game layout - using grid for better alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left side - Game controls and T-NGMI */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          {/* T-NGMI Character Section */}
          <div className="tngmi-section bg-gray-800 rounded-lg p-4 border border-blue-900/30 shadow-lg mb-4 h-64">
            <h3 className="text-sm font-medium text-gray-400 mb-3">T-NGMI Says:</h3>
            <div className="tngmi-container h-full flex items-center justify-center">
              <TNGMICharacter comment={tngmiComment} />
            </div>
          </div>
          
          {/* Game Controls Section - Made taller to match reels */}
          <div className="controls-section bg-gray-800 rounded-lg p-4 border border-blue-900/30 shadow-lg flex flex-col">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Game Controls</h3>
            
            {/* Using flex-grow to make GameControls fill available space */}
            <div className="flex-grow">
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
              <div className="free-spins-counter text-center mt-auto pt-4">
                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {freeSpinsRemaining} Free Spin{freeSpinsRemaining !== 1 ? 's' : ''} Remaining
                </span>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="error-message text-red-400 text-center mt-auto pt-4 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Center - Slot Machine */}
        <div className="slot-machine-container lg:col-span-9 order-1 lg:order-2 bg-gray-800 rounded-lg overflow-hidden border border-blue-900/30 shadow-lg">
          {/* Machine Header */}
          <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 p-3 flex justify-between items-center border-b border-blue-800">
            <h2 className="text-xl font-bold text-blue-300 tracking-wider uppercase">T-NGMI Slots</h2>
            
            {/* Win Display moved to header */}
            {isWinner && (
              <div className="win-display-compact">
                <span className="bg-green-600/50 text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                  WIN: <span className="font-bold ml-1">{winAmount}</span>
                  {multiplier > 1 && (
                    <span className="ml-2 bg-purple-600 px-1 rounded-full text-xs">x{multiplier}</span>
                  )}
                </span>
              </div>
            )}
            
            {/* Paytable Button */}
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => setShowPaytable(true)}
              className="text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Paytable
            </Button>
          </div>

          {/* Game Area */}
          <div className="p-4 relative">
            {/* Paylines Overlay */}
            <PaylineDisplay 
              activePaylines={activePaylines} 
              paylines={paylines} 
              visible={isWinner && activePaylines.length > 0} 
            />

            {/* Reels Container - Made more compact */}
            <div className="reels-container grid grid-cols-3 gap-2 bg-gray-900 p-3 rounded-lg border border-gray-700">
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
          <div className="p-4 lg:hidden">
            <Button
              onClick={spin}
              disabled={!canPlay || spinning}
              isLoading={spinning}
              variant="primary"
              size="large"
              className="w-full"
            >
              {spinning ? 'SPINNING...' : freeSpinsRemaining > 0 ? 'FREE SPIN' : 'SPIN'}
            </Button>
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
    </div>
  );
};

export default SlotMachine;