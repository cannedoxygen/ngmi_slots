// src/config/paylines.ts
import { Payline } from '../types/game';

/**
 * Payline definition for the 3x3 slot machine
 * 
 * The position format is [row, column] with 0-indexed values:
 * [0,0] [0,1] [0,2]
 * [1,0] [1,1] [1,2]
 * [2,0] [2,1] [2,2]
 * 
 * Each payline consists of 3 positions to form a winning pattern
 */
export const paylines: Payline[] = [
  // Payline 1: Top row
  {
    id: 1,
    positions: [
      [0, 0], [0, 1], [0, 2]
    ],
    color: '#ff5252', // Red
    name: 'Top Horizontal'
  },
  
  // Payline 2: Middle row
  {
    id: 2,
    positions: [
      [1, 0], [1, 1], [1, 2]
    ],
    color: '#4caf50', // Green
    name: 'Middle Horizontal'
  },
  
  // Payline 3: Bottom row
  {
    id: 3,
    positions: [
      [2, 0], [2, 1], [2, 2]
    ],
    color: '#2196f3', // Blue
    name: 'Bottom Horizontal'
  },
  
  // Payline 4: Diagonal from top-left to bottom-right
  {
    id: 4,
    positions: [
      [0, 0], [1, 1], [2, 2]
    ],
    color: '#ff9800', // Orange
    name: 'Diagonal Down'
  },
  
  // Payline 5: Diagonal from bottom-left to top-right
  {
    id: 5,
    positions: [
      [2, 0], [1, 1], [0, 2]
    ],
    color: '#9c27b0', // Purple
    name: 'Diagonal Up'
  },
  
  // Additional paylines (not used in basic game, but available for future expansion)
  
  // Payline 6: First column
  {
    id: 6,
    positions: [
      [0, 0], [1, 0], [2, 0]
    ],
    color: '#00bcd4', // Cyan
    name: 'Left Vertical',
    active: false // Not active in basic game
  },
  
  // Payline 7: Second column
  {
    id: 7,
    positions: [
      [0, 1], [1, 1], [2, 1]
    ],
    color: '#ffc107', // Amber
    name: 'Middle Vertical',
    active: false
  },
  
  // Payline 8: Third column
  {
    id: 8,
    positions: [
      [0, 2], [1, 2], [2, 2]
    ],
    color: '#e91e63', // Pink
    name: 'Right Vertical',
    active: false
  },
  
  // Payline 9: V-shape (bottom row and up the middle)
  {
    id: 9,
    positions: [
      [2, 0], [1, 1], [2, 2]
    ],
    color: '#8bc34a', // Light Green
    name: 'V-Shape',
    active: false
  },
  
  // Payline 10: Inverted V-shape (top row and down the middle)
  {
    id: 10,
    positions: [
      [0, 0], [1, 1], [0, 2]
    ],
    color: '#ff4081', // Pink Accent
    name: 'Inverted V-Shape',
    active: false
  }
];

// Export active paylines only (for easier access)
export const activePaylines = paylines.filter(payline => payline.active !== false);

// Export a function to get a payline by ID
export const getPaylineById = (id: number): Payline | undefined => {
  return paylines.find(payline => payline.id === id);
};

export default paylines;