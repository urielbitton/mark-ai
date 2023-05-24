import React, { useEffect, useState } from 'react'

export default function TypewriteText({ 
  textArray=null, loopTime=2000, maxLoops=Infinity, className=""
}) {

  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [doneTyping, setDoneTyping] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if(count >= maxLoops) {
      setDoneTyping(true)
      return setDisplayText(textArray[0])
    }
    let index = 0
    let interval
    const animateText = () => {
      setDisplayText(textArray[currentIndex].substring(0, index))
      index++
      if (index > textArray[currentIndex].length) {
        clearInterval(interval)
        setTimeout(() => {
          let eraseIndex = textArray[currentIndex].length
          interval = setInterval(() => {
            if(count === maxLoops-1) return clearInterval(interval)
            setDisplayText(textArray[currentIndex].substring(0, eraseIndex))
            eraseIndex--
            if (eraseIndex < 0) {
              clearInterval(interval)
            }
          }, 120)
          setTimeout(() => {
            setCurrentIndex((currentIndex + 1) % textArray.length)
          }, loopTime)
        }, loopTime) // Adjust the delay between each text
      }
    };
    interval = setInterval(animateText, 120) // Adjust the delay between each character
    setCount(prev => prev + 1)
    return () => clearInterval(interval)
  }, [currentIndex, textArray])

  return <span className={`typewrite ${className} ${doneTyping ? 'done' : ''}`}>{displayText}</span>
}
