/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { updateUserProfile } from '@chronobank/core/redux/session/thunks'
import { DUCK_SESSION } from '@chronobank/core/redux/session/constants'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import { getAccountProfileSummary } from '@chronobank/core/redux/session/selectors'
import {
  getAccountName,
} from '@chronobank/core/redux/persistAccount/utils'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import CopyIcon from 'components/dashboard/MicroIcon/CopyIcon'
import AvatarSelect from 'components/common/AvatarSelect/AvatarSelect'
import ProfileImage from 'components/common/ProfileImage/ProfileImage'
import QRIcon from 'components/dashboard/MicroIcon/QRIcon'
import { FORM_UPDATE_PROFILE_DIALOG } from 'components/constants'
import ModalDialog from '../ModalDialog'
import validate from './validate'
import './UpdateProfileDialog.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_UPDATE_PROFILE_DIALOG)
  const session = state.get(DUCK_SESSION)
  const selectedAccount = state.get(DUCK_PERSIST_ACCOUNT).selectedWallet
  const accountProfileSummary = getAccountProfileSummary(state)
  const profileSignature = session.profileSignature

  return {
    selectedAccount: selectedAccount,
    account: session.account,
    userName: accountProfileSummary.userName,
    avatar: selector(state, 'avatar'),
    company: accountProfileSummary.company,
    token: profileSignature && profileSignature.token,
    initialValues: { ...accountProfileSummary },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(updateUserProfile(values.toJS()))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_UPDATE_PROFILE_DIALOG, validate })
export default class UpdateProfileDialog extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    name: PropTypes.string,
    company: PropTypes.string,
    icon: PropTypes.string,
    token: PropTypes.string,
    handleAvatarUpload: PropTypes.func,
    ...formPropTypes,
  }

  static defaultProps = {
    token: '',
  }

  render () {
    const { selectedAccount, handleSubmit, avatar, userName, company, account } = this.props

    return (
      <ModalDialog title={<Translate value={`${prefix}.title`} />}>
        <div styleName='root'>
          <form styleName='content' name={FORM_UPDATE_PROFILE_DIALOG} onSubmit={handleSubmit}>
            <div styleName='person'>
              <div styleName='left'>
                <div styleName='icon'>
                  <ProfileImage
                    styleName='iconImage'
                    imageId={avatar}
                    icon={(
                      <i
                        styleName='default-icon'
                        color='white'
                        className='material-icons'
                      >account_circle
                      </i>
                    )}
                  />
                </div>
              </div>
              <div styleName='right'>
                <div styleName='name'>{userName || getAccountName(selectedAccount) || <Translate value={`${prefix}.yourName`} />}</div>
                <div styleName='company'>{company || ''}</div>
                <div styleName='account'>{account || <Translate value={`${prefix}.accountAddress`} />}</div>
                <div styleName='micros'>
                  <QRIcon value={account} />
                  <CopyIcon value={account} />
                </div>
              </div>
            </div>
            <div styleName='body'>
              <Field
                component={AvatarSelect}
                name='avatar'
                fullWidth
                label={`${prefix}.fileTitle`}
              />
              <Field
                component={TextField}
                name='userName'
                fullWidth
                label={<Translate value={`${prefix}.name`} />}
              />
              <Field
                component={TextField}
                name='company'
                fullWidth
                label={<Translate value={`${prefix}.company`} />}
              />
              <Field
                component={TextField}
                name='website'
                fullWidth
                label={<Translate value={`${prefix}.website`} />}
              />
              <Field
                component={TextField}
                name='email'
                fullWidth
                label={<Translate value={`${prefix}.email`} />}
              />
            </div>
            <div styleName='footer'>
              <Button
                label={<Translate value={`${prefix}.button`} />}
                type='submit'
                disabled={this.props.submitting}
              />
            </div>
          </form>
        </div>
      </ModalDialog>
    )
  }
}
