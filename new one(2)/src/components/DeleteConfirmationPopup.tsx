import React from 'react';

interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
  itemType?: 'chat' | 'project';
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDarkMode,
  itemType = 'chat'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      <div className={`relative z-[10000] w-[400px] rounded-2xl shadow-xl p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-medium mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Delete {itemType}?
        </h3>
        <p className={`mb-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2  rounded-lg ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
