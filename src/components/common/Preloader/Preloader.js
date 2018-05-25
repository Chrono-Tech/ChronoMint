/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CircularProgress } from 'material-ui'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './Preloader.scss'

const PRESETS = {
  big: {
    size: 30,
    thickness: 2,
  },
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
    big: PropTypes.bool,
  }

  getPreset () {
    if (this.props.big) {
      return 'big'
    }
    if (this.props.small) {
      return 'small'
    }
    if (this.props.medium) {
      return 'medium'
    }
    return DEFAULT_PRESET
  }

  render () {
    const preset = PRESETS[this.getPreset()]
    return (
      <div styleName='root' className='Preloader__root'>
        <CircularProgress {...preset} />
      </div>
    )
  }
}
