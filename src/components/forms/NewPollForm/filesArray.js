import React from 'react'
import { Field, FieldArray } from 'redux-form/immutable'
import { FlatButton } from 'material-ui'
import FileSelect from '../../common/IPFSFileSelect'

const renderFiles = ({fields, meta: {touched, error}}) => (
  <div>
    {fields.map((file, index) =>
      <div key={index}>
        <br />

        <Field component={FileSelect}
          name={`${file}`}
          textFieldProps={{fullWidth: true, floatingLabelText: `File ${index + 1}`}}
        />
        {/* <button */}
        {/* type="button" */}
        {/* title="Remove Option" */}
        {/* onClick={() => fields.remove(index)} */}
        {/* /> */}
      </div>
    )}
    <FlatButton
      label='Add file'
      onTouchTap={() => fields.push()}
    />
    <br />
    {error && <div style={{fontSize: 12, color: '#f44336'}}>{error}</div>}
  </div>
)

export default <FieldArray name='files' component={renderFiles} />
