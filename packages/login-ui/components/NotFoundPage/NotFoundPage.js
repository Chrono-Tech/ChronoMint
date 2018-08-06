/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import Button from 'components/common/ui/Button/Button'
import {
  navigateToSelectWallet,
  navigateToCreateAccount,
} from '../../redux/actions'

import './NotFoundPage.scss'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateToCreateAccount: () => dispatch(navigateToCreateAccount()),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
  }
}

class NotFoundPage extends PureComponent {
  render () {
    const { navigateToCreateAccount, navigateToSelectWallet } = this.props

    return (
      <div styleName='root'>
        <div styleName='title'>404</div>
        <div styleName='subtitle'><Translate value='NotFoundPage.pageNotFound' /></div>

        <div styleName='actions'>
          <Button
            styleName='button'
            buttonType='login'
            onClick={navigateToCreateAccount}
          >
            <Translate value='NotFoundPage.button' />
          </Button>
          <Translate value='NotFoundPage.or' />
          &nbsp;<br />
          <button onClick={navigateToSelectWallet} styleName='link'>
            <Translate value='NotFoundPage.useExistingAccount' />
          </button>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(NotFoundPage)
