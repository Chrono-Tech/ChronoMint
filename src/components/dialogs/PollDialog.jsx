/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import classnames from 'classnames'
import { FlatButton, FontIcon, IconButton } from 'material-ui'
import { Button } from 'components'
import PollModel from '@chronobank/core/models/PollModel'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { DatePicker, TextField } from 'redux-form-material-ui'
import { Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { createPoll } from '@chronobank/core/redux/voting/actions'
import ModalDialog from './ModalDialog'
import './PollDialog.scss'
import validate from './PollDialogValidate'

export const FORM_POLL_DIALOG = 'PollDialog'

@reduxForm({ form: FORM_POLL_DIALOG, validate })
export class PollDialog extends React.Component {

  static propTypes = {
    isModify: PropTypes.bool,
    account: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedOptionIndex: 0,
    }
  }

  handleOptionSelect (index) {
    this.setState({
      selectedOptionIndex: index,
    })
  }

  handleOptionCreate (options) {
    options.push()
    this.setState({
      selectedOptionIndex: options.length,
    })
  }

  handleOptionRemove (options, index) {
    options.remove(index)
    if (this.state.selectedOptionIndex >= options.length) {
      this.setState({
        selectedOptionIndex: options.length - 1,
      })
    }
  }

  renderOptions (dialog, options) {

    return (
      <div styleName='options'>
        <div styleName='options-actions'>
          <Button
            flat
            label='Add Option'
            styleName='action'
            // eslint-disable-next-line
            onClick={() => this.handleOptionCreate(options)}
          />
        </div>
        <div styleName='options-list'>
          <div styleName='list-table'>
            {options.getAll().toArray().map((option, index) => (
              <div
                // eslint-disable-next-line
                key={index}
                styleName={classnames('table-item', { active: this.state.selectedOptionIndex === index })}
                // eslint-disable-next-line
                onClick={() => this.handleOptionSelect(index)}
              >
                <div styleName='item-left'>
                  <div styleName='symbol symbol-fill'>#{index + 1}</div>
                </div>
                <div styleName='item-main'>
                  <div styleName='main-title'>Option #{index + 1}</div>
                  <div styleName='main-option'>{option}</div>
                </div>
                <div styleName='item-right'>
                  <IconButton>
                    <FontIcon className='material-icons'>mode_edit</FontIcon>
                  </IconButton>
                  <IconButton>
                    <FontIcon
                      className='material-icons'
                      // eslint-disable-next-line
                      onClick={() => this.handleOptionRemove(options, index)}
                    >delete
                    </FontIcon>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
        <ModalDialog onClose={this.props.onClose} styleName='root'>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <h3>{this.props.isModify ? 'Edit Poll' : 'New Poll'}</h3>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <Field
                  component={TextField}
                  name='title'
                  fullWidth
                  floatingLabelText='Poll title'
                />
                <Field
                  component={TextField}
                  name='description'
                  fullWidth
                  multiLine
                  floatingLabelText='Poll description'
                />
                <Field
                  component={TextField}
                  name='voteLimit'
                  fullWidth
                  floatingLabelText='Vote Limit'
                />
                <Field
                  component={DatePicker}
                  name='deadline'
                  fullWidth
                  floatingLabelText='Finished date'
                  style={{ width: '180px' }}
                />
                <div styleName='actions'>
                  <Button
                    flat
                    label='Add Attachments'
                    styleName='action'
                  />
                </div>
              </div>
              <div styleName='column'>
                <Field
                  component={TextField}
                  name={`options[${this.state.selectedOptionIndex}]`}
                  fullWidth
                  floatingLabelText='Option'
                />
                <FieldArray
                  name='options'
                  // eslint-disable-next-line
                  component={({ fields }) => this.renderOptions(this, fields)}
                />
              </div>
            </div>
            <div styleName='footer'>
              <Button
                styleName='action'
                label={this.props.isModify ? 'Update Poll' : 'Create Poll'}
                type='submit'
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_POLL_DIALOG)
  return {
    options: selector(state, 'options'),
    account: state.get(DUCK_SESSION).account,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(createPoll(new PollModel(values)))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PollDialog)
