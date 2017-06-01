import React, { Component } from 'react'
import { Field, reduxForm, reset } from 'redux-form/immutable'
import { connect } from 'react-redux'
import renderTextField from '../common/renderTextField'
import { RaisedButton, MenuItem } from 'material-ui'
import { SelectField } from 'redux-form-material-ui'
import TokenStoryFilterModel, { validate } from '../../models/TokenStoryFilterModel'

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('TokenStoryFilterForm'))
})

@connect(null, mapDispatchToProps, null, {withRef: true})
@reduxForm({
  form: 'TokenStoryFilterForm',
  validate: validate
})
class TokenStoryFilterForm extends Component {
  render () {
    const {handleSubmit, resetForm} = this.props

    return (
      <form onSubmit={handleSubmit} name='TokenStoryFilterForm'>
        <Field
          component={renderTextField}
          name='hash'
          type='text'
          floatingLabelText='Hash'
        />
        <Field
          component={renderTextField}
          name='from'
          type='text'
          floatingLabelText='From'
        />
        <Field
          component={renderTextField}
          name='to'
          type='text'
          floatingLabelText='To'
        />
        <Field
          component={SelectField}
          name='action'
          type='text'
          floatingLabelText='Action'
        >
          {TokenStoryFilterModel.getAllowActions().map(action => <MenuItem key={action} value={action} primaryText={action} />)}
        </Field>

        <RaisedButton label='Search' primary type='submit'/>
        <RaisedButton label='Reset' onTouchTap={() => {
          resetForm()
        }}/>
      </form>
    )
  }
}

export default TokenStoryFilterForm
