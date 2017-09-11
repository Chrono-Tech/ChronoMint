import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField, DatePicker } from 'redux-form-material-ui'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form/immutable'

import { RaisedButton, FlatButton, FontIcon, IconButton } from 'material-ui'

import PollModel, { validate } from 'models/PollModel'
import { modalsClose } from 'redux/modals/actions'
import { createPoll, updatePoll } from 'redux/voting/actions'

import ModalDialog from './ModalDialog'

import './PollDialog.scss'

export const FORM_POLL_DIALOG = 'PollDialog'

function prefix (token) {
  return 'components.dialogs.PollDialog.' + token
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_POLL_DIALOG)
  const session = state.get('session')
  return {
    options: selector(state, 'options'),
    account: session.account,
    locale: state.get('i18n').locale
  }
}

function mapDispatchToProps (dispatch, op) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      if (op.isModify){
        dispatch(updatePoll(new PollModel(values)))
      } else {
        dispatch(createPoll(new PollModel(values)))
      }
    }
  }
}

@reduxForm({form: FORM_POLL_DIALOG, validate})
export class PollDialog extends React.Component {

  static propTypes = {

    isModify: PropTypes.bool,
    account: PropTypes.string,
    locale: PropTypes.string,

    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,

    submitting: PropTypes.bool,
    initialValues: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedOptionIndex: 0
    }
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
              <h3><Translate value={prefix(this.props.isModify ? 'editPoll' : 'newPoll')}/></h3>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <Field component={TextField} name='title' fullWidth floatingLabelText={<Translate value={prefix('pollTitle')} />} />
                <Field component={TextField} name='description' fullWidth multiLine floatingLabelText={<Translate value={prefix('pollDescription')} />} />
                <Field component={TextField} name='voteLimit' fullWidth floatingLabelText={<Translate value={prefix('voteLimit')} />} />
                <Field component={DatePicker}
                  locale={this.props.locale}
                  DateTimeFormat={Intl.DateTimeFormat}
                  cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
                  okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
                  name='deadline'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('finishedDate')} />} style={{ width: '180px' }}
                />
                <div styleName='actions'>
                  <FlatButton
                    label={<Translate value={prefix('addAttachments')} />}
                    styleName='action'
                    icon={<FontIcon className='material-icons'>link</FontIcon>}
                  />
                </div>
              </div>
              <div styleName='column'>
                <Field component={TextField} name={`options[${this.state.selectedOptionIndex}]`} fullWidth floatingLabelText={<Translate value={prefix('option')} />} />
                <FieldArray name='options' component={({ fields }) => this.renderOptions(this, fields)} />
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label={<Translate value={prefix(this.props.isModify ? 'updatePoll' : 'createPoll')} />}
                type='submit'
                primary
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  renderOptions (dialog, options) {

    return (
      <div styleName='options'>
        <div styleName='options-actions'>
          <FlatButton
            label='Add Option'
            styleName='action'
            onTouchTap={() => this.handleOptionCreate(options)}
          />
        </div>
        <div styleName='options-list'>
          <div styleName='list-table'>
            {options.getAll().toArray().map((option, index) => (
              <div
                key={index}
                styleName={classnames('table-item', {active: this.state.selectedOptionIndex === index})}
                onTouchTap={() => this.handleOptionSelect(index)}
              >
                <div styleName='item-left'>
                  <div styleName='symbol symbol-fill'>#{index + 1}</div>
                </div>
                <div styleName='item-main'>
                  <div styleName='main-title'><Translate value={prefix('optionIndex')} index={index + 1}/></div>
                  <div styleName='main-option'>{option}</div>
                </div>
                <div styleName='item-right'>
                  <IconButton>
                    <FontIcon className='material-icons'>mode_edit</FontIcon>
                  </IconButton>
                  <IconButton>
                    <FontIcon className='material-icons' onTouchTap={() => this.handleOptionRemove(options, index)}>delete</FontIcon>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  handleOptionSelect (index) {
    this.setState({
      selectedOptionIndex: index
    })
  }

  handleOptionCreate (options) {
    options.push()
    this.setState({
      selectedOptionIndex: options.length
    })
  }

  handleOptionRemove (options, index) {
    options.remove(index)
    if (this.state.selectedOptionIndex >= options.length) {
      this.setState({
        selectedOptionIndex: options.length - 1
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PollDialog)
