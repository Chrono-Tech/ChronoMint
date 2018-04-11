/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import { Field, reduxForm, formValueSelector, formPropTypes } from 'redux-form/immutable'
import { FontIcon, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'
import { ACCEPT_IMAGES } from 'models/FileSelect/FileExtension'
import ProfileModel from 'models/ProfileModel'
import { DUCK_SESSION, updateUserProfile } from 'redux/session/actions'
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
  return {
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
    return (
      <ModalDialog>
        <div styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <h3><Translate value={`${prefix}.title`} /></h3>
            </div>
            <div styleName='person'>
              <div styleName='left'>
                <div styleName='icon'>
                  <IPFSImage
                    styleName='iconImage'
                    multihash={this.props.icon}
                    icon={(
                      <FontIcon
                        style={{ fontSize: 96 }}
                        color='white'
                        className='material-icons'
                      >account_circle
                      </FontIcon>
                    )}
                  />
                </div>
              </div>
              <div styleName='right'>
                <div styleName='name'>{this.props.name || <Translate value={`${prefix}.yourName`} />}</div>
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
              <Field component={TextField} name='name' fullWidth floatingLabelText={<Translate value={`${prefix}.name`} />} />
              <Field component={TextField} name='company' fullWidth floatingLabelText={<Translate value={`${prefix}.company`} />} />
              <Field component={TextField} name='url' fullWidth floatingLabelText={<Translate value={`${prefix}.website`} />} />
              <Field component={TextField} name='email' fullWidth floatingLabelText={<Translate value={`${prefix}.email`} />} />
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label={<Translate value={`${prefix}.button`} />}
                type='submit'
                disabled={this.props.submitting}
                primary
              />
            </div>
          </form>
        </div>
      </ModalDialog>
    )
  }
}
