/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SliderMaterial from '@material-ui/lab/Slider'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import BigNumber from 'bignumber.js'
import Amount from '@chronobank/core/models/Amount'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import PropTypes from 'prop-types'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { ETH } from '@chronobank/core/dao/constants'
import classes from './GasSlider.scss'
import { prefix } from './lang'
import Preloader from '../Preloader/Preloader'

function mapStateToProps (state, ownProps) {
  const token = ownProps.token || state.get(DUCK_TOKENS).item(ETH)
  return {
    token,
  }
}

@connect(mapStateToProps)
export default class GasSlider extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    token: PropTypes.instanceOf(TokenModel),
    hideTitle: PropTypes.bool,
    disabled: PropTypes.bool,
    initialValue: PropTypes.number,
    gasFee: PropTypes.instanceOf(Amount),
    gasPrice: PropTypes.instanceOf(Amount),
    feeLoading: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
  }

  constructor (args) {
    super(args)

    this.state = {
      isOpen: false,
    }
  }

  handleChange = (e, v) => {
    return this.props.input.onChange(parseFloat((v).toFixed(1)))
  }

  handelOpenToggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  renderAmount () {
    if (this.props.feeLoading) {
      return <Preloader />
    }
    if (this.props.gasFee) {
      return (
        <Translate
          value={`${prefix}.fee`}
          symbol={this.props.gasFee ? this.props.gasFee.symbol() : ETH}
          amount={this.props.gasFee ? this.props.token.removeDecimals(this.props.gasFee).toNumber() : 0}
        />
      )
    } else {
      return (
        <Translate value={`${prefix}.invalidForm`} />
      )
    }
  }

  render () {
    const { input, min, max, step, gasPrice } = this.props
    return (
      <div styleName='root' className='GasSlider__root'>
        <button
          styleName={classnames('title', { 'isOpen': this.state.isOpen })}
          onClick={this.handelOpenToggle}
        >
          <div styleName='text'>
            {this.renderAmount()}
          </div>
          <div styleName='arrow' className='chronobank-icon'>drop-2</div>
        </button>
        <div styleName={classnames('sliderWrapper', { 'isOpen': this.state.isOpen })}>
          <div styleName='tagsWrap' className='GasSlider__tagsWrap'>
            <div><Translate value={`${prefix}.slow`} /></div>
            <div styleName='separator' />
            <div><Translate value={`${prefix}.fast`} /></div>
          </div>
          <SliderMaterial
            {...input}
            value={input.value}
            onChange={this.handleChange}
            min={min}
            max={max}
            step={step}
            classes={{
              root: classes.slider,
            }}

          />
          <div styleName='gasPriceDescription'>
            <Translate
              value={`${prefix}.gasPrice`}
              multiplier={input.value}
              total={new BigNumber(input.value)
                .mul(gasPrice ? web3Converter.fromWei(gasPrice, 'gwei') : 0)
                .toFixed(2)}
            />
          </div>
        </div>
      </div>
    )
  }
}
