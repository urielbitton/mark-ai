import { useEffect, useState } from "react"

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