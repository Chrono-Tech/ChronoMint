import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Slider } from 'material-ui'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DUCK_SESSION, GAS_SLIDER_MULTIPLIER_CHANGE } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenModel from 'models/tokens/TokenModel'
import './GasSlider.scss'
import { prefix } from './lang'

const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

function mapStateToProps (state) {
  const token = state.get(DUCK_TOKENS).item('ETH')
  const gasSliderCollection = state.get(DUCK_SESSION).gasPriceMultiplier

  return {
    value: gasSliderCollection.get(token.id()) || 1,
    token,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleChange: (token) => (e, value) => {
      dispatch({ type: GAS_SLIDER_MULTIPLIER_CHANGE, value, id: token.id() })
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GasSlider extends PureComponent {
  static propTypes = {
    handleChange: PropTypes.func,
    value: PropTypes.number,
    token: PropTypes.instanceOf(TokenModel),
    onDragStop: PropTypes.func,
    hideTitle: PropTypes.bool,
  }

  handleDragStop () {
    const { onDragStop } = this.props
    if (onDragStop) {
      onDragStop()
    }
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
          sliderStyle={{ marginBottom: 0, marginTop: 5 }}
          value={this.props.value}
          {...FEE_RATE_MULTIPLIER}
          onChange={this.props.handleChange(this.props.token)}
          onDragStop={this.handleDragStop}
        />
        <div styleName='gasPriceDescription'>
          <Translate
            value={`${prefix}.gasPrice`}
            multiplier={this.props.value.toFixed(1)}
            total={Number((this.props.value * this.props.token.feeRate()).toFixed(1))}
          />
        </div>
      </div>
    )
  }
}

