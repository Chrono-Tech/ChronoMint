/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './style.scss'

export default class Slider extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    disabled: PropTypes.bool,
    cyan: PropTypes.bool,
  }

  render () {
    const { disabled, cyan, value } = this.props
    return (
      <div className={'slider editable pinned pressed ' + (disabled ? 'disabled ' : '') + (cyan ? 'cyan ' : '')}>
        <div className='container'>
          <div className='knob' style={{ left: 'calc(' + (value * 100) + '% - 1.6rem)' }}>
            <div className='innerknob' data-value={(value * 100) + '%'} />
          </div>
          <div className='progress'>
            <div className='linear innerprogress'>
              <div>
                <span className='value' style={{ transform: 'scaleX(' + value + ')' }} />
              </div>
            </div>
            <div className='snaps'>
              <div className='snap' />
              <div className='snap' />
              <div className='snap' />
              <div className='snap' />
              <div className='snap' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

