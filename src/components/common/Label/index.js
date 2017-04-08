import React from 'react'
import './style.scss'

const Label = ({count}) => {
  if (!count) return null
  return (
    <span className='label-count'>
      {count}
    </span>
  )
}

export default Label
