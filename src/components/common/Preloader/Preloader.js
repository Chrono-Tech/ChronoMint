import { CircularProgress } from 'material-ui'
import React from 'react'
import PropTypes from 'prop-types'
import './Preloader.scss'

function Preloader (props) {
  return (
    <div styleName='root' className='Preloader__root'>
      <CircularProgress size={props.size || 24} thickness={1.5} />
    </div>
  )
}

Preloader.propTypes = {
  size: PropTypes.number,
}


export default Preloader
