import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField, DatePicker } from 'redux-form-material-ui'
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable'
// import Immutable from 'immutable'
import { RaisedButton, FlatButton, FontIcon, IconButton } from 'material-ui'

import PollModel, { validate } from 'models/PollModel'
import { modalsClose } from 'redux/modals/actions'
import { createPoll } from 'redux/voting/actions'

import ModalDialog from './ModalDialog'

import './AddPollDialog.scss'

export const FORM_ADD_POLL_DIALOG = 'AddPollDialog'

@reduxForm({form: FORM_ADD_POLL_DIALOG, validate})
export class AddPollDialog extends React.Component {

  static propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,

    submitting: PropTypes.bool,
    initialValues: PropTypes.object
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
                <Field component={DatePicker} name='date' fullWidth floatingLabelText='Finished date' style={{ width: '180px' }} />
                <div styleName='actions'>
                  <FlatButton
                    label='Add Attachments'
                    styleName='action'
                    icon={<FontIcon className='material-icons'>link</FontIcon>}
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
                <div styleName='options'>
                  <div styleName='options-table'>
                    {[1,2,3,4,5,6].map((option, index) => (
                      <div key={index} styleName={classnames('table-item', {active: index === 2})}>
                        <div styleName='item-left'>
                          <div styleName='symbol symbol-fill'>#{index + 1}</div>
                        </div>
                        <div styleName='item-main'>
                          <div styleName='main-title'>Option #{index + 1}</div>
                          <div styleName='main-option'>E Banks That Accept Us Casino Players</div>
                        </div>
                        <div styleName='item-right'>
                          <IconButton>
                            <FontIcon className='material-icons'>mode_edit</FontIcon>
                          </IconButton>
                          <IconButton>
                            <FontIcon className='material-icons'>delete</FontIcon>
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label='Create Poll'
                type='submit'
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
      dispatch(createPoll(new PollModel(values)))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPollDialog)
