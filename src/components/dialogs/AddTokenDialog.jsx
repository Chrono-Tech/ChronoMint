import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton, FlatButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'

import ModalDialog from './ModalDialog'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from  'components/common/IPFSImage/IPFSImage'

import TokenModel, { validate } from 'models/TokenModel'
import { modalsClose } from 'redux/modals/actions'
import { addToken, formTokenLoadMetaData } from 'redux/settings/erc20/tokens/actions.js'

import './AddTokenDialog.scss'
import { ACCEPT_IMAGES } from '../common/FileSelect/FileSelect'

export const FORM_ADD_TOKEN_DIALOG = 'AddTokenDialog'

@reduxForm({
  form: FORM_ADD_TOKEN_DIALOG,
  validate,
  asyncValidate: (values, dispatch) => {
    try {
      return formTokenLoadMetaData(
        new TokenModel(values),
        dispatch,
        FORM_ADD_TOKEN_DIALOG
      )
    } catch (e) {
      throw e
    }
  }
})
export class AddTokenDialog extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    onClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,

    address: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,

    submitting: PropTypes.bool,
    initialValues: PropTypes.object
  }

  render () {

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
                <div styleName='name'>{this.props.name || 'Token name'}</div>
                <div styleName='address'>{this.props.address || 'Token address'}</div>
              </div>
            </div>
            <div styleName='body'>
              <Field component={TextField} name='address' fullWidth floatingLabelText='Token contract address' />
              <Field component={TextField} name='name' fullWidth floatingLabelText='Token name' />
              <Field component={TextField} name='symbol' fullWidth floatingLabelText='Token symbol' />
              <Field component={TextField} name='decimals' fullWidth floatingLabelText='Decimals places of smallest unit' />
              <Field component={TextField} name='url' fullWidth floatingLabelText='Project URL' />
              <Field
                component={FileSelect}
                name='icon'
                fullWidth
                label='wallet.selectTokenIcon'
                floatingLabelText='Token icon'
                accept={ACCEPT_IMAGES}
                mode='object'
              />
            </div>
            <div styleName='footer'>
              <FlatButton styleName='action' label='Cancel' onTouchTap={() => this.props.onClose()} />
              <RaisedButton styleName='action' label='Save' type='submit' primary disabled={this.props.submitting} />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps (state) {
  const selector = formValueSelector('AddTokenDialog')

  const session = state.get('session')
  const wallet = state.get('wallet')

  return {
    address: selector(state, 'address'),
    name: selector(state, 'name'),
    icon: selector(state, 'icon'),

    account: session.account,
    profile: session.profile,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => dispatch(addToken(new TokenModel(values))),
    onSubmitSuccess: () => dispatch(modalsClose())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTokenDialog)
