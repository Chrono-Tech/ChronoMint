import React from 'react'
import './style.scss'

const Label = ({count}) => {
  return (
    <span className='label-count'>
      {count}
    </span>
  )
}

export default Label
