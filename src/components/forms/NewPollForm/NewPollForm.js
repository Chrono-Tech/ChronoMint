import React, {Component} from 'react';
import {Field, reduxForm, FieldArray} from 'redux-form/immutable';
import {connect} from 'react-redux';
import {TextField, FlatButton} from 'material-ui';
import validate from './validate';
import globalStyles from '../../../styles';
import PollModel from '../../../models/PollModel'

const renderTextField = ({ input, label, hint, meta: { touched, error }, ...custom }) => ( // todo common component
    <TextField hintText={hint}
               floatingLabelText={label}
               fullWidth={false}
               errorText={touched && error}
               style={globalStyles.form.textField}
               {...input}
               {...custom}
    />
);

const renderOptions = ({ fields, meta: { touched, error } }) => (
    <div>
        {fields.map((option, index) =>
        <div key={index}>
            <br/>
            <Field component={renderTextField}
                   style={globalStyles.form.textField}
                   name={`${option}`}
                   hintText="Please describe the option"
                   floatingLabelText={`Option ${index + 1}`}
                   maxLength={32}
            />
            {/*<button*/}
                {/*type="button"*/}
                {/*title="Remove Option"*/}
                {/*onClick={() => fields.remove(index)}*/}
            {/*/>*/}
        </div>
        )}
        <FlatButton
            label="Add Option"
            style={{...globalStyles.flatButton, float: 'left'}}
            labelStyle={globalStyles.flatButtonLabel}
            onTouchTap={() => fields.push()}
        />
        <br/>
        {error && <div style={{fontSize: 12, color: '#f44336'}} >{error}</div>}
    </div>
);

const mapStateToProps = state => {
    let poll = state.get('polls').get(state.get('poll'));
    poll = (poll || new PollModel()).toJS();
    return ({
        initialValues: {
            ...poll
        }
    })
};

const mapDispatchToProps = null;
const mergeProps = null;
const options = {withRef: true};

@connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
@reduxForm({
    form: 'NewPollForm',
    validate,
})
class NewPollForm extends Component {

    render() {
        const {
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit} name="NewPollForm___Name">

                <Field component={renderTextField}
                       style={globalStyles.form.firstField}
                       name="pollTitle"
                       floatingLabelText="Poll Title"
                       maxLength={32}
                />
                <Field component={renderTextField}
                       style={{...globalStyles.form.firstField, float: 'right', width: "50%"}}
                       name="pollDescription"
                       multiLine={true}
                       rows={3}
                       rowsMax={5}
                       maxLength={30}
                       floatingLabelText="Poll Description"
                />

                <FieldArray name="options" component={renderOptions}/>

                {/*<Field component={renderTextField} name="address" style={{display: 'none'}}/>*/}

            </form>
        );
    }
}

export default NewPollForm;