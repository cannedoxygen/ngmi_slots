// src/components/UI/TNGMICharacter.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface TNGMICharacterProps {
  comment: string;
}

const TNGMICharacter: React.FC<TNGMICharacterProps> = ({ comment }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const prevCommentRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animate the character and speech bubble when comment changes
  useEffect(() => {
    // Only animate if the comment is different from previous
    if (comment && comment !== prevCommentRef.current) {
      // Store current comment for comparison next time
      prevCommentRef.current = comment;
      
      // Start animation
      setIsAnimating(true);
      
      // Set the comment with a small delay for better effect
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCurrentComment(comment);
      }, 100);
      
      // End animation after a period
      const animationTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => {
        clearTimeout(animationTimeout);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [comment]);
  
  return (
    <div className="tngmi-character-container">
      {/* Character Image */}
      <div className="relative">
        <div 
          className={`
            character-image relative w-32 h-32 md:w-40 md:h-40
            ${isAnimating ? 'animate-bounce-mini' : ''}
          `}
        >
          <Image
            src="/assets/images/t-ngmi/profile.png"
            alt="T-NGMI Character"
            fill
            sizes="(max-width: 768px) 128px, 160px"
            className="object-contain"
            priority
          />
        </div>
        
        {/* Speech Bubble */}
        {currentComment && (
          <div 
            className={`
              speech-bubble absolute top-0 right-full mr-2
              max-w-[200px] md:max-w-[240px] p-3 rounded-lg
              bg-white text-gray-900 text-sm md:text-base
              border-2 border-blue-500
              ${isAnimating ? 'animate-pop-in' : ''}
            `}
          >
            <div className="relative">
              {currentComment}
              
              {/* Speech bubble pointer */}
              <div className="absolute top-1/2 right-0 w-0 h-0 transform translate-x-[8px] -translate-y-1/2">
                <div className="border-l-[10px] border-l-white border-y-[8px] border-y-transparent" />
              </div>
              <div className="absolute top-1/2 right-0 w-0 h-0 transform translate-x-[10px] -translate-y-1/2">
                <div className="border-l-[12px] border-l-blue-500 border-y-[10px] border-y-transparent" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TNGMICharacter;