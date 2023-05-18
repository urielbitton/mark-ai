import React from 'react'
import './styles/PhotoModal.css'

export default function PhotoModal({ img, onClose, showModal }) {
  return (
    <div 
      className={`photo-modal-container ${showModal ? 'show' : ''}`}
      onMouseDown={onClose}
    >
      <i 
        className="fal fa-times" 
        onClick={onClose} 
      />
      <div 
        className="photo-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img src={img} alt="modal img" />
      </div>
    </div>
  )
}
