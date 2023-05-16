import React from 'react'

export default function ImgSkeleton({ loading, ...props}) {

  const { className='', width='95%', height='95%', round=false } = props

  return loading ? (
    <div 
      className={`img-skeleton ${className}`} 
      style={{ width, height, borderRadius: round ? '100%' : '5px' }}
    />
  ) :
  null
}
