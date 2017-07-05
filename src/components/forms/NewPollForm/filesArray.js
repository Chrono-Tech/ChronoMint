// TODO new voting
/* eslint-disable */
import React from 'react'
import { Field, FieldArray } from 'redux-form/immutable'
import { FlatButton } from 'material-ui'
import FileSelect from '../../common/FileSelect/FileSelect'

const renderFiles = ({fields, meta: {touched, error}}) => (
  <div>
    {fields.map((file, index) =>
      <div key={index}>
        <Field
          component={FileSelect}
          name={`${file}`}
          textFieldProps={{floatingLabelText: `File ${index + 1}`}}
        />
      </div>
    )}
    <div style={{marginTop: 20}}>
      <FlatButton
        label='Add file'
        onTouchTap={() => fields.push()}
      />
    </div>
    {error && <div style={{fontSize: 12, marginTop: 10, color: '#f44336'}}>{error}</div>}
  </div>
)

export default <FieldArray name='files' component={renderFiles} />
