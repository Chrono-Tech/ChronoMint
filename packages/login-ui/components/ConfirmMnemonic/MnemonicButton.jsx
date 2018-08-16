/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/common/ui/Button/Button'
import './MnemonicButton.scss'

/**
 * This class is used only in ConfirmMnemonic component
 */
export default class MnemonicButton extends PureComponent {
  static propTypes = {
    isWordSelected: PropTypes.bool,
    mnemonicWord: PropTypes.string,
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.mnemonicWord)

  render () {
    const {
      isWordSelected,
      mnemonicWord,
    } = this.props

    return (
      <Button
        key={mnemonicWord}
        onClick={this.handleClick}
        styleName='word'
        disabled={isWordSelected}
      >
        { mnemonicWord }
      </Button>
    )
  }
}
