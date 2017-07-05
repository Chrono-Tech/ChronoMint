import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'

import ModalDialog from './ModalDialog'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from  'components/common/IPFSImage/IPFSImage'

import ProfileModel, { validate } from 'models/ProfileModel'
import { modalsClose } from 'redux/modals/actions'
import { updateUserProfile } from 'redux/session/actions'

import './UpdateProfileDialog.scss'
import { ACCEPT_IMAGES } from '../common/FileSelect/FileSelect'

@reduxForm({
  form: 'UpdateProfileDialog',
  validate
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
    onSubmitSuccess: PropTypes.func,
  }

  render() {

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.onClose()} styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <div styleName='left'>
                <div styleName='icon'>
                  <IPFSImage styleName='content' multihash={this.props.icon} />
                </div>
              </div>
              <div styleName='right'>
                <div styleName='name'>{this.props.name || 'Account Name'}</div>
                <div styleName='company'>{this.props.company || 'Account Company'}</div>
                <div styleName='account'>{this.props.account || 'Account Address'}</div>
              </div>
            </div>
            <div styleName='body'>
              <Field
                component={FileSelect}
                name='icon'
                fullWidth
                floatingLabelText='Add/change a profile photo'
                accept={ACCEPT_IMAGES}
                mode='object'
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
    initialValues: session.profile
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => dispatch(updateUserProfile(new ProfileModel(values))),
    onSubmitSuccess: () => dispatch(modalsClose())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileDialog)
