// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Character encoding */}
        <meta charSet="utf-8" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA primary color */}
        <meta name="theme-color" content="#111827" />
        
        {/* Meta tags for SEO */}
        <meta name="description" content="SimpCity Casino Slots - Blockchain Slot Game on Solana" />
        <meta name="keywords" content="blockchain, gaming, slot machine, Solana, SimpCity, SIMP" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SimpCity Casino Slots" />
        <meta property="og:description" content="Play SimpCity Casino Slots on the Solana blockchain and win SIMP tokens!" />
        <meta property="og:image" content="/assets/images/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SimpCity Casino Slots" />
        <meta name="twitter:description" content="Play SimpCity Casino Slots on the Solana blockchain and win SIMP tokens!" />
        <meta name="twitter:image" content="/assets/images/og-image.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        
        {/* Wallet scripts */}
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
        <script src="/js/wallet/connection/wallet-connect.js" defer></script>
        <script src="/js/wallet/multi-wallet-adapter.js" defer></script>
        <script src="/js/balance.js" defer></script>
        <script src="/js/wallet-bridge.js" defer></script>
        <script src="/js/wallet-debug.js" defer></script>
      </Head>
      <body className="bg-gray-900 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}