import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import renderTextField from '../common/renderTextField'
import { RaisedButton, MenuItem } from 'material-ui'
import { SelectField } from 'redux-form-material-ui'
import TokenStoryFilterModel, { validate } from '../../models/TokenStoryFilterModel'

//@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'TokenStoryFilterForm',
  validate: validate
})
class TokenStoryFilterForm extends Component {
  render () {
    const {handleSubmit, valid, sendFetching, pristine} = this.props

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
      </form>
    )
  }
}

export default TokenStoryFilterForm
