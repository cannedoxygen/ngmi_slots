// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#FED90F',
      borderTop: '4px solid #000',
      padding: '30px 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Master Footer Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <a 
            href="/whitepaper" 
            style={{
              backgroundColor: '#E70013',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 25px',
              borderRadius: '10px',
              textDecoration: 'none',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              textAlign: 'center',
              margin: '0 auto 20px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(-2deg)'
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>DO NOT PRESS</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(white paper)</span>
          </a>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '15px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <p style={{
                color: '#000',
                fontSize: '1rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                © 2025 SIMPIFICATION Inc.
              </p>
              <span style={{
                fontSize: '0.8rem',
                color: 'rgba(0,0,0,0.6)',
                marginLeft: '8px'
              }}>
                (Not a real company)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;