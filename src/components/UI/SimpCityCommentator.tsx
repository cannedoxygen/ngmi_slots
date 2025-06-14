// src/components/UI/SimpCityCommentator.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface SimpCityCommentatorProps {
  comment: string;
}

const SimpCityCommentator: React.FC<SimpCityCommentatorProps> = ({ comment }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedComment, setDisplayedComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const prevCommentRef = useRef('');
  const typingSpeedRef = useRef(40); // ms per character
  const typingIndexRef = useRef(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle typing animation
  useEffect(() => {
    // Only animate if the comment is different from previous
    if (comment && comment !== prevCommentRef.current) {
      // Store current comment for comparison next time
      prevCommentRef.current = comment;
      
      // Reset typing animation
      setIsTyping(true);
      setIsAnimating(true);
      setDisplayedComment('');
      typingIndexRef.current = 0;
      
      // Clear any existing timers
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      
      // Start the typing animation
      const typeNextCharacter = () => {
        if (typingIndexRef.current < comment.length) {
          setDisplayedComment(prev => prev + comment.charAt(typingIndexRef.current));
          typingIndexRef.current++;
        } else {
          // Typing complete
          clearInterval(typingTimerRef.current!);
          typingTimerRef.current = null;
          setIsTyping(false);
          
          // End bouncing animation after a delay
          setTimeout(() => {
            setIsAnimating(false);
          }, 500);
        }
      };
      
      // Start typing after a small delay to let the animation begin
      setTimeout(() => {
        typingTimerRef.current = setInterval(typeNextCharacter, typingSpeedRef.current);
      }, 300);
    }
    
    return () => {
      // Clean up on unmount
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [comment]);
  
  return (
    <div className="flex flex-col items-center">
      {/* Character Image */}
      <div 
        className={`
          character-image relative w-24 h-24 md:w-32 md:h-32
          ${isAnimating ? 'animate-bounce-mini' : ''}
        `}
      >
        <Image
          src="/images/businesses/business6b.png"
          alt="SimpCity Commentator"
          fill
          sizes="(max-width: 768px) 96px, 128px"
          className="object-contain"
          priority
        />
      </div>
      
      {/* Speech Bubble */}
      <div 
        className={`
          speech-bubble mt-3 w-full h-24
          max-w-full p-3 rounded-lg
          bg-white text-gray-900 text-sm
          border-2 border-blue-500
          ${isAnimating && displayedComment.length === 0 ? 'animate-pop-in' : ''}
        `}
      >
        <div className="relative">
          {displayedComment}
          {isTyping && (
            <span className="typing-cursor inline-block w-2 h-4 bg-gray-800 ml-1 animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpCityCommentator;