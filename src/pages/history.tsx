// src/pages/history.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { formatDate, shortenTxId } from '../utils/sui';

interface GameTransaction {
  id: string;
  timestamp: number;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  status: 'win' | 'lose' | 'jackpot';
}

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const { connected, address } = useSuiWallet();
  const [transactions, setTransactions] = useState<GameTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch transaction history when connected
  useEffect(() => {
    if (connected && address) {
      fetchTransactionHistory();
    } else {
      setTransactions([]);
    }
  }, [connected, address, currentPage]);

  // Mock function to fetch transaction history
  // In a real app, this would call the blockchain
  const fetchTransactionHistory = async () => {
    setLoading(true);
    
    try {
      // For demo purposes, we'll generate mock data
      // In production, you'd fetch real transaction data from the blockchain
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const mockTransactions: GameTransaction[] = [];
      
      // Generate some sample transactions
      const totalItems = 35; // Total mock items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      
      for (let i = startIndex; i < endIndex; i++) {
        const timestamp = Date.now() - (i * 3600000); // Hours ago
        const betAmount = Math.floor(Math.random() * 20) * 5 + 5; // 5, 10, 15, ... 100
        const isWin = Math.random() > 0.6; // 40% win rate
        const isJackpot = isWin && Math.random() > 0.9; // 10% of wins are jackpots
        const multiplier = isWin ? (isJackpot ? 10 : (Math.random() > 0.7 ? 2 : 1)) : 0;
        const winAmount = isWin ? betAmount * multiplier * (isJackpot ? 5 : 1) : 0;
        
        mockTransactions.push({
          id: `0x${Math.random().toString(16).substring(2, 42)}`,
          timestamp,
          betAmount,
          winAmount: isWin ? winAmount : 0,
          multiplier: isWin ? multiplier : 0,
          status: isJackpot ? 'jackpot' : (isWin ? 'win' : 'lose')
        });
      }
      
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Copy transaction ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Head>
        <title>Game History | T-NGMI Slots</title>
        <meta name="description" content="View your T-NGMI Slots game history and transaction details." />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Game History</h1>
            
            <Button 
              onClick={() => router.push('/game')} 
              variant="outline"
              size="small"
            >
              Back to Game
            </Button>
          </div>
          
          {!connected ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <p className="text-gray-300 mb-4">Connect your wallet to view your game history</p>
              <Button 
                onClick={() => router.push('/')}
                variant="primary"
              >
                Connect Wallet
              </Button>
            </div>
          ) : loading ? (
            <div className="bg-gray-800 rounded-lg p-12 flex justify-center border border-gray-700">
              <div className="text-center">
                <Loader color="blue" size="large" />
                <p className="mt-4 text-gray-300">Loading transaction history...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <p className="text-gray-300 mb-4">You don't have any game transactions yet</p>
              <Button 
                onClick={() => router.push('/game')}
                variant="primary"
              >
                Play Now
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-900">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Transaction ID</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Bet</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Win</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Multiplier</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {transactions.map((tx) => (
                        <tr 
                          key={tx.id} 
                          className="hover:bg-gray-750"
                        >
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {formatDate(new Date(tx.timestamp))}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400">
                            <button 
                              onClick={() => copyToClipboard(tx.id)} 
                              className="hover:text-blue-300 flex items-center"
                              title="Click to copy"
                            >
                              {shortenTxId(tx.id)}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-300">
                            {tx.betAmount} <span className="text-xs text-gray-400">TARDI</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {tx.winAmount > 0 ? (
                              <span className="text-green-400">{tx.winAmount} <span className="text-xs">TARDI</span></span>
                            ) : (
                              <span className="text-gray-500">0</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {tx.multiplier > 1 ? (
                              <span className="text-purple-400">{tx.multiplier}x</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span 
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                tx.status === 'jackpot' 
                                  ? 'bg-yellow-900/50 text-yellow-400' 
                                  : tx.status === 'win' 
                                  ? 'bg-green-900/50 text-green-400' 
                                  : 'bg-red-900/50 text-red-400'
                              }`}
                            >
                              {tx.status === 'jackpot' ? 'JACKPOT' : tx.status === 'win' ? 'WIN' : 'LOSE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 bg-gray-900 border-t border-gray-700 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="ghost"
                        size="small"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="ghost"
                        size="small"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-400">
                <p>Transaction history shows your last 30 days of gameplay.</p>
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default HistoryPage;