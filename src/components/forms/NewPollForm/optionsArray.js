// TODO new voting
/* eslint-disable */
import React from 'react'
import { Field, FieldArray } from 'redux-form/immutable'
import { FlatButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'

const renderOptions = ({fields, meta: {touched, error}}) => (
  <div>
    {fields.map((option, index) =>
      <div key={index}>
        <Field
          component={TextField}
          name={`${option}`}
          hintText='Please describe the option'
          floatingLabelText={`Option ${index + 1}`}
          maxLength={32}
          fullWidth
        />
      </div>
    )}
    <div style={{marginTop: 20}}>
      <FlatButton
        label='Add Option'
        onTouchTap={() => fields.push()}
      />
    </div>
    {error && <div style={{fontSize: 12, marginTop: 10, color: '#f44336'}}>{error}</div>}
  </div>
)

export default <FieldArray name='options' component={renderOptions} />
