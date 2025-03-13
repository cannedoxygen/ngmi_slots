// src/components/SuiWallet/WalletInfo.tsx
import React, { useState } from 'react';
import { useSuiWallet } from '../../hooks/useSuiWallet';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import Button from '../common/Button';

const WalletInfo: React.FC = () => {
  const { address, disconnect, connected, provider } = useSuiWallet();
  const { balance, loading: balanceLoading } = useTokenBalance();
  const [showMenu, setShowMenu] = useState(false);

  const shortenAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  if (!connected || !address) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2 transition-colors"
      >
        <div className="flex items-center">
          {provider?.icon && (
            <img 
              src={provider.icon} 
              alt={provider.name} 
              className="w-4 h-4 mr-2"
            />
          )}
          <span className="font-medium text-sm">{shortenAddress(address)}</span>
        </div>
        <div className="flex items-center text-blue-400 font-medium text-sm">
          {balanceLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <span>{balance} TARDI</span>
          )}
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-300">Wallet</p>
            <p 
              className="text-xs text-gray-400 truncate cursor-pointer hover:text-blue-400"
              onClick={copyAddressToClipboard}
              title="Click to copy address"
            >
              {address}
            </p>
          </div>
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-300">Balance</p>
            <p className="text-xs text-blue-400">
              {balanceLoading ? 'Loading...' : `${balance} TARDI`}
            </p>
          </div>
          <div className="px-2 py-1">
            <Button
              onClick={handleDisconnect}
              className="w-full text-center text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 py-2 rounded-md transition-colors"
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;