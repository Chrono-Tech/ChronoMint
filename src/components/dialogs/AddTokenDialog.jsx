import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'

import { RaisedButton, FlatButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, SubmissionError, reduxForm, formValueSelector } from 'redux-form/immutable'
import ModalDialog from './ModalDialog'
import FileSelect from 'components/common/FileSelect/FileSelect'

import { modalsClose } from 'redux/modals/actions'

import './AddTokenDialog.scss'

@reduxForm({
  form: 'AddTokenDialog'
})
export class AddTokenDialog extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    onClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,

    form: PropTypes.object,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object
  }

  render() {

    return (
      <CSSTransitionGroup
        transitionName="transition-opacity"
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.onClose()} styleName="root">
          <form styleName="content" onSubmit={this.props.handleSubmit}>
            <div styleName="header">
            </div>
            <div styleName="body">
              <Field component={TextField} name='address' fullWidth floatingLabelText="Token contract address" />
              <Field component={TextField} name='name' fullWidth floatingLabelText="Token name" />
              <Field component={TextField} name='symbol' fullWidth floatingLabelText="Token symbol" />
              <Field component={TextField} name='decimals' fullWidth floatingLabelText="Decimals places of smallest unit" />
              <Field component={FileSelect} name='icon' fullWidth floatingLabelText="Token icon" />
            </div>
            <div styleName="footer">
              <FlatButton styleName="action" label="Cancel" onTouchTap={() => this.props.onClose()} />
              <RaisedButton styleName="action" label="Save" type="submit" primary disabled={this.props.submitting} />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  handleIconChanged (value) {
    console.log(value)
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('wallet')

  return {
    account: session.account,
    profile: session.profile,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: async (values) => {

      const address = values.get('address')

      const errors = _.omitBy({
        address: address == null ? 'Address is a required field' : null
      }, _.isNil)

      if (Object.keys(errors).length > 0) {
        throw new SubmissionError(errors)
      }
    },
    onSubmitSuccess: () => dispatch(modalsClose())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTokenDialog)
