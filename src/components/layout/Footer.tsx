// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-blue-500/30 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} T-NGMI Slots | Powered by Sui Blockchain
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="/about" 
              className="text-gray-400 hover:text-blue-400 text-sm transition"
            >
              About
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-blue-400 text-sm transition"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-blue-400 text-sm transition"
            >
              Privacy
            </Link>
            <a 
              href="https://docs.sui.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-blue-400 text-sm transition"
            >
              Sui Docs
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Play responsibly. Blockchain gaming involves financial risk.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;