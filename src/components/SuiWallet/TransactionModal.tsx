// src/components/SuiWallet/TransactionModal.tsx
import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useTransactionStatus } from '../../hooks/useTransactionStatus';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
  action: string;
  amount?: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  action,
  amount
}) => {
  const { status, error } = useTransactionStatus(transactionId);

  const renderContent = () => {
    if (!transactionId) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-400">Preparing transaction...</p>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="text-center py-6 space-y-4">
          <Loader size="medium" />
          <p className="text-blue-300 font-medium">Transaction in progress</p>
          <p className="text-gray-400 text-sm">Please wait while the transaction is being processed.</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-400 font-medium">Transaction successful!</p>
          {amount && <p className="text-gray-300">{amount} TARDI</p>}
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-xs text-gray-400">Transaction ID:</p>
            <p className="text-xs text-blue-400 break-all">{transactionId}</p>
          </div>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 font-medium">Transaction failed</p>
          {error && <p className="text-gray-400 text-sm">{error}</p>}
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-xs text-gray-400">Transaction ID:</p>
            <p className="text-xs text-blue-400 break-all">{transactionId}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-6">
        <p className="text-gray-400">Unknown transaction status</p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={status !== 'pending' ? onClose : undefined}
      title={`${action} Transaction`}
    >
      {renderContent()}
      
      {status && status !== 'pending' && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default TransactionModal;