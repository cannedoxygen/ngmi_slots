// src/config/tngmiComments.ts

/**
 * T-NGMI character comments for different game states
 * These are displayed in the speech bubble next to the character
 */

interface CommentsGroup {
    idle: string[];       // When nothing is happening
    spinning: string[];   // During spin
    win: string[];        // Small/medium wins
    bigWin: string[];     // Large wins
    jackpot: string[];    // Jackpot wins
    lose: string[];       // No win
    error: string[];      // Error states
    freeSpins: string[];  // Free spins triggered
    multiplier: string[]; // Multiplier triggered
  }
  
  export const comments: CommentsGroup = {
    // Idle comments
    idle: [
      "Ready to spin?",
      "Let's see what fate has in store!",
      "Fortune favors the bold... probably.",
      "Those reels aren't going to spin themselves!",
      "I've got a good feeling about this one!",
      "TARDI tokens are calling your name!",
      "Win big or go home broke, that's what I always say!",
      "The blockchain awaits your next move..."
    ],
    
    // Spinning comments
    spinning: [
      "Here we go!",
      "Round and round we go!",
      "Come on, big money!",
      "Fingers crossed!",
      "Let's hit that jackpot!",
      "Spin baby, spin!",
      "I can feel a win coming!",
      "Please be good... please be good..."
    ],
    
    // Small/medium win comments
    win: [
      "Winner winner!",
      "Look at that, you won!",
      "The blockchain gods smile upon you!",
      "Not bad at all!",
      "That's what I'm talking about!",
      "Ka-ching! More TARDI for you!",
      "You've got the touch!",
      "Now we're talking!"
    ],
    
    // Big win comments
    bigWin: [
      "WHOA! HUGE WIN!",
      "You're on fire!",
      "The TARDI is flowing today!",
      "I can't believe my eyes!",
      "That's how it's done!",
      "You're crushing it!",
      "Absolutely massive win!",
      "Is this even legal?! So much TARDI!"
    ],
    
    // Jackpot comments
    jackpot: [
      "JACKPOT! I'M LOSING MY MIND!",
      "THE LEGENDARY JACKPOT! UNBELIEVABLE!",
      "YOU'VE DONE IT! THE ULTIMATE WIN!",
      "HISTORY IN THE MAKING RIGHT HERE!",
      "TARDI OVERFLOW ERROR! TOO MUCH WINNING!",
      "SOMEONE CALL THE BLOCKCHAIN POLICE! THIS IS ROBBERY!",
      "THE PROPHECY IS TRUE! YOU'VE HIT THE JACKPOT!"
    ],
    
    // Lose comments
    lose: [
      "Better luck next time!",
      "That's rough, buddy.",
      "Not this time, but don't give up!",
      "You can't win them all...",
      "The house always wins... sometimes.",
      "That spin didn't go your way.",
      "Don't worry, persistence pays off!",
      "No big deal, just warming up!"
    ],
    
    // Error comments
    error: [
      "Uh oh, something went wrong!",
      "Looks like the blockchain hiccuped.",
      "Have you tried turning it off and on again?",
      "Technical difficulties! Not my fault!",
      "Well this is embarrassing...",
      "Error 404: Winning not found.",
      "The digital hamsters powering this game need a break!"
    ],
    
    // Free spins comments
    freeSpins: [
      "FREE SPINS! It's like free money!",
      "FREE SPINS! Let's make them count!",
      "FREE SPINS! No TARDI needed!",
      "FREE SPINS! This is where the magic happens!",
      "FREE SPINS! The best kind of spins!",
      "FREE SPINS! Extra chances to win big!"
    ],
    
    // Multiplier comments
    multiplier: [
      "MULTIPLIER! Everything's better with multiplication!",
      "MULTIPLIER! Time to supercharge those wins!",
      "MULTIPLIER! The math is on your side now!",
      "MULTIPLIER! Let's pump those numbers up!",
      "MULTIPLIER! It's all about leverage, baby!",
      "MULTIPLIER! More bang for your TARDI!"
    ]
  };
  
  /**
   * Get a random comment for the specified game state
   * @param state The current game state
   * @returns A random comment appropriate for the state
   */
  export const getTNGMIComment = (state: keyof CommentsGroup): string => {
    const commentGroup = comments[state] || comments.idle;
    const randomIndex = Math.floor(Math.random() * commentGroup.length);
    return commentGroup[randomIndex];
  };
  
  export default comments;