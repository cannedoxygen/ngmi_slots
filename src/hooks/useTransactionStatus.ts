// src/hooks/useTransactionStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { useSuiWallet } from './useSuiWallet';

type TransactionStatus = 'pending' | 'success' | 'failed' | null;

export const useTransactionStatus = (transactionId: string | null) => {
  const [status, setStatus] = useState<TransactionStatus>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const { connected } = useSuiWallet();

  // Function to check transaction status
  const checkStatus = useCallback(async () => {
    if (!transactionId || !connected) {
      setStatus(null);
      setError(null);
      setDetails(null);
      return;
    }

    try {
      // In a real implementation, this would query the blockchain
      // For now, we'll simulate a response
      
      // Simulate network delay (shorter for development)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For simulation, we'll use random status (mostly success)
      const statuses: TransactionStatus[] = ['pending', 'success', 'failed'];
      const weights = [0.2, 0.7, 0.1]; // 20% pending, 70% success, 10% failed
      
      const randomValue = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus: TransactionStatus = 'pending';
      
      // Select a status based on weighted probability
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
          selectedStatus = statuses[i];
          break;
        }
      }
      
      // For the first check, always return pending to simulate processing time
      if (status === null) {
        setStatus('pending');
        
        // After a short delay, update to the selected status
        setTimeout(() => {
          setStatus(selectedStatus);
          
          if (selectedStatus === 'success') {
            // Generate mock transaction details
            setDetails({
              timestamp: Date.now(),
              events: [
                {
                  type: 'ngmi_slots::spin_result',
                  fields: {
                    player: '0x...',
                    bet_amount: Math.floor(Math.random() * 100) + 5,
                    win_amount: Math.floor(Math.random() * 300),
                    timestamp: Date.now()
                  }
                }
              ]
            });
          } else if (selectedStatus === 'failed') {
            setError('Transaction execution failed');
          }
        }, 3000);
      } else {
        setStatus(selectedStatus);
      }
    } catch (err: any) {
      console.error('Error checking transaction status:', err);
      setError(err.message || 'Failed to check transaction status');
      setStatus('failed');
    }
  }, [transactionId, connected, status]);

  // Check status when transaction ID changes
  useEffect(() => {
    if (transactionId) {
      checkStatus();
    } else {
      setStatus(null);
      setError(null);
      setDetails(null);
    }
  }, [transactionId, checkStatus]);

  return {
    status,
    error,
    details,
    isComplete: status === 'success' || status === 'failed',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isFailed: status === 'failed',
    checkStatus
  };
};

export default useTransactionStatus;