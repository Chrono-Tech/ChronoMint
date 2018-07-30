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
import { ACCEPT_IMAGES } from '@chronobank/core/models/FileSelect/FileExtension'
import ProfileModel from '@chronobank/core/models/ProfileModel'
import { DUCK_SESSION, updateUserProfile } from '@chronobank/core/redux/session/actions'
import {
  getAccountName,
} from '@chronobank/core/redux/persistAccount/utils'
import { modalsClose } from 'redux/modals/actions'
import CopyIcon from 'components/dashboard/MicroIcon/CopyIcon'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import QRIcon from 'components/dashboard/MicroIcon/QRIcon'
import ModalDialog from '../ModalDialog'
import validate from './validate'
import './UpdateProfileDialog.scss'
import { prefix } from './lang'

const FORM_UPDATE_PROFILE_DIALOG = 'UpdateProfileDialog'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_UPDATE_PROFILE_DIALOG)
  const session = state.get(DUCK_SESSION)
  const selectedAccount = state.get('persistAccount').selectedWallet

  return {
    selectedAccount: selectedAccount,
    company: selector(state, 'company'),
    name: selector(state, 'name'),
    icon: selector(state, 'icon'),
    account: session.account,
    initialValues: session.profile.summary(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (values) => {
      console.log('dispatch(updateUserProfile: ', values)
      dispatch(modalsClose())
      dispatch(updateUserProfile(new ProfileModel(values.toJS())))
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
    ...formPropTypes,
  }

  render () {
    const { selectedAccount } = this.props

    return (
      <ModalDialog title={<Translate value={`${prefix}.title`} />}>
        <div styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='person'>
              <div styleName='left'>
                <div styleName='icon'>
                  <IPFSImage
                    styleName='iconImage'
                    multihash={this.props.icon}
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
                <div styleName='name'>{getAccountName(selectedAccount) || <Translate value={`${prefix}.yourName`} />}</div>
                <div styleName='company'>{this.props.company || <Translate value={`${prefix}.yourCompany`} />}</div>
                <div styleName='account'>{this.props.account || <Translate value={`${prefix}.accountAddress`} />}</div>
                <div styleName='micros'>
                  <QRIcon value={this.props.account} />
                  <CopyIcon value={this.props.account} />
                </div>
              </div>
            </div>
            <div styleName='body'>
              <Field
                component={FileSelect}
                name='icon'
                fullWidth
                floatingLabelText={`${prefix}.fileTitle`}
                accept={ACCEPT_IMAGES}
              />
              <Field
                component={TextField}
                name='name'
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
                name='url'
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
