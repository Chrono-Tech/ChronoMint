import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlatButton, FontIcon } from 'material-ui'
import styles from '../../../../styles'
import { generateMnemonic } from '../../../../network/mnemonicProvider'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import './GenerateMnemonic.scss'

class GenerateMnemonic extends Component {
  render () {
    const newMnemonicKey = generateMnemonic()

    return (
      <div styleName='root'>
        <div styleName='keyBox'>
          <div styleName='keyLabel'>New mnemonic key generated:</div>
          <div styleName='keyValue'>{newMnemonicKey}</div>
        </div>
          <div styleName='message'>You need copy this <b>Mnemonic key</b> to access this wallet in the future.</div>
          <div styleName='warningBox'>
            <div styleName='warningIcon'>
              <FontIcon className='material-icons' style={styles.icon}>folder</FontIcon></div>
            <div styleName='warningText'>Keep it safe!<br />
              Make a backup!<br />
              Don't share it with anyone!<br />
              Don't lose it! It cannot be recovered if you lose it.</div>
          </div>
          <FlatButton
            label='Back'
            onTouchTap={this.props.onBack}
            style={styles.backBtn}
            icon={<ArrowBack />} />
      </div>
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
