// Modal.js
import React from 'react';
import './Modal.css'; // Ensure you have your CSS file

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
}

export default Modal;
