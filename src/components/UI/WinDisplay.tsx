// src/components/UI/WinDisplay.tsx
import React, { useState, useEffect, useRef } from 'react';

interface WinDisplayProps {
  winAmount: number;
  multiplier: number;
  visible: boolean;
}

const WinDisplay: React.FC<WinDisplayProps> = ({
  winAmount,
  multiplier,
  visible
}) => {
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const prevWinRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  
  // Determine if this is a big win (could be configurable)
  const isBigWin = winAmount >= 100;
  const isJackpot = winAmount >= 500;
  
  // Animate the win amount counting up
  useEffect(() => {
    if (visible && winAmount > 0) {
      // Reset if it's a new win
      if (winAmount !== prevWinRef.current) {
        setDisplayedAmount(0);
        setAnimationComplete(false);
        prevWinRef.current = winAmount;
        
        // Start time for the animation
        const startTime = Date.now();
        // Duration scales with win amount - bigger wins take longer to count up
        const duration = Math.min(2000 + (winAmount / 10) * 100, 6000);
        
        const animateValue = () => {
          const now = Date.now();
          const elapsedTime = now - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Easing function for smoother animation
          const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
          
          const currentValue = Math.floor(easedProgress * winAmount);
          setDisplayedAmount(currentValue);
          
          if (progress < 1) {
            // Continue animation
            animationFrameRef.current = requestAnimationFrame(animateValue);
          } else {
            // Animation completed
            setDisplayedAmount(winAmount);
            setAnimationComplete(true);
          }
        };
        
        // Start the animation
        animationFrameRef.current = requestAnimationFrame(animateValue);
      }
    } else {
      // Reset when not visible
      setDisplayedAmount(0);
      setAnimationComplete(false);
      
      // Cancel any ongoing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    
    // Clean up animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visible, winAmount]);
  
  if (!visible) return null;
  
  return (
    <div className={`win-display mb-6 text-center ${animationComplete ? 'complete' : 'animating'}`}>
      {isJackpot && (
        <div className="jackpot-banner mb-2">
          <div className="text-3xl font-bold text-yellow-400 uppercase animate-pulse-fast tracking-widest">
            JACKPOT!
          </div>
        </div>
      )}
      
      <div 
        className={`
          win-amount-container 
          py-3 px-6 rounded-lg inline-block 
          ${isJackpot ? 'bg-yellow-600/30 border-2 border-yellow-500' : 
            isBigWin ? 'bg-green-600/30 border border-green-500' : 
            'bg-blue-600/30 border border-blue-500'}
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="win-label text-gray-300 font-medium">WIN</span>
          <span 
            className={`
              win-amount font-bold 
              ${isJackpot ? 'text-3xl text-yellow-400' : 
                isBigWin ? 'text-2xl text-green-400' : 
                'text-xl text-blue-400'}
            `}
          >
            {displayedAmount.toLocaleString()}
          </span>
          <span className="win-currency text-gray-400 text-sm">TARDI</span>
          
          {multiplier > 1 && (
            <span 
              className={`
                win-multiplier ml-2 px-2 py-0.5 rounded-full 
                font-bold text-sm
                ${isJackpot ? 'bg-yellow-600 text-white' : 
                  'bg-purple-600 text-white'}
              `}
            >
              x{multiplier}
            </span>
          )}
        </div>
      </div>
      
      {/* Animated particles for celebration */}
      {(isBigWin || isJackpot) && (
        <div className="particles absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: isJackpot ? 50 : 20 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className={`
                absolute w-2 h-2 rounded-full
                ${isJackpot ? 'bg-yellow-400' : 'bg-green-400'}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `particle-float ${Math.random() * 2 + 1}s ease-out forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WinDisplay;