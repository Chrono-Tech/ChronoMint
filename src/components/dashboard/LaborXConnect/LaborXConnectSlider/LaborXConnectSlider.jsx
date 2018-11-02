/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import SliderMaterial from '@material-ui/lab/Slider'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { prefix } from '../lang'
import classes from './LaborXConnectSlider.scss'

export default class LaborXConnectSlider extends PureComponent {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    toFixed: PropTypes.number,
  }
  handleChange = (e, v) => {
    if (this.props.toFixed !== null && this.props.toFixed !== undefined) {
      v = v.toFixed(this.props.toFixed)
    }
    return this.props.input.onChange(parseFloat(v))
  }

  render () {
    const { input, min, max, step } = this.props

    return (
      <div>
        <div styleName='amount'>
          <span styleName='amountSelected'>TIME 100.00</span>
          <span> / 10,000.00</span>
        </div>
        <SliderMaterial
          classes={{
            container: classes.slider,
            trackBefore: classes.trackBefore,
            track: classes.track,
            trackAfter: classes.trackAfter,
            thumb: classes.thumb,
          }}
          {...input}
          onChange={this.handleChange}
          min={min}
          max={max}
          step={step}
        />
        <button styleName='max'>
          <Translate value={`${prefix}.max`} />
        </button>
      </div>
    )
  }
}
