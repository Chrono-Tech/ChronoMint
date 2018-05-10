/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { Checkbox, MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import theme from 'styles/themes/default'
import BackButton from '../../components/BackButton/BackButton'
import styles from '../../components/stylesLoginPage'
import Warning from '../../components/Warning/Warning'
import './GenerateMnemonic.scss'
import { Button } from '../../settings'

class GenerateMnemonic extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func,
  }

  constructor () {
    super()
    this.state = {
      isConfirmed: false,
      mnemonicKey: mnemonicProvider.generateMnemonic(),
    }
  }

  componentWillMount () {
    this.setState({ mnemonicKey: mnemonicProvider.generateMnemonic() })
  }

  componentWillUnmount () {
    this.setState({ mnemonicKey: '' })
  }

  handleCheckClick = (target, value) => {
    this.setState({ isConfirmed: value })
  }

  render () {
    const { isConfirmed, mnemonicKey } = this.state

    return (
      <div>
        <BackButton
          onClick={() => this.props.onBack()}
          to='loginWithMnemonic'
        />
        <MuiThemeProvider muiTheme={theme}>
          <div styleName='root'>
            <div styleName='keyBox'>
              <div styleName='keyLabel'><Translate value='GenerateMnemonic.generateMnemonic' /></div>
              <div styleName='keyValue'>{mnemonicKey}</div>
            </div>
            <div styleName='message'><Translate value='GenerateMnemonic.warning' dangerousHTML /></div>
            <Warning />
            <div styleName='actions'>
              <div styleName='actionConfirm'>
                <Checkbox
                  onCheck={this.handleCheckClick}
                  label={<Translate value='GenerateMnemonic.iUnderstand' />}
                  checked={isConfirmed}
                  {...styles.checkbox}
                />
              </div>
              <Button
                label={<Translate value='GenerateMnemonic.continue' />}
                disabled={!isConfirmed}
                onTouchTap={() => this.props.onBack()}
              />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default GenerateMnemonic
