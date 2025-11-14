'use client';

import { FC } from 'react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  children: React.ReactNode;
  endpointType?: 'sacha' | 'skills' | 'hobbies' | 'name';
  isEditing?: boolean;
}

const AddModal: FC<AddModalProps> = ({ isOpen, onClose, endpoint, endpointType, isEditing, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 p-6 rounded-2xl bg-gray-800 border border-purple-500/30 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? 
              (endpointType === 'sacha' ? 'Modifier une appréciation' : `Modifier ${endpointType === 'hobbies' || endpointType === 'name' ? 'le' : 'la'} ${endpoint.toLowerCase()}`)
              : (endpointType === 'sacha' ? 'Ajouter une appréciation' : `Ajouter un${endpointType === 'hobbies' || endpointType === 'name' ? ' ' : 'e '}${endpoint.toLowerCase()}`)
            }
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AddModal;
