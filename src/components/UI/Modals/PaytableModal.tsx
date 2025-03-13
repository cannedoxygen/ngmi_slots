// src/components/UI/Modals/PaytableModal.tsx
import React from 'react';
import Image from 'next/image';
import Modal from '../../common/Modal';
import { gameConfig } from '../../../config/gameConfig';
import { paylines } from '../../../config/paylines';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaytableModal: React.FC<PaytableModalProps> = ({
  isOpen,
  onClose
}) => {
  // Group symbols by tier
  const symbolsByTier = Object.entries(gameConfig.symbols).reduce((acc, [key, symbol]) => {
    if (!acc[symbol.tier]) {
      acc[symbol.tier] = [];
    }
    acc[symbol.tier].push({ key, ...symbol });
    return acc;
  }, {} as Record<string, Array<{ key: string; name: string; tier: string; payout: number; imagePath: string; probability?: number }>>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paytable & Game Rules"
      size="large"
    >
      <div className="paytable-content space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Game Description */}
        <section className="game-description">
          <h3 className="text-xl font-bold text-blue-400 mb-2">T-NGMI Slots</h3>
          <p className="text-gray-300">
            Spin the reels and match symbols across paylines to win TARDI tokens! 
            Match special symbols for multipliers and free spins.
          </p>
        </section>

        {/* Symbol Payouts */}
        <section className="symbol-payouts">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Symbol Payouts</h3>
          
          {/* High Tier Symbols */}
          {symbolsByTier.high && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-yellow-400 mb-2">High Tier Symbols</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {symbolsByTier.high.map(symbol => (
                  <div 
                    key={symbol.key} 
                    className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="symbol-image w-12 h-12 relative mr-3">
                      <Image
                        src={symbol.imagePath}
                        alt={symbol.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{symbol.name}</p>
                      <p className="text-yellow-400 text-sm">
                        Pays {symbol.payout}x bet
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Mid Tier Symbols */}
          {symbolsByTier.mid && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-blue-400 mb-2">Mid Tier Symbols</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {symbolsByTier.mid.map(symbol => (
                  <div 
                    key={symbol.key} 
                    className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="symbol-image w-12 h-12 relative mr-3">
                      <Image
                        src={symbol.imagePath}
                        alt={symbol.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{symbol.name}</p>
                      <p className="text-blue-400 text-sm">
                        Pays {symbol.payout}x bet
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Low Tier Symbols */}
          {symbolsByTier.low && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-400 mb-2">Low Tier Symbols</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {symbolsByTier.low.map(symbol => (
                  <div 
                    key={symbol.key} 
                    className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="symbol-image w-12 h-12 relative mr-3">
                      <Image
                        src={symbol.imagePath}
                        alt={symbol.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{symbol.name}</p>
                      <p className="text-gray-400 text-sm">
                        Pays {symbol.payout}x bet
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Special Symbols */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-purple-400 mb-2">Special Symbols</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Multiplier */}
              <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-purple-700">
                <div className="symbol-image w-12 h-12 relative mr-3 flex items-center justify-center bg-purple-900/30 rounded-full">
                  <span className="text-xl font-bold text-purple-400">2x</span>
                </div>
                <div>
                  <p className="font-medium text-white">Multiplier</p>
                  <p className="text-purple-400 text-sm">
                    Multiplies win by 2x, 5x, or 10x
                  </p>
                </div>
              </div>
              
              {/* Free Spin */}
              <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-green-700">
                <div className="symbol-image w-12 h-12 relative mr-3 flex items-center justify-center bg-green-900/30 rounded-full">
                  <span className="text-sm font-bold text-green-400">FREE</span>
                </div>
                <div>
                  <p className="font-medium text-white">Free Spin</p>
                  <p className="text-green-400 text-sm">
                    Awards 1-3 free spins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Paylines */}
        <section className="paylines">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Paylines</h3>
          <p className="text-gray-300 mb-4">
            Match 3 identical symbols on any of the following paylines to win:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paylines.map(payline => (
              <div 
                key={payline.id} 
                className="p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                <h4 className="font-medium mb-2" style={{ color: payline.color }}>
                  Payline {payline.id}
                </h4>
                <div className="w-full h-16 relative">
                  {/* Simple visual representation of payline */}
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <g>
                      {/* 3x3 grid */}
                      {Array.from({ length: 9 }).map((_, i) => {
                        const row = Math.floor(i / 3);
                        const col = i % 3;
                        const x = col * 100 + 50;
                        const y = row * 33 + 16.5;
                        
                        return (
                          <rect
                            key={`cell-${i}`}
                            x={col * 100 + 10}
                            y={row * 33 + 1}
                            width={80}
                            height={30}
                            rx={4}
                            fill="#2d3748"
                            stroke="#4a5568"
                          />
                        );
                      })}
                      
                      {/* Payline path */}
                      <path
                        d={payline.positions.map((pos, i) => {
                          const [row, col] = pos;
                          const x = col * 100 + 50;
                          const y = row * 33 + 16.5;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke={payline.color}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      
                      {/* Dots at positions */}
                      {payline.positions.map((pos, i) => {
                        const [row, col] = pos;
                        const x = col * 100 + 50;
                        const y = row * 33 + 16.5;
                        
                        return (
                          <circle
                            key={`pos-${i}`}
                            cx={x}
                            cy={y}
                            r="5"
                            fill={payline.color}
                          />
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Game Rules */}
        <section className="game-rules">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Game Rules</h3>
          <ul className="space-y-2 text-gray-300 list-disc pl-5">
            <li>Minimum bet is 5 TARDI tokens</li>
            <li>Maximum bet is 100 TARDI tokens</li>
            <li>All wins are multiplied by the bet amount</li>
            <li>Multiplier symbols increase the win amount by their displayed value</li>
            <li>Free Spin symbols award additional spins without using tokens</li>
            <li>Match the TARDI symbol on all positions for the jackpot</li>
            <li>The RTP (Return to Player) is approximately 95%</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
};

export default PaytableModal;