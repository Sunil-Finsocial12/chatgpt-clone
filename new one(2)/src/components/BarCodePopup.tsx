import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createPortal } from 'react-dom';

interface BarCodePopupProps {
  websiteUrl: string;
  text: React.ReactNode;
  isDarkMode?: boolean;
}

const BarCodePopup: React.FC<BarCodePopupProps> = ({ websiteUrl, text, isDarkMode = false }) => {
  const [showQR, setShowQR] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowQR(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <button
        className={`w-full flex items-center p-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'text-gray-300 hover:bg-gray-800' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setShowQR(!showQR)}
      >
        {text}
      </button>
      
      {showQR && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]"
          onClick={() => setShowQR(false)}
        >
          <div 
            ref={popupRef}
            className={`w-[400px] p-6 rounded-xl shadow-2xl transform transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800/95' : 'bg-gray-900/95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Scan QR Code</h2>
              <button 
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg flex justify-center">
              <QRCodeSVG
                value={websiteUrl}
                size={250}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-4 text-center text-gray-300 text-sm">
              Scan to visit
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BarCodePopup;