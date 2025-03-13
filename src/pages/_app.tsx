// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { SuiWalletProvider } from '../context/SuiWalletContext';
import { GameProvider } from '../context/GameContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // When the app is mounted on the client, update state
  // This prevents hydration errors with localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SuiWalletProvider>
      <GameProvider>
        {mounted && <Component {...pageProps} />}
      </GameProvider>
    </SuiWalletProvider>
  );
}

export default MyApp;