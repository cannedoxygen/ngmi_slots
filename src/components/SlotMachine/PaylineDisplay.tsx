// src/components/SlotMachine/PaylineDisplay.tsx
import React, { useState, useEffect } from 'react';

interface Payline {
  id: number;
  positions: number[][];
  color: string;
}

interface PaylineDisplayProps {
  activePaylines: number[];
  paylines: Payline[];
  visible: boolean;
}

const PaylineDisplay: React.FC<PaylineDisplayProps> = ({
  activePaylines,
  paylines,
  visible
}) => {
  const [currentPaylineIndex, setCurrentPaylineIndex] = useState(0);
  
  // Cycle through active paylines when there are multiple wins
  useEffect(() => {
    if (!visible || activePaylines.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPaylineIndex((prev) => (prev + 1) % activePaylines.length);
    }, 1500); // Switch every 1.5 seconds
    
    return () => clearInterval(interval);
  }, [visible, activePaylines.length]);
  
  if (!visible || activePaylines.length === 0) {
    return null;
  }
  
  // Get the current payline to display
  const currentPaylineId = activePaylines[currentPaylineIndex];
  const currentPayline = paylines.find(p => p.id === currentPaylineId);
  
  if (!currentPayline) {
    return null;
  }
  
  // Calculate SVG path points for the payline
  const getPathPoints = () => {
    // Assuming a 3x3 grid with individual cells of 100x100 pixels
    const cellWidth = 100;
    const cellHeight = 100;
    
    return currentPayline.positions.map(([row, col]) => {
      // Calculate center of each cell
      const x = (col * cellWidth) + (cellWidth / 2);
      const y = (row * cellHeight) + (cellHeight / 2);
      return { x, y };
    });
  };
  
  const pathPoints = getPathPoints();
  
  // Create SVG path
  const pathData = pathPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div className="payline-display absolute inset-0 z-10 pointer-events-none">
      <svg 
        className="w-full h-full absolute top-0 left-0" 
        viewBox="0 0 300 300" 
        preserveAspectRatio="none"
      >
        <path
          d={pathData}
          stroke={currentPayline.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="5,5"
          fill="none"
          className="animate-pulse"
        />
        
        {/* Draw circles at connection points */}
        {pathPoints.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={currentPayline.color}
            className="animate-ping-slow"
          />
        ))}
      </svg>
      
      {/* Payline indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
        <div 
          className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border-2"
          style={{ borderColor: currentPayline.color }}
        >
          <span className="text-white text-sm font-medium">
            Payline {currentPayline.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaylineDisplay;