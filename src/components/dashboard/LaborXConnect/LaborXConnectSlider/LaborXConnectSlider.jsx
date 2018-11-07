/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import SliderMaterial from '@material-ui/lab/Slider'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import Amount from '@chronobank/core/models/Amount'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import { prefix } from '../lang'
import classes from './LaborXConnectSlider.scss'

export default class LaborXConnectSlider extends PureComponent {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    toFixed: PropTypes.number,
    token: PropTypes.instanceOf(TokenModel),
  }
  handleChange = (e, v) => {
    if (this.props.toFixed !== null && this.props.toFixed !== undefined) {
      v = v.toFixed(this.props.toFixed)
    }
    return this.props.input.onChange(parseFloat(v))
  }

  handleMax = () => {
    return this.handleChange(null, this.props.max)
  }

  render () {
    const { input, min, max, step, token, meta } = this.props
    if (input.value === '') {
      input.value = 0
    }
    const value = new Amount(input.value || min, token.symbol())

    return (
      <div>
        <div styleName='amount'>
          <span styleName='amountSelected'>
            TIME{' '}
            <TokenValueSimple
              value={new Amount(value, token.symbol())}
              withFraction
            />
          </span>
          <span>
            {' '}
            /{' '}
            <TokenValueSimple
              value={new Amount(max, token.symbol())}
              withFraction
            />
          </span>
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
        <button styleName='max' onClick={this.handleMax}>
          <Translate value={`${prefix}.max`} />
        </button>
        {meta.dirty &&
          meta.error && <div styleName='error'>{meta.error}</div>}
      </div>
    )
  }
}
