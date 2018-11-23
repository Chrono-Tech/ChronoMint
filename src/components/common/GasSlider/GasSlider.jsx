/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Slider from '@material-ui/lab/Slider'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { getGasPriceMultiplier } from '@chronobank/core/redux/session/selectors'
import { ETH } from '@chronobank/core/dao/constants'
import { FEE_RATE_MULTIPLIER } from '@chronobank/core/redux/wallets/constants'
import { changeGasSlideValue } from '@chronobank/core/redux/session/thunks'
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
      dispatch(changeGasSlideValue(value, token.blockchain()))
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
    handleChange: PropTypes.func,
    value: PropTypes.number,
    token: PropTypes.instanceOf(TokenModel),
    hideTitle: PropTypes.bool,
    disabled: PropTypes.bool,
    initialValue: PropTypes.number,
  }

  constructor (args) {
    super(args)

    this.state = {
      localValue: this.props.initialValue || this.props.value,
      isOpen: false,
    }
  }

  handleSliderMove = (e, value) => {
    this.setState({ localValue: value })
    this.props.handleChange(value, this.props.token)
  }

  handelOpenToggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render () {
    return (
      <div styleName='root' className='GasSlider__root'>
        <button styleName={classnames('title', { 'isOpen': this.state.isOpen })} onClick={this.handelOpenToggle}>
          <div styleName='text'>
            <Translate
              value={`${prefix}.fee`}
              symbol={ETH}
              amount={10}
              amountUSD={10}
            />
          </div>
          <div styleName='arrow' className='chronobank-icon'>drop-2</div>
        </button>
        <div styleName={classnames('sliderWrapper', { 'isOpen': this.state.isOpen })}>
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
      </div>
    )
  }
}
