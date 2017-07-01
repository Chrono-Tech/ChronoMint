import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, RaisedButton } from 'material-ui'
import styles from '../../../../styles'
import { generateMnemonic } from '../../../../network/mnemonicProvider'
import './GenerateMnemonic.scss'
import { MuiThemeProvider } from 'material-ui'
import theme from '../../../../styles/themes/default'
import WarningIcon from 'material-ui/svg-icons/alert/error'

class GenerateMnemonic extends Component {
  constructor () {
    super()
    this.state = {
      isConfirmed: false,
      mnemonicKey: ''
    }
  }

  componentWillMount () {
    this.setState({mnemonicKey: generateMnemonic()})
  }

  handleCheckClick = (target, value) => {
    this.setState({isConfirmed: value})
  }

  render () {
    const {isConfirmed, mnemonicKey} = this.state

    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName='root'>
          <div styleName='keyBox'>
            <div styleName='keyLabel'>New mnemonic key generated:</div>
            <div styleName='keyValue'>{mnemonicKey}</div>
          </div>
          <div styleName='message'>You need copy this <b>Mnemonic key</b> to access this wallet in the future.</div>
          <div styleName='warningBox'>
            <div styleName='warningIcon'>
              <WarningIcon color='#ff1744' style={styles.warningIcon} />
            </div>
            <div styleName='warningText'>Keep it safe!<br />
              Make a backup!<br />
              Don't share it with anyone!<br />
              Don't lose it! It cannot be recovered if you lose it.
            </div>
          </div>
          <div styleName='actions'>
            <div styleName='actionConfirm'>
              <Checkbox
                onCheck={this.handleCheckClick}
                label='I understand'
                labelStyle={styles.checkboxLabel}
                checked={isConfirmed}
              />
            </div>
            <RaisedButton
              label='Continue'
              primary
              disabled={!isConfirmed}
              onTouchTap={this.props.onBack} />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

GenerateMnemonic.propTypes = {
  step: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  onBack: PropTypes.func
}

export default GenerateMnemonic
