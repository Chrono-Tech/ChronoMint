/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import SliderMaterial from '@material-ui/lab/Slider'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import React, { PureComponent } from 'react'

const styles = {
  slider: {},
  thumb: {
    height: '0',
    width: '0',
    top: '16px',
    border: '10px solid transparent',
    borderBottom: '10px solid #3f51b5',
    borderRadius: '0',
    background: 'transparent',
    '&$focused': {
      borderBottomColor: '#FFB54E',
    },
  },
  track: {
    height: '30px',
    borderRadius: '14px',
  },
  trackAfter: {
    width: '100% !important',
  },
  amount: {
    textAlign: 'center',
    paddingTop: '30px',
    paddingBottom: '10px',
  },
  amountSelected: {
    color: '#5F4CBA',
    fontWeight: '700',
  },
}

class LaborXConnectSlider extends PureComponent {
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
    const { classes, input, min, max, step } = this.props

    return (
      <div>
        <div className={classes.amount}>
          <span className={classes.amountSelected}>TIME 100.00</span>
          <span> / 10,000.00</span>
        </div>
        <SliderMaterial
          classes={{
            container: classes.slider,
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
      </div>
    )
  }
}

export default withStyles(styles)(LaborXConnectSlider)
