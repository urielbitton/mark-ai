import React, { useEffect, useState } from 'react'
import './styles/PhotoModal.css'

export default function PhotoModal({ img, onClose, showModal, slideshow, slideShowIndex }) {

  const [activeImgIndex, setActiveImgIndex] = useState(slideShowIndex)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const handleArrowKeys = (e) => {
      if(!slideshow) return
      if (e.key === 'ArrowRight') {
        activeImgIndex === slideshow.length - 1 ? 
        setActiveImgIndex(0)
        : setActiveImgIndex(prev => prev + 1)
      }
      if (e.key === 'ArrowLeft') {
        activeImgIndex === 0 ? 
        setActiveImgIndex(slideshow.length - 1)
        : setActiveImgIndex(prev => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', handleArrowKeys)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', handleArrowKeys)
    }
  }, [])

  useEffect(() => {
    setActiveImgIndex(slideShowIndex)
  }, [slideShowIndex])

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
        {
          !slideshow ?
          <img src={img} alt="modal img" /> :
          <img src={slideshow[activeImgIndex]} alt="slide img" />
        }
      </div>
    </div>
  )
}
