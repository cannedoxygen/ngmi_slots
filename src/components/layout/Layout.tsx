// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#000',
      fontFamily: 'Comic Sans MS, cursive',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '0'
    }}>
      {/* Night sky with stars */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Simplified stars for testing */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          opacity: 0.6
        }}></div>
      </div>
      
      <Header />
      <main style={{
        flexGrow: 1,
        maxWidth: '1400px',
        margin: '20px auto 0',
        padding: '20px',
        position: 'relative',
        zIndex: 1,
        width: '100%'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}