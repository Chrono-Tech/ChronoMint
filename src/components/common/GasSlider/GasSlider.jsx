/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Slider from '@material-ui/lab/Slider'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { GAS_SLIDER_MULTIPLIER_CHANGE } from '@chronobank/core/redux/session/constants'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { getGasPriceMultiplier } from '@chronobank/core/redux/session/selectors'
import { ETH, FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/mainWallet/constants'
import './GasSlider.scss'
import { prefix } from './lang'

let timoutId = null

function mapStateToProps (state, ownProps) {
  const token = ownProps.token || state.get(DUCK_TOKENS).item(ETH)
  return {
    value: getGasPriceMultiplier(token.blockchain())(state),
    token,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    handleChange: (value, token) => {
      if (!ownProps.isLocal) {
        dispatch({ type: GAS_SLIDER_MULTIPLIER_CHANGE, value, id: token.blockchain() })
      }
      if (timoutId) {
        clearTimeout(timoutId)
      }
      if (ownProps.onDragStop) {
        timoutId = setTimeout(() => ownProps.onDragStop(value), 500)
      }
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GasSlider extends PureComponent {
  static propTypes = {
    isLocal: PropTypes.bool,
    handleChange: PropTypes.func,
    value: PropTypes.number,
    token: PropTypes.instanceOf(TokenModel),
    onDragStop: PropTypes.func,
    hideTitle: PropTypes.bool,
    disabled: PropTypes.bool,
    initialValue: PropTypes.number,
  }

  constructor (args) {
    super(args)

    this.state = { localValue: this.props.initialValue || this.props.value }
  }

  handleSliderMove = (e, value) => {
    this.setState({ localValue: value })
    this.props.handleChange(value, this.props.token)
  }

  render () {
    return (
      <div styleName='root' className='GasSlider__root'>
        {!this.props.hideTitle &&
        <div>
          <div styleName='title'><Translate value={`${prefix}.title`} /></div>
          <div styleName='description'><Translate value={`${prefix}.description`} /></div>
        </div>
        }
        <div styleName='tagsWrap' className='GasSlider__tagsWrap'>
          <div><Translate value={`${prefix}.slow`} /></div>
          <div styleName='separator' />
          <div><Translate value={`${prefix}.fast`} /></div>
        </div>
        <Slider
          disabled={this.props.disabled}
          value={this.props.initialValue || this.props.value}
          {...FEE_RATE_MULTIPLIER}
          onChange={this.handleSliderMove}
        />
        <div styleName='gasPriceDescription'>
          <Translate
            value={`${prefix}.gasPrice`}
            multiplier={this.state.localValue.toFixed(1)}
            total={Number((this.state.localValue * this.props.token.feeRate()).toFixed(1))}
          />
        </div>
      </div>
    )
  }
}
