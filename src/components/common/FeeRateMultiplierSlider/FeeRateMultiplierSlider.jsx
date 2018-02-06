import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Slider } from 'material-ui'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './FeeRateMultiplierSlider.scss'
import { prefix } from './lang'

const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FeeRateMultiplierSlider extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    disabled: PropTypes.bool,
    cyan: PropTypes.bool,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='title'><Translate value={`${prefix}.title`} /></div>
        <div styleName='description'><Translate value={`${prefix}.description`} /></div>
        <div styleName='tagsWrap'>
          <div><Translate value={`${prefix}.slow`} /></div>
          <div><Translate value={`${prefix}.fast`} /></div>
        </div>
        <Slider
          value={0.5}
          sliderStyle={{ marginBottom: 0, marginTop: 5 }}
          {...FEE_RATE_MULTIPLIER}
          onChange={() => {
            // eslint-disable-next-line
            console.log('onChange',)
          }}
          onDragStop={() => {
            // eslint-disable-next-line
            console.log('onDragStop',)
          }}
        />
        <div>
          <small>
            <Translate value={`${prefix}.gasPrice`} />
          </small>
        </div>
      </div>
    )
  }
}

