import React, { useEffect, useState } from 'react'
import './styles/PhotoModal.css'
import { useLocation } from "react-router-dom"

export default function PhotoModal({ img, onClose, showModal, slideshow=null, slideShowIndex=0 }) {

  const [activeImgIndex, setActiveImgIndex] = useState(slideShowIndex)
  const location = useLocation()

  const slideLeft = () => {
    if (activeImgIndex === 0) {
      return setActiveImgIndex(slideshow.length - 1)
    }
    return setActiveImgIndex(prev => prev - 1)
  }

  const slideRight = () => {
    if (activeImgIndex === (slideshow.length - 1)) {
      return setActiveImgIndex(0)
    }
    return setActiveImgIndex(prev => prev + 1)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const handleArrowKeys = (e) => {
      if (!slideshow) return
      if (e.key === 'ArrowRight')
        slideRight()
      if (e.key === 'ArrowLeft')
        slideLeft()
    }

    window.addEventListener('keyup', handleKeyDown)
    window.addEventListener('keyup', handleArrowKeys)
    return () => {
      window.removeEventListener('keyup', handleKeyDown)
      window.removeEventListener('keyup', handleArrowKeys)
    }
  }, [activeImgIndex])

  useEffect(() => {
    setActiveImgIndex(slideShowIndex)
  }, [slideShowIndex])

  useEffect(() => {
    setActiveImgIndex(0)
    onClose()
  },[location])

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
      {
        slideshow &&
        <div 
          className="slideshow-controls"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <i
            className="far fa-chevron-left"
            onClick={slideLeft}
          />
          <i
            className="far fa-chevron-right"
            onClick={slideRight}
          />
        </div>
      }
    </div>
  )
}
