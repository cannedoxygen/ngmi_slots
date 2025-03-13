// src/pages/index.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import ConnectWallet from '../components/SuiWallet/ConnectWallet';
import { useSuiWallet } from '../hooks/useSuiWallet';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { connected } = useSuiWallet();

  return (
    <>
      <Head>
        <title>T-NGMI Slots | Blockchain Gaming on Sui</title>
        <meta name="description" content="Play T-NGMI Slots on the Sui blockchain and win TARDI tokens in this exciting 3x3 slot game!" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left Content */}
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Spin to Win <span className="text-blue-400">TARDI Tokens</span> on the Sui Blockchain
                </h1>
                
                <p className="text-xl text-gray-300">
                  Experience the thrill of T-NGMI Slots, a retro-futuristic 3x3 slot game powered by secure smart contracts on the Sui blockchain.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {connected ? (
                    <Button 
                      onClick={() => router.push('/game')} 
                      variant="primary" 
                      size="large"
                      className="flex-1 sm:flex-none text-center sm:min-w-[180px]"
                    >
                      Play Now
                    </Button>
                  ) : (
                    <div className="flex-1 sm:flex-none">
                      <ConnectWallet />
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => router.push('/history')} 
                    variant="outline" 
                    size="large"
                    className="flex-1 sm:flex-none text-center sm:min-w-[180px]"
                  >
                    View History
                  </Button>
                </div>
              </div>
              
              {/* Right Image/Preview */}
              <div className="lg:w-1/2 relative">
                <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 p-2 rounded-xl border border-blue-800/50 shadow-lg">
                  <div className="aspect-square max-w-md mx-auto relative overflow-hidden rounded-lg">
                    <Image
                      src="/assets/images/slot-preview.png"
                      alt="T-NGMI Slots Game Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-12">Game Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Exciting Gameplay</h3>
                <p className="text-gray-300">
                  Enjoy a classic 3x3 slot machine with 5 paylines, special multipliers, and free spin opportunities.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Blockchain Secured</h3>
                <p className="text-gray-300">
                  Built on Sui blockchain with transparent smart contracts for provably fair gameplay and secure transactions.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Win TARDI Tokens</h3>
                <p className="text-gray-300">
                  Play with and win TARDI tokens that can be used across the T-NGMI ecosystem or traded on exchanges.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How to Play Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">How to Play</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-blue-400">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-300">
                    Use your Sui wallet to connect to the game. You'll need TARDI tokens to play, which you can acquire from supported exchanges.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-blue-400">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Choose Your Bet</h3>
                  <p className="text-gray-300">
                    Select your bet amount between 5 and 100 TARDI tokens. Higher bets lead to higher potential rewards!
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 bg-blue-900/30 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-blue-400">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Spin and Win</h3>
                  <p className="text-gray-300">
                    Click the Spin button to start the game. Match 3 identical symbols on any payline to win. Look for special multipliers and free spin symbols to maximize your winnings!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Button 
                onClick={() => router.push('/game')} 
                variant="primary" 
                size="large"
              >
                Start Playing
              </Button>
            </div>
          </div>
        </section>
        
        {/* T-NGMI Character Section */}
        <section className="py-12 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 relative">
                <div className="aspect-square w-full max-w-[240px] mx-auto relative">
                  <Image
                    src="/assets/images/t-ngmi/character-full.png"
                    alt="T-NGMI Character"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 240px, 33vw"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-blue-400 mb-4">Meet T-NGMI</h2>
                <p className="text-gray-300 text-lg mb-4">
                  Your companion on this blockchain gambling adventure! T-NGMI will cheer you on with humorous comments during your gameplay.
                </p>
                <p className="text-gray-300">
                  Whether you're on a winning streak or hitting a rough patch, T-NGMI's witty remarks will keep you entertained as you spin the reels.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default HomePage;