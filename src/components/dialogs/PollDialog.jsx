import BigNumber from 'bignumber.js'
import { CSSTransitionGroup } from 'react-transition-group'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton, FlatButton, FontIcon, IconButton } from 'material-ui'
import React from 'react'
import { TextField, DatePicker } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'

import { ACCEPT_DOCS } from 'models/FileSelect/FileExtension'
import { validate } from 'models/PollModel'

import { createPoll, updatePoll } from 'redux/voting/actions'
import { modalsClose } from 'redux/modals/actions'

import FileSelect from 'components/common/FileSelect/FileSelect'

import ModalDialog from './ModalDialog'

import './PollDialog.scss'

export const FORM_POLL_DIALOG = 'PollDialog'

function prefix (token) {
  return `components.dialogs.PollDialog.${token}`
}

@reduxForm({ form: FORM_POLL_DIALOG, validate })
export class PollDialog extends React.Component {
  static propTypes = {

    isModify: PropTypes.bool,
    account: PropTypes.string,
    maxVoteLimitInTIME: PropTypes.object,
    locale: PropTypes.string,

    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,

    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedOptionIndex: 0,
    }
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
        <ModalDialog onClose={() => this.props.onClose()}>
          <form styleName='content' onSubmit={this.props.handleSubmit}>
            <div styleName='header'>
              <h3><Translate value={prefix(this.props.isModify ? 'editPoll' : 'newPoll')} /></h3>
            </div>
            <div styleName='body'>
              <div styleName='column'>


                <Field component={TextField} name='title' fullWidth floatingLabelText={<Translate value={prefix('pollTitle')} />} />
                <Field component={TextField} name='description' fullWidth multiLine floatingLabelText={<Translate value={prefix('pollDescription')} />} />
                <Field
                  component={TextField}
                  name='voteLimitInTIME'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('voteLimit')} />}
                />
                <Field
                  component={DatePicker}
                  locale={this.props.locale}
                  DateTimeFormat={Intl.DateTimeFormat}
                  cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
                  okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
                  name='deadline'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('finishedDate')} />}
                  style={{ width: '180px' }}
                />
                <Field
                  component={FileSelect}
                  name='files'
                  fullWidth
                  accept={ACCEPT_DOCS}
                  multiple
                />
              </div>
              <div styleName='column'>
                <Field component={TextField} name={`options[${this.state.selectedOptionIndex}]`} fullWidth floatingLabelText={<Translate value={prefix('option')} />} />
                <FieldArray name='options' component={({ fields }) => this.renderOptions(this, fields)} />
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='footerAction'
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
      <div>
        <div styleName='optionsActions'>
          <FlatButton
            label={<Translate value={prefix('addOption')} />}
            styleName='optionsAction'
            onTouchTap={() => this.handleOptionCreate(options)}
          />
        </div>
        <div styleName='optionsList'>
          <div styleName='listTable'>
            {options.getAll().toArray().map((option, index) => (
              <div
                key={index}
                styleName={classnames('tableItem', { active: this.state.selectedOptionIndex === index })}
                onTouchTap={() => this.handleOptionSelect(index)}
              >
                <div styleName='itemLeft'>
                  <div styleName='symbol symbolFill'>#{index + 1}</div>
                </div>
                <div styleName='itemMain'>
                  <div styleName='mainTitle'><Translate value={prefix('optionIndex')} index={index + 1} /></div>
                  <div styleName='mainOption'>{option}</div>
                </div>
                <div styleName='itemRight'>
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
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_POLL_DIALOG)
  const session = state.get('session')
  const voting = state.get('voting')
  return {
    options: selector(state, 'options'),
    account: session.account,
    maxVoteLimitInTIME: voting.voteLimitInTIME,
    locale: state.get('i18n').locale,
  }
}

function mapDispatchToProps (dispatch, op) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: values => {
      const voteLimitInTIME = values.voteLimitInTIME()
      const poll = values
        .set('voteLimitInTIME', voteLimitInTIME
          ? new BigNumber(voteLimitInTIME)
          : null)
      dispatch(modalsClose())
      if (op.isModify) {
        dispatch(updatePoll(poll))
      } else {
        dispatch(createPoll(poll))
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PollDialog)
