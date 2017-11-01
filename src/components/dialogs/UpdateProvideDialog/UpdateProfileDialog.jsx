import { CSSTransitionGroup } from 'react-transition-group'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
import { FontIcon, RaisedButton } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { TextField } from 'redux-form-material-ui'
import { connect } from 'react-redux'

import { ACCEPT_IMAGES } from 'models/FileSelect/FileExtension'
import ProfileModel from 'models/ProfileModel'

import { modalsClose } from 'redux/modals/actions'
import { updateUserProfile } from 'redux/session/actions'

import CopyIcon from 'components/dashboard/MicroIcon/CopyIcon'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import QRIcon from 'components/dashboard/MicroIcon/QRIcon'

import ModalDialog from '../ModalDialog'
import validate from './validate'

import './UpdateProfileDialog.scss'

@reduxForm({
  form: 'UpdateProfileDialog',
  validate,
})
export class UpdateProfileDialog extends React.Component {
  static propTypes = {
    account: PropTypes.string,

    name: PropTypes.string,
    company: PropTypes.string,
    icon: PropTypes.string,

    submitting: PropTypes.bool,
    initialValues: PropTypes.object,

    onClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.props.onClose()} styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <h3>Account edit</h3>
            </div>
            <div styleName='person'>
              <div styleName='left'>
                <div styleName='icon'>
                  <IPFSImage
                    styleName='content'
                    multihash={this.props.icon}
                    icon={(<FontIcon
                      style={{ fontSize: 96 }}
                      color='white'
                      className='material-icons'
                    >account_circle
                    </FontIcon>)}
                  />
                </div>
              </div>
              <div styleName='right'>
                <div styleName='name'>{this.props.name || 'Your Name'}</div>
                <div styleName='company'>{this.props.company || 'Your Company'}</div>
                <div styleName='account'>{this.props.account || 'Account Address'}</div>
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
                floatingLabelText='Add/change a profile photo'
                accept={ACCEPT_IMAGES}
              />
              <Field component={TextField} name='name' fullWidth floatingLabelText='Name' />
              <Field component={TextField} name='company' fullWidth floatingLabelText='Company' />
              <Field component={TextField} name='url' fullWidth floatingLabelText='Website' />
              <Field component={TextField} name='email' fullWidth floatingLabelText='Email' />
            </div>
            <div styleName='footer'>
              <RaisedButton styleName='action' label='Confirm Edits' type='submit' primary disabled={this.props.submitting} />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps (state) {
  const selector = formValueSelector('UpdateProfileDialog')
  const session = state.get('session')

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
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(updateUserProfile(new ProfileModel(values.toJS())))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileDialog)
