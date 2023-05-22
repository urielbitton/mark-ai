import { useEffect, useRef, useState } from "react"

export const useIsFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const fullScreenDetect = () => {
      window.addEventListener('resize', () => {
        if (window.screenTop || window.screenY) {
          setIsFullScreen(true)
        }
        else {
          setIsFullScreen(false)
        }
      })
    }
    fullScreenDetect()
    return () => fullScreenDetect()
  }, [])

  return isFullScreen
}

export const useViewportObserver = (ref) => {

  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.5 } // Adjust threshold as needed
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return isIntersecting
}