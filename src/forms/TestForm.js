import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form'
import { RadioButton } from 'material-ui/RadioButton'
import MenuItem from 'material-ui/MenuItem'
import { AutoComplete as MUIAutoComplete } from 'material-ui'
import {
  AutoComplete,
  Checkbox,
  DatePicker,
  TimePicker,
  RadioButtonGroup,
  SelectField,
  Slider,
  TextField,
  Toggle
} from 'redux-form-material-ui'

export const fields = [];

const validate = (values) => {
  const errors = {};
  return errors;
};

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired
};

export class TestForm extends Component {
  render() {
    const {
      fields: {},
      handleSubmit, pristine, reset, submitting
    } = this.props;
    return (
<form onSubmit={handleSubmit}>
        <div>
          <Field name="name" component={TextField} hintText="Name" floatingLabelText="Name"
            ref="name" withRef/>
        </div>
        <div>
          <Field name="email" component={TextField} hintText="Email" floatingLabelText="Email"/>
        </div>
        <div>
          <Field name="when"
            component={DatePicker}
            format={null}
            onChange={(value) => {
              console.log('date changed ', value) // eslint-disable-line no-console
            }}
            hintText="Day of delivery?"/>
        </div>
        <div>
          <Field name="at"
            component={TimePicker}
            format={null}
            defaultValue={null} // TimePicker requires an object,
                                // and redux-form defaults to ''
            onChange={(value) => {
              console.log('time changed ', value) // eslint-disable-line no-console
            }}
            hintText="At what time?"/>
        </div>
        <div>
          <Field
            name="notes"
            component={TextField}
            hintText="Notes"
            floatingLabelText="Notes"
            multiLine={true}
            rows={2}/>
        </div>
        <div>
          <Field
            name="cheese"
            component={AutoComplete}
            floatingLabelText="Cheese"
            openOnFocus={true}
            filter={MUIAutoComplete.fuzzyFilter}
            onNewRequest={value => {
              console.log('AutoComplete ', value) // eslint-disable-line no-console
            }}
            dataSource={[ 'Cheddar', 'Mozzarella', 'Parmesan', 'Provolone' ]}
            />
        </div>
        <div>
          <button type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>Clear</button>
        </div>
      </form>
    );
  }
}

TestForm.propTypes = propTypes;
TestForm = reduxForm({
  form: 'TestForm',
  fields,
  validate
})(TestForm);

export default TestForm;
