/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import Slider from 'components/common/Slider'
import PropTypes from 'prop-types'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import React, { PureComponent } from 'react'
import './LaborXConnectSlider.scss'

export default class LaborXConnectSlider extends PureComponent {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    toFixed: PropTypes.number,
  }

  render () {
    const theme = createMuiTheme({
      MuiSlider: {
        track: {
          height: 20,
        },
        thumb: {
          height: 20,
        },
      },
    })

    return (
      <div styleName='root'>
        <MuiThemeProvider theme={theme}>
          <Slider {...this.props} />
        </MuiThemeProvider>
      </div>
    )
  }
}
