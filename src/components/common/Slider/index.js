/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import SliderMaterial from '@material-ui/lab/Slider'
import './style.scss'

export default class Slider extends PureComponent {
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
    const { meta, input, min, max, step } = this.props
    return (
      <div styleName='root'>
        <SliderMaterial {...input} onChange={this.handleChange} min={min} max={max} step={step} />
        {meta.touched && meta.error &&
        <span styleName='error'>{meta.error}</span>}
      </div>
    )
  }
}

