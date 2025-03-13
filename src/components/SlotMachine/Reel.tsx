// src/components/SlotMachine/Reel.tsx
import React, { useState, useEffect, useRef } from 'react';
import Symbol from './Symbol';

interface ReelProps {
  symbols: string[];
  spinning: boolean;
  spinDelay: number;
}

const Reel: React.FC<ReelProps> = ({ symbols, spinning, spinDelay }) => {
  const [visualSymbols, setVisualSymbols] = useState<string[]>(symbols);
  const [animating, setAnimating] = useState<boolean>(false);
  const [blurLevel, setBlurLevel] = useState<number>(0);
  const spinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const symbolsRef = useRef<string[]>(symbols);
  
  // Update reference when symbols change
  useEffect(() => {
    symbolsRef.current = symbols;
  }, [symbols]);
  
  // Handle spinning animation
  useEffect(() => {
    if (spinning) {
      // Start animation after delay (for cascading effect)
      const startTimer = setTimeout(() => {
        setAnimating(true);
        setBlurLevel(5); // Maximum blur during spinning
        
        // Generate random symbols during spinning for visual effect
        const spinInterval = setInterval(() => {
          const randomSymbols = generateRandomSymbols();
          setVisualSymbols(randomSymbols);
        }, 100);
        
        // Store the interval so we can clear it later
        spinTimerRef.current = spinInterval;
      }, spinDelay);
      
      return () => {
        clearTimeout(startTimer);
        if (spinTimerRef.current) {
          clearInterval(spinTimerRef.current);
        }
      };
    } else if (animating) {
      // Clear the spinning interval
      if (spinTimerRef.current) {
        clearInterval(spinTimerRef.current);
        spinTimerRef.current = null;
      }
      
      // Gradually reduce blur for a smooth stop
      const stopAnimation = async () => {
        // Short delay based on position to create cascading stop effect
        await new Promise(resolve => setTimeout(resolve, spinDelay / 3));
        
        // Gradually reduce blur
        setBlurLevel(3);
        await new Promise(resolve => setTimeout(resolve, 100));
        setBlurLevel(1);
        await new Promise(resolve => setTimeout(resolve, 100));
        setBlurLevel(0);
        
        // Show final symbols
        setVisualSymbols(symbolsRef.current);
        setAnimating(false);
      };
      
      stopAnimation();
    }
  }, [spinning, spinDelay, animating]);
  
  // Generate random symbols for spinning animation
  const generateRandomSymbols = (): string[] => {
    // Add more symbol types as needed based on your game config
    const allPossibleSymbols = [
      'low-gear', 'low-token', 'low-badge',
      'mid-robot', 'mid-helmet', 'mid-future',
      'high-tardi', 'multiplier-2x', 'free-spin'
    ];
    
    return Array(3).fill(null).map(() => {
      const randomIndex = Math.floor(Math.random() * allPossibleSymbols.length);
      return allPossibleSymbols[randomIndex];
    });
  };

  return (
    <div 
      className={`reel relative flex flex-col gap-1 ${animating ? 'animating' : ''}`}
      style={{ 
        filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none',
        transition: 'filter 0.2s ease-out'
      }}
    >
      {visualSymbols.map((symbol, index) => (
        <Symbol 
          key={`${symbol}-${index}-${animating ? Date.now() : ''}`}
          type={symbol} 
          position={index} 
          isSpinning={animating}
        />
      ))}
    </div>
  );
};

export default Reel;