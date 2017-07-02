import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, RaisedButton } from 'material-ui'
import styles from '../styles'
import { generateMnemonic } from '../../../../network/mnemonicProvider'
import { MuiThemeProvider } from 'material-ui'
import theme from '../../../../styles/themes/default'
import Warning from '../Warning/Warning'
import './GenerateMnemonic.scss'

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
          <Warning />
          <div styleName='actions'>
            <div styleName='actionConfirm'>
              <Checkbox
                onCheck={this.handleCheckClick}
                label='I understand'
                checked={isConfirmed}
                {...styles.checkbox}
              />
            </div>
            <RaisedButton
              label='Continue'
              primary
              disabled={!isConfirmed}
              onTouchTap={this.props.onBack}
              style={styles.primaryButton} />
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
