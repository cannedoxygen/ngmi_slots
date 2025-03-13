/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        // Add any domains for remote images here
      ],
    },
    webpack: (config, { isServer }) => {
      // Fix for using crypto in the browser
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          path: require.resolve('path-browserify'),
        };
      }
  
      return config;
    },
    // Configure environment variables
    env: {
      SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
      PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || '',
      TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '',
      MOCK_BLOCKCHAIN: process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN || 'true',
    },
  };
  
  module.exports = nextConfig;