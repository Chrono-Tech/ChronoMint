import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import FileSelect from 'components/common/FileSelect/FileSelect'
import Immutable from 'immutable'
import { FlatButton, FontIcon, IconButton, RaisedButton } from 'material-ui'
import { ACCEPT_DOCS } from 'models/FileSelect/FileExtension'
import PollModel from 'models/PollModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DatePicker, TextField } from 'redux-form-material-ui'
import { Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_I18N } from 'redux/configureStore'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { createPoll, DUCK_VOTING, updatePoll } from 'redux/voting/actions'
import './PollEditForm.scss'
import validate from './validate'

export const FORM_EDIT_POLL = 'FormEditPoll'

function prefix (token) {
  return `components.dialogs.PollEditDialog.${token}`
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_EDIT_POLL)

  return {
    options: selector(state, 'options'),
    account: state.get(DUCK_SESSION).account,
    maxVoteLimitInTIME: state.get(DUCK_VOTING).voteLimitInTIME(),
    locale: state.get(DUCK_I18N).locale,
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    onSubmit: (values) => {
      const poll = new PollModel({
        ...values.toJS(),
        voteLimitInTIME: new BigNumber(values.get('voteLimitInTIME')),
        options: new Immutable.List(values.get('options')),
      })
      dispatch(modalsClose())
      if (props.isModify) {
        dispatch(updatePoll(poll))
      } else {
        dispatch(createPoll(poll))
      }
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EDIT_POLL, validate })
export default class PollEditForm extends Component {
  static propTypes = {
    isModify: PropTypes.bool,
    account: PropTypes.string,
    voteLimit: PropTypes.objectOf(BigNumber),
    locale: PropTypes.string,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {
      selectedOptionIndex: 0,
    }
  }

  handleOptionSelect (index) {
    this.setState({ selectedOptionIndex: index })
  }

  handleOptionCreate (options) {
    options.push()
    this.setState({ selectedOptionIndex: options.length })
  }

  handleOptionRemove (options, index) {
    options.remove(index)
    if (this.state.selectedOptionIndex >= options.length) {
      this.setState({ selectedOptionIndex: options.length - 1 })
    }
  }

  renderOptions (options) {
    const optionsList = options.getAll()
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
            {optionsList && optionsList.toArray().map((option, index) => (
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
                    <FontIcon className='material-icons'
                              onTouchTap={() => this.handleOptionRemove(options, index)}>delete</FontIcon>
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
    const { isModify, handleSubmit, pristine, invalid } = this.props
    return (
      <form styleName='content' onSubmit={handleSubmit}>
        <div styleName='title'><Translate value={prefix(isModify ? 'editPoll' : 'newPoll')} /></div>
        <div styleName='body'>
          <div styleName='column'>
            <Field
              component={TextField}
              name='title'
              fullWidth
              floatingLabelText={<Translate value={prefix('pollTitle')} />}
            />
            <Field
              component={TextField}
              name='description'
              fullWidth
              multiLine
              floatingLabelText={<Translate value={prefix('pollDescription')} />}
            />
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
            <Field
              component={TextField}
              name={`options[${this.state.selectedOptionIndex}]`}
              fullWidth
              floatingLabelText={<Translate value={prefix('option')} />}
            />
            <FieldArray
              name='options'
              component={({ fields }) => this.renderOptions(fields)}
            />
          </div>
        </div>
        <div styleName='footer'>
          <RaisedButton
            styleName='footerAction'
            label={<Translate value={prefix(isModify ? 'updatePoll' : 'createPoll')} />}
            type='submit'
            disabled={pristine || invalid}
            primary
          />
        </div>
      </form>
    )
  }
}
