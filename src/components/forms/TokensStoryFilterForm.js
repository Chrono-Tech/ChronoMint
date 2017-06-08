import React, { Component } from 'react'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import renderTextField from '../common/renderTextField'
import { RaisedButton, MenuItem } from 'material-ui'
import { SelectField } from 'redux-form-material-ui'
import TokensStoryFilterModel, { validate, TOKENS_STORY_ACTION_TRANSFER } from '../../models/TokensStoryFilterModel'
import TokenModel from '../../models/TokenModel'

const FORM_TOKENS_STORY_FILTER = 'TokensStoryFilterForm'
const selector = formValueSelector(FORM_TOKENS_STORY_FILTER)

const mapStateToProps = (state) => {
  const isTransferAction = selector(state, 'action') === TOKENS_STORY_ACTION_TRANSFER

  return {
    isTransferAction,
    tokens: state.get('wallet').tokens
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset(FORM_TOKENS_STORY_FILTER)),
})

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
  form: FORM_TOKENS_STORY_FILTER,
  validate: validate
})
class TokensStoryFilterForm extends Component {
  render () {
    const {handleSubmit, resetForm, isTransferAction, tokens} = this.props

    const fromToInputs = [
      <div className='col-xs-3' key='from'>
        <Field
          component={renderTextField}
          name='from'
          type='text'
          floatingLabelText='From'
        />
      </div>,
      <div className='col-xs-3' key='to'>
        <Field
          component={renderTextField}
          name='to'
          type='text'
          floatingLabelText='To'
        />
      </div>
    ]

    const actionList = TokensStoryFilterModel.getAllowedActions().map(
      action => <MenuItem key={action} value={action} primaryText={action} />
    )

    const tokenList = tokens.valueSeq().map((t: TokenModel) =>
      <MenuItem key={t.symbol()} value={t.symbol()} primaryText={t.name()} />
    )

    return (
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-xs-3' key='action'>
            <Field
              component={SelectField}
              name='action'
              floatingLabelText='Action'>
              {actionList}
            </Field>
          </div>
          <div className='col-xs-3' key='token'>
            <Field
              component={SelectField}
              name='token'
              floatingLabelText='Token'>
              {tokenList}
            </Field>
          </div>
          { isTransferAction ? fromToInputs : null }
        </div>

        <RaisedButton label='Search' primary type='submit' />
        <RaisedButton label='Reset' onTouchTap={() => {
          resetForm()
        }} />
      </form>
    )
  }
}

export default TokensStoryFilterForm
