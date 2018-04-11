/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ModalDialog from 'components/dialogs/ModalDialog'
import { modalsClose } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import BlacklistForm from 'components/assetsManager/BlacklistForm/BlacklistForm'
import { restrictUser, unrestrictUser } from 'redux/assetsManager/actions'
import TokenModel from 'models/tokens/TokenModel'
import './BlacklistDialog.scss'
import { prefix } from './lang'

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    restrictUser: (token, address) => dispatch(restrictUser(token, address)),
    unrestrictUser: (token, address) => dispatch(unrestrictUser(token, address)),
  }
}

@connect(null, mapDispatchToProps)
export default class BlacklistDialog extends PureComponent {
  static propTypes = {
    modalsClose: PropTypes.func,
    restrictUser: PropTypes.func,
    unrestrictUser: PropTypes.func,
    token: PropTypes.instanceOf(TokenModel),
  }

  handleClose = (e) => {
    this.props.modalsClose()
    e.stopPropagation()
  }

  handleSubmitSuccess = (address) => {
    this.props.modalsClose()
    this.props.restrictUser(this.props.token, address)
  }

  handleRemoveUserFromBlacklist = (address: string) => {
    this.props.modalsClose()
    this.props.unrestrictUser(this.props.token, address)
  }

  render () {
    return (
      <ModalDialog>
        <div styleName='content'>
          <div styleName='dialogHeader'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={`${prefix}.dialogTitle`} />
            </div>
            <div styleName='dialogHeaderSubTitle'>
              <Translate value={`${prefix}.dialogSubTitle`} />
            </div>
          </div>
          <div styleName='dialogBody'>
            <BlacklistForm
              onSubmitSuccess={this.handleSubmitSuccess}
              onRemoveFromBlacklist={this.handleRemoveUserFromBlacklist}
              blacklist={this.props.token.blacklist()}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
