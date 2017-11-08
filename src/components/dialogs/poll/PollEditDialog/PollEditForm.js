import FileSelect from 'components/common/FileSelect/FileSelect'
import { RaisedButton } from 'material-ui'
import { ACCEPT_DOCS } from 'models/FileSelect/FileExtension'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DatePicker, TextField } from 'redux-form-material-ui'
import { Field, FieldArray, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_VOTING } from 'redux/voting/actions'
import { DUCK_I18N } from 'redux/configureStore'
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
    maxVoteLimitInTIME: state.get(DUCK_VOTING).voteLimitInTIME,
    locale: state.get(DUCK_I18N).locale,
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    onSubmit: (values) => {
      const voteLimitInTIME = values.voteLimitInTIME()
      const poll = values.set('voteLimitInTIME', voteLimitInTIME
        ? new BigNumber(voteLimitInTIME)
        : null)
      dispatch(modalsClose())
      if (props.isModify) {
        dispatch(updatePoll(poll))
      } else {
        dispatch(createPoll(poll))
      }
    },
  }
}

const onSubmit = (values) => {
  console.log('--PollEditForm#onSubmit', values.toJS())
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EDIT_POLL, validate, onSubmit })
export default class PollEditForm extends Component {
  static propTypes = {
    ...formPropTypes,
  }

  render () {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='title'><Translate value={prefix(this.props.isModify ? 'editPoll' : 'newPoll')} /></div>
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
            label={<Translate value={prefix(this.props.isModify ? 'updatePoll' : 'createPoll')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
