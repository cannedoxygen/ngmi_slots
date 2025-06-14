// src/components/UI/MayorQuimbyCharacter.tsx
import React, { useState, useEffect, useRef } from 'react';

interface MayorQuimbyCharacterProps {
  comment: string;
  isWin?: boolean;
  isBigWin?: boolean;
}

const MayorQuimbyCharacter: React.FC<MayorQuimbyCharacterProps> = ({ 
  comment, 
  isWin = false, 
  isBigWin = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedComment, setDisplayedComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const prevCommentRef = useRef('');
  const typingSpeedRef = useRef(40);
  const typingIndexRef = useRef(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing animation (same as original)
  useEffect(() => {
    if (comment && comment !== prevCommentRef.current) {
      prevCommentRef.current = comment;
      
      setIsTyping(true);
      setIsAnimating(true);
      setDisplayedComment('');
      typingIndexRef.current = 0;
      
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      
      const typeNextCharacter = () => {
        if (typingIndexRef.current < comment.length) {
          setDisplayedComment(prev => prev + comment.charAt(typingIndexRef.current));
          typingIndexRef.current++;
        } else {
          clearInterval(typingTimerRef.current!);
          typingTimerRef.current = null;
          setIsTyping(false);
          
          setTimeout(() => {
            setIsAnimating(false);
          }, 500);
        }
      };

      typingTimerRef.current = setInterval(typeNextCharacter, typingSpeedRef.current);
    }

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [comment]);

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="relative">
        {/* Mayor Quimby Container */}
        <div className={`
          relative w-72 flex flex-col items-center
          ${isBigWin ? 'animate-bounce' : ''}
          ${isWin ? 'scale-105' : ''}
          transition-all duration-300
        `}>
          {/* Speech Bubble with Shadow */}
          <div className="relative bg-white rounded-2xl p-4 mb-4 border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.8)]">
            <p className="text-black font-bold text-lg min-h-[3rem] text-center">
              {displayedComment}
              {isTyping && <span className="animate-blink">|</span>}
            </p>
            
            {/* Speech bubble tail */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-white"></div>
              <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[20px] border-l-transparent border-r-transparent border-t-black absolute -top-1 -left-1"></div>
            </div>
          </div>
          
          {/* Mayor Quimby Character */}
          <div className={`
            relative transform transition-all duration-300
            ${isAnimating ? 'animate-wiggle' : ''}
          `}>
            {/* Mayor Body - Simpsons Style */}
            <div className="w-40 h-48 relative">
              {/* Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-[#FFD90F] rounded-full border-4 border-black shadow-lg">
                {/* Hair */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gray-400 rounded-t-full border-3 border-black"></div>
                
                {/* Eyes */}
                <div className="absolute top-8 left-1/4 w-6 h-6 bg-white rounded-full border-2 border-black">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="absolute top-8 right-1/4 w-6 h-6 bg-white rounded-full border-2 border-black">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                </div>
                
                {/* Nose */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-[#FFD90F] rounded-full border-2 border-black"></div>
                
                {/* Mouth */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-black rounded-full"></div>
                
                {/* Mustache */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-blue-900 rounded-full border-2 border-black"></div>
              </div>
              
              {/* Body/Suit */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-24 bg-purple-600 rounded-t-3xl border-4 border-black shadow-lg">
                {/* Tie */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-20 bg-red-600 border-2 border-black"></div>
                
                {/* Mayor Sash */}
                <div className="absolute bottom-4 left-0 right-0 bg-red-700 text-white text-xs font-bold text-center py-2 border-2 border-black">
                  MAYOR
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Win effects */}
        {isWin && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-20"></div>
          </div>
        )}
        
        {isBigWin && (
          <div className="absolute -inset-4 pointer-events-none">
            <div className="animate-pulse absolute inset-0 rounded-full bg-yellow-400 opacity-30"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MayorQuimbyCharacter;