import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField, DatePicker } from 'redux-form-material-ui'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
// import Immutable from 'immutable'
import { RaisedButton, FlatButton } from 'material-ui'

import PollModel, { validate } from 'models/PollModel'
import { modalsClose } from 'redux/modals/actions'
import { newPoll } from 'redux/polls/data'

import ModalDialog from './ModalDialog'

import './AddPollDialog.scss'

export const FORM_ADD_POLL_DIALOG = 'AddPollDialog'

@reduxForm({form: FORM_ADD_POLL_DIALOG, validate})
export class AddPollDialog extends React.Component {

  static propTypes = {
    onClose: PropTypes.func,
    handleSubmit: PropTypes.func
  }

  constructor (props) {
    super(props)
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
              <h3>New Poll</h3>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <Field component={TextField} name='title' fullWidth floatingLabelText='Poll title' />
                <Field component={TextField} name='description' fullWidth multiLine floatingLabelText='Poll description' />
                <Field component={DatePicker} name='date' fullWidth floatingLabelText='Finished date' style={{ width: '150px' }} />
                <div styleName='actions'>
                  <FlatButton
                    label='Add Attachments'
                    styleName='action'
                  />
                </div>
              </div>
              <div styleName='column'>
                <Field component={TextField} name='option' fullWidth floatingLabelText='Option' />
                <div styleName='actions'>
                  <FlatButton
                    label='Add Option'
                    styleName='action'
                  />
                </div>
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label='Create Poll'
                primary
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_POLL_DIALOG)
  return {
    option: selector(state, 'option'),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(newPoll(new PollModel(values)))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPollDialog)
