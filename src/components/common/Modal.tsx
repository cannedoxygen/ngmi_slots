// src/components/common/Modal.tsx
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && onClose && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle click outside of modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClose && modalRef.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`${sizeClasses[size]} w-full bg-gray-800 border border-blue-900/50 rounded-lg shadow-xl shadow-blue-900/20 overflow-hidden transform transition-all`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h3 id="modal-title" className="text-lg font-medium text-white">
            {title}
          </h3>
          
          {onClose && (
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;