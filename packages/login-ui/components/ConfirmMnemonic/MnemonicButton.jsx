/**
 * Copyright 2017–2019, LaborX PTY
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
    isWordUsed: PropTypes.bool,
    mnemonicWordItem: PropTypes.shape({
      index: PropTypes.number,
      word: PropTypes.string,
    }),
    onClick: PropTypes.func,
  }

  handleClick = () => this.props.onClick(this.props.mnemonicWordItem)

  render () {
    const {
      isWordUsed,
      mnemonicWordItem,
    } = this.props

    return (
      <Button
        onClick={this.handleClick}
        styleName='word'
        disabled={isWordUsed}
      >
        { mnemonicWordItem.word }
      </Button>
    )
  }
}
