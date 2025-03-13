// src/components/SuiWallet/ConnectWallet.tsx
import React, { useState } from 'react';
import Button from '../common/Button';
import { useSuiWallet } from '../../hooks/useSuiWallet';
import Modal from '../common/Modal';

const ConnectWallet: React.FC = () => {
  const { connect, connecting, walletProviders } = useSuiWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectClick = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (providerId: string) => {
    try {
      await connect(providerId);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <>
      <Button
        onClick={handleConnectClick}
        disabled={connecting}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Select Wallet"
      >
        <div className="grid grid-cols-1 gap-3 p-2">
          {walletProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleWalletSelect(provider.id)}
              className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {provider.icon && (
                <img
                  src={provider.icon}
                  alt={`${provider.name} logo`}
                  className="w-8 h-8"
                />
              )}
              <span className="font-medium">{provider.name}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ConnectWallet;