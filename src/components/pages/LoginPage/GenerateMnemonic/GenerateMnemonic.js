import { Checkbox, RaisedButton } from 'material-ui'
import { MuiThemeProvider } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'

import BackButton from '../BackButton/BackButton'
import { generateMnemonic } from '../../../../network/mnemonicProvider'
import styles from '../stylesLoginPage'
import theme from '../../../../styles/themes/default'
import Warning from '../Warning/Warning'

import './GenerateMnemonic.scss'

class GenerateMnemonic extends PureComponent {
  static propTypes = {
    onBack: PropTypes.func,
  }

  constructor () {
    super()
    this.state = {
      isConfirmed: false,
      mnemonicKey: generateMnemonic(),
    }
  }

  componentWillMount () {
    this.setState({ mnemonicKey: generateMnemonic() })
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
              <RaisedButton
                label={<Translate value='GenerateMnemonic.continue' />}
                primary
                disabled={!isConfirmed}
                onTouchTap={() => this.props.onBack()}
                style={styles.primaryButton}
              />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default GenerateMnemonic
