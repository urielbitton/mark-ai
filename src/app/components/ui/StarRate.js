import React, { useState } from 'react'

export default function StarRate({numOfStars, rating, setRating}) {

  const [hoveredStar, setHoveredStar] = useState(null)

  const starsRender = Array.from({length: numOfStars}).map((star, index) => {
    const starNum = index + 1
    return (
      <i
        key={index}
        className={`fa-star ${hoveredStar ? hoveredStar >= starNum ? 'fas' : 'fal' : Math.round(rating) < starNum ? 'fal' : 'fas'}`}
        onClick={() => setRating(starNum)}
        onMouseEnter={() => setHoveredStar(starNum)}
        onMouseLeave={() => setHoveredStar(null)}
      />
    )
  })

  return <div className="star-rate">
    {starsRender}
  </div>
}
