// import { useState } from "react";
// import { HelpCircle } from "lucide-react"; // Question mark icon

// const FloatingMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState(null); // Track hovered link

//   return (
//     <div className="floating-menu">
//       {/* Question Mark Icon Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="icon-button">
//         <HelpCircle size={24} />
//       </button>

//       {/* Popup Menu */}
//       {isOpen && (
//         <div className="popup-menu">
//           <a
//             href="https://play.google.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             onMouseEnter={() => setHoveredLink("playstore")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             Play Store
//             {hoveredLink === "playstore" && (
//               <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
//             )}
//           </a>
//           <a
//             href="https://www.apple.com/app-store/"
//             target="_blank"
//             rel="noopener noreferrer"
//             onMouseEnter={() => setHoveredLink("appstore")}
//             onMouseLeave={() => setHoveredLink(null)}
//           >
//             App Store
//             {hoveredLink === "appstore" && (
//               <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
//             )}
//           </a>
//           <a href="/terms-and-policies">Terms & Policies</a>
//         </div>
//       )}

//       {/* Styles */}
//       <style jsx>{`
//         .floating-menu {
//           position: fixed;
//           bottom: 20px;
//           right: 20px;
//           z-index: 1000;
//         }

//         .icon-button {
//           color: #333;
//           border: none;
//           padding: 10px;
//           border-radius: 50%;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .popup-menu {
//           position: absolute;
//           bottom: 50px;
//           right: 0;
//           background: #222;
//           color: white;
//           border-radius: 8px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
//           padding: 10px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           min-width: 160px;
//         }

//         .popup-menu a {
//           color: white;
//           text-decoration: none;
//           padding: 8px 12px;
//           display: block;
//           position: relative;
//         }

//         .popup-menu a:hover {
//           background: #333;
//           border-radius: 4px;
//           opacity: 0.8;
//         }

//         .qr-popup {
//           position: absolute;
//           top: 50%;
//           left: -140px; /* Adjusted left position for larger image */
//           transform: translateY(-50%);
//           width: 120px; /* Increased size */
//           height: 120px;
//           border-radius: 8px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//           background: white;
//           padding: 5px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FloatingMenu;


// import { useState, useEffect, useRef } from "react";
// import { HelpCircle } from "lucide-react"; // Question mark icon

// const FloatingMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const menuRef = useRef(null); // Reference for detecting outside clicks

//   // Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <div className="floating-menu">
//       {/* Question Mark Icon Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="icon-button">
//         <HelpCircle size={24} />
//       </button>

//       {/* Popup Menu */}
//       <div ref={menuRef} className={`popup-menu ${isOpen ? "open" : ""}`}>
//         <a
          
//           target="_blank"
//           rel="noopener noreferrer"
//           onMouseEnter={() => setHoveredLink("playstore")}
//           onMouseLeave={() => setHoveredLink(null)}
//         >
//           Play Store
//           {hoveredLink === "playstore" && (
//             <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
//           )}
//         </a>
//         <a
          
//           target="_blank"
//           rel="noopener noreferrer"
//           onMouseEnter={() => setHoveredLink("appstore")}
//           onMouseLeave={() => setHoveredLink(null)}
//         >
//           App Store
//           {hoveredLink === "appstore" && (
//             <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
//           )}
//         </a>
//         <a href="/terms-and-policies">Terms & Policies</a>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .floating-menu {
//           position: fixed;
//           bottom: 20px;
//           right: 20px;
//           z-index: 1000;
//         }

//         .icon-button {
//           color: #333;
//           border: none;
//           padding: 10px;
//           border-radius: 50%;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: white;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .popup-menu {
//           position: absolute;
//           bottom: 50px;
//           right: 0;
//           background: #222;
//           color: white;
//           border-radius: 8px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
//           padding: 10px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           min-width: 160px;
//           opacity: 0;
//           transform: translateY(10px);
//           transition: opacity 0.3s ease, transform 0.3s ease;
//           pointer-events: none;
//         }

//         .popup-menu.open {
//           opacity: 1;
//           transform: translateY(0);
//           pointer-events: auto;
//         }

//         .popup-menu a {
//           color: white;
//           text-decoration: none;
//           padding: 8px 12px;
//           display: block;
//           position: relative;
//         }

//         .popup-menu a:hover {
//           background: #333;
//           border-radius: 4px;
//           opacity: 0.8;
//         }

//         .qr-popup {
//           position: absolute;
//           top: 50%;
//           left: -140px;
//           transform: translateY(-50%);
//           width: 120px;
//           height: 120px;
//           border-radius: 8px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//           background: white;
//           padding: 5px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FloatingMenu;
import { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react"; 
import {useNavigate} from 'react-router-dom'

const FloatingMenu = () => {
  const navigate= useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const menuRef = useRef(null); // Reference for detecting outside clicks

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedQR(null); // Close QR popup as well
      }
    };
    if (isOpen || selectedQR) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, selectedQR]);

  return (
    <div className="floating-menu">
      {/* Question Mark Icon Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="icon-button">
        <HelpCircle size={24} />
      </button>

      {/* Popup Menu */}
      <div ref={menuRef} className={`popup-menu ${isOpen ? "open" : ""}`}>
        <a
          onClick={(e) => {
            e.preventDefault();
            setSelectedQR(selectedQR === "playstore" ? null : "playstore");
          }}
        >
          Play Store
          {selectedQR === "playstore" && (
            <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
          )}
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            setSelectedQR(selectedQR === "appstore" ? null : "appstore");
          }}
        >
          App Store
          {selectedQR === "appstore" && (
            <img src="/Fin-QR.png" alt="Fin-QR Code" className="qr-popup" />
          )}
        </a>
        <a onClick={() => navigate("/terms-and-policies")}>Terms & Policies</a>
      </div>

      {/* Styles */}
      <style>{`
        .floating-menu {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .icon-button {
          color: #333;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .popup-menu {
          position: absolute;
          bottom: 50px;
          right: 0;
          background: #222;
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 160px;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }

        .popup-menu.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .popup-menu a {
          color: white;
          text-decoration: none;
          padding: 8px 12px;
          display: block;
          position: relative;
          cursor: pointer;
        }

        .popup-menu a:hover {
          background: #333;
          border-radius: 4px;
          opacity: 0.8;
        }

        .qr-popup {
          position: absolute;
          top: 50%;
          left: -150px;
          transform: translateY(-50%);
          width: 140px;
          height: 140px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          background: white;
          padding: 5px;
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FloatingMenu;
