// src/components/SlotMachine/Symbol.tsx
import React from 'react';
import Image from 'next/image';
import { gameConfig } from '../../config/gameConfig';

interface SymbolProps {
  type: string;
  position: number;
  isSpinning: boolean;
  isHighlighted?: boolean;
}

const Symbol: React.FC<SymbolProps> = ({
  type,
  position,
  isSpinning,
  isHighlighted = false
}) => {
  // Get symbol configuration from gameConfig
  const symbolConfig = gameConfig.symbols[type] || {
    name: 'Unknown Symbol',
    imagePath: '/assets/images/symbols/placeholder.png',
    tier: 'low',
    multiplier: 1
  };

  // Determine if this is a special symbol
  const isMultiplier = type.includes('multiplier');
  const isFreeSpins = type.includes('free-spin');
  const isJackpot = type === 'high-tardi';

  return (
    <div
      className={`
        symbol relative aspect-square w-full
        flex items-center justify-center 
        bg-gray-900 rounded-md border-2 
        ${isHighlighted ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-gray-700'}
        ${isSpinning ? 'spinning' : ''}
      `}
      data-symbol={type}
      data-position={position}
    >
      {/* Symbol Image */}
      <div 
        className={`
          symbol-image relative w-4/5 h-4/5
          ${isJackpot ? 'animate-pulse' : ''}
          ${isMultiplier ? 'scale-110' : ''}
        `}
      >
        <Image
          src={symbolConfig.imagePath}
          alt={symbolConfig.name}
          fill
          sizes="(max-width: 768px) 33vw, 120px"
          className="object-contain"
          priority={isJackpot} // Prioritize loading the jackpot symbol
        />
      </div>

      {/* Multiplier Badge */}
      {isMultiplier && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
          {type.includes('2x') ? '2x' : type.includes('5x') ? '5x' : '10x'}
        </div>
      )}

      {/* Free Spins Badge */}
      {isFreeSpins && (
        <div className="absolute bottom-1 w-full text-center bg-green-600 text-white text-xs font-bold py-0.5">
          FREE SPIN
        </div>
      )}

      {/* Symbol Glow Effects */}
      {(isJackpot || isHighlighted) && (
        <div className={`absolute inset-0 rounded-md ${isJackpot ? 'bg-blue-500/10' : 'bg-yellow-400/10'}`}></div>
      )}

      {/* Symbol Shine Effect (decorative) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-md"></div>
    </div>
  );
};

export default Symbol;