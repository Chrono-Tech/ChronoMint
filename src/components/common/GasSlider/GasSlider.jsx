/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SliderMaterial from '@material-ui/lab/Slider'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import { Field } from 'redux-form/immutable'
import Amount from '@chronobank/core/models/Amount'
import PropTypes from 'prop-types'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { ETH } from '@chronobank/core/dao/constants'
import classes from './GasSlider.scss'
import { prefix } from './lang'

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
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    toFixed: PropTypes.number,
  }

  constructor (args) {
    super(args)

    this.state = {
      localValue: this.props.value || this.props.initialValue || 1,
      isOpen: false,
    }
  }

  handleChange = (e, v) => {
    if (this.props.toFixed !== null && this.props.toFixed !== undefined) {
      v = v.toFixed(this.props.toFixed)
    }
    return this.props.input.onChange(parseFloat(v))
  }

  handelOpenToggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render () {
    const { input, min, max, step } = this.props
    return (
      <div styleName='root' className='GasSlider__root'>
        <button
          styleName={classnames('title', { 'isOpen': this.state.isOpen })}
          onClick={this.handelOpenToggle}
        >
          <div styleName='text'>
            {this.props.gasFee
              ? (
                <Translate
                  value={`${prefix}.fee`}
                  symbol={this.props.gasFee ? this.props.gasFee.symbol() : ETH}
                  amount={this.props.gasFee ? this.props.gasFee.toNumber() : 0}
                />
              ) : (
                <Translate value={`${prefix}.invalidForm`} />
              )}

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
              multiplier={this.state.localValue}
              total={Number((this.state.localValue * this.props.token.feeRate()).toFixed(1))}
            />
          </div>
        </div>
      </div>
    )
  }
}
