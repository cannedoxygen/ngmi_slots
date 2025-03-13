// src/pages/game.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import SlotMachine from '../components/SlotMachine/SlotMachine';
import PaytableModal from '../components/UI/Modals/PaytableModal';
import SettingsModal from '../components/UI/Modals/SettingsModal';
import Button from '../components/common/Button';
import { useSuiWallet } from '../hooks/useSuiWallet';

const GamePage: React.FC = () => {
  const router = useRouter();
  const { connected } = useSuiWallet();
  const [showPaytable, setShowPaytable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);

  // Check if it's the user's first visit to show the paytable automatically
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedGameBefore');
    if (!hasVisitedBefore) {
      // Show paytable after a short delay to let the page load first
      const timer = setTimeout(() => {
        setShowPaytable(true);
        localStorage.setItem('hasVisitedGameBefore', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setFirstVisit(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Play Now | T-NGMI Slots</title>
        <meta name="description" content="Play T-NGMI Slots on the Sui blockchain and win TARDI tokens!" />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">T-NGMI Slots</h1>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setShowPaytable(true)}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Paytable
              </Button>
              
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setShowSettings(true)}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </div>
          </div>
          
          {/* Connection Notice */}
          {!connected && (
            <div className="mb-6 bg-blue-900/30 border border-blue-800 rounded-lg p-4 text-center">
              <p className="text-blue-300 mb-2">Connect your wallet to play with TARDI tokens</p>
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                size="small"
              >
                Learn More
              </Button>
            </div>
          )}
          
          {/* Slot Machine */}
          <SlotMachine />
          
          {/* Game Description */}
          <div className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-lg font-bold text-blue-400 mb-2">How to Play</h2>
            <p className="text-gray-300 mb-4">
              Match 3 identical symbols on any of the 5 paylines to win TARDI tokens! Look out for special multiplier symbols and free spins to maximize your winnings.
            </p>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              <li>Adjust your bet using the controls below the reels</li>
              <li>Click the SPIN button to start the game</li>
              <li>Match symbols on paylines to win prizes</li>
              <li>Wins are automatically added to your wallet balance</li>
            </ul>
          </div>
        </div>
        
        {/* Modals */}
        <PaytableModal 
          isOpen={showPaytable} 
          onClose={() => setShowPaytable(false)} 
        />
        
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </Layout>
    </>
  );
};

export default GamePage;