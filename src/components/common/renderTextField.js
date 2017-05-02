import React from 'react'
import { TextField } from 'material-ui'
import globalStyles from '../../styles'

const renderTextField = ({input, label, hint, meta: {touched, error}, ...custom}) => (
  <TextField hintText={hint}
    floatingLabelText={label}
    fullWidth={false}
    errorText={touched && error}
    style={globalStyles.form.textField}
    {...input}
    {...custom}
  />
)

export default renderTextField
