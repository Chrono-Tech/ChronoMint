import { CircularProgress } from 'material-ui'
import React, { Component } from 'react'

import './Preloader.scss'

class Preloader extends Component {
  render() {
    return (
      <div styleName='root'>
        <CircularProgress size={24} thickness={1.5} />
      </div>
    )
  }
}

export default Preloader
