import React from 'react'
import { Field, FieldArray } from 'redux-form/immutable'
import { FlatButton } from 'material-ui'
import renderTextField from '../../common/renderTextField'
import globalStyles from '../../../styles'

const renderOptions = ({fields, meta: {touched, error}}) => (
  <div>
    {fields.map((option, index) =>
      <div key={index}>
        <br />
        <Field component={renderTextField}
               style={globalStyles.form.textField}
               name={`${option}`}
               hintText='Please describe the option'
               floatingLabelText={`Option ${index + 1}`}
               maxLength={32}
               fullWidth
        />
        {/* <button */}
        {/* type="button" */}
        {/* title="Remove Option" */}
        {/* onClick={() => fields.remove(index)} */}
        {/* /> */}
      </div>
    )}
    <FlatButton
      label='Add Option'
      style={{...globalStyles.flatButton}}
      labelStyle={globalStyles.flatButtonLabel}
      onTouchTap={() => fields.push()}
    />
    <br />
    {error && <div style={{fontSize: 12, color: '#f44336'}}>{error}</div>}
  </div>
)

export default <FieldArray name='options' component={renderOptions}/>
