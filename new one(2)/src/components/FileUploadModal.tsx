import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { processFileUpload } from '../services/fileStorage/fileUtils';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
  isDarkMode: boolean;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onFileUpload, isDarkMode }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      
      for (const file of acceptedFiles) {
        const updateProgress = () => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        };
        const progressInterval = setInterval(updateProgress, 200);

        await processFileUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Call parent handler and auto-close after successful upload
        onFileUpload(acceptedFiles);
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          onClose();
        }, 1000); // Give time to show 100% completion
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onFileUpload, onClose]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],  // All image formats
      'application/pdf': ['.pdf'],                    // PDF files
      'text/*': ['.txt', '.md'],                     // Text files and Markdown
      'application/msword': ['.doc'],                // MS Word (old format)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']  // MS Word (new format)
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-md rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-medium">Upload File</h3>
          {!isUploading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Upload Area */}
        <div className="p-6">
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? isDarkMode 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-blue-500 bg-blue-50'
                  : isDarkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                <div className="space-y-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Drag & drop a file here, or click to select
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Supported files: Images, PDF, DOC, DOCX, TXT
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end space-x-3">
            {!isUploading && (
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
