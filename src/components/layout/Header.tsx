// src/components/layout/Header.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import ConnectWallet from '../SuiWallet/ConnectWallet';
import WalletInfo from '../SuiWallet/WalletInfo';
import { useSuiWallet } from '../../hooks/useSuiWallet';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useSuiWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="font-bold text-2xl text-blue-400 hover:text-blue-300 transition">
              T-NGMI SLOTS
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/game" className="text-gray-300 hover:text-blue-400 transition font-medium">
              Play Now
            </Link>
            <Link href="/history" className="text-gray-300 hover:text-blue-400 transition font-medium">
              Game History
            </Link>
            {connected ? (
              <WalletInfo />
            ) : (
              <ConnectWallet />
            )}
          </nav>

          {/* Menu Button - Mobile */}
          <button 
            className="md:hidden text-gray-300 hover:text-blue-400"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <ul className="space-y-4">
              <li>
                <Link href="/game" className="block text-gray-300 hover:text-blue-400 transition font-medium" onClick={() => setIsMenuOpen(false)}>
                  Play Now
                </Link>
              </li>
              <li>
                <Link href="/history" className="block text-gray-300 hover:text-blue-400 transition font-medium" onClick={() => setIsMenuOpen(false)}>
                  Game History
                </Link>
              </li>
              <li>
                {connected ? (
                  <WalletInfo />
                ) : (
                  <ConnectWallet />
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;