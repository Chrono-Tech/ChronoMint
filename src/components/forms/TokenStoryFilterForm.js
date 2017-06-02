import React, { Component } from 'react'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import renderTextField from '../common/renderTextField'
import { RaisedButton, MenuItem } from 'material-ui'
import { SelectField } from 'redux-form-material-ui'
import TokenStoryFilterModel, { validate, TOKEN_STORY_ACTION_TRANSFER } from '../../models/TokenStoryFilterModel'
import TokenModel from '../../models/TokenModel'

const selector = formValueSelector('TokenStoryFilterForm')

const mapStateToProps = (state) => {
  const isTransferAction = selector(state, 'action') === TOKEN_STORY_ACTION_TRANSFER

  return {
    isTransferAction,
    tokens: state.get('wallet').tokens
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('TokenStoryFilterForm')),
})

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({
  form: 'TokenStoryFilterForm',
  validate: validate
})
class TokenStoryFilterForm extends Component {
  render () {
    const {handleSubmit, resetForm, isTransferAction, tokens} = this.props

    const fromToInputs = [
      <div className='col-xs-3'>
        <Field
          component={renderTextField}
          name='from'
          type='text'
          floatingLabelText='From'
        />
      </div>,
      <div className='col-xs-3'>
        <Field
          component={renderTextField}
          name='to'
          type='text'
          floatingLabelText='To'
        />
      </div>
    ]

    const actionList = TokenStoryFilterModel.getAllowActions().map(
      action => <MenuItem key={action} value={action} primaryText={action} />
    )

    const tokenList = tokens.valueSeq().map((t: TokenModel) =>
      <MenuItem key={t.symbol()} value={t.symbol()} primaryText={t.name()} />
    )

    return (
      <form onSubmit={handleSubmit} name='TokenStoryFilterForm'>
        <div className='row'>
          <div className='col-xs-3'>
            <Field
              component={SelectField}
              name='action'
              floatingLabelText='Action'>
              {actionList}
            </Field>
          </div>
          <div className='col-xs-3'>
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

export default TokenStoryFilterForm
