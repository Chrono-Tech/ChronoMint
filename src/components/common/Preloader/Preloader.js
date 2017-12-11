import { CircularProgress } from 'material-ui'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './Preloader.scss'

const PRESETS = {
  normal: {
    size: 24,
    thickness: 1.5,
  },
  medium: {
    size: 22,
    thickness: 1.5,
  },
  small: {
    size: 16,
    thickness: 0.7,
  },
}

const DEFAULT_PRESET = 'normal'

export default class Preloader extends PureComponent {
  static propTypes = {
    small: PropTypes.bool,
    medium: PropTypes.bool,
  }

  getPreset () {
    if (this.props.small) {
      return 'small'
    }
    if (this.props.medium) {
      return 'medium'
    }
    return DEFAULT_PRESET
  }

  render () {
    const preset = PRESETS[ this.getPreset() ]
    return (
      <div styleName='root' className='Preloader__root'>
        <CircularProgress {...preset} />
      </div>
    )
  }
}
