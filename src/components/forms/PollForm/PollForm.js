import React, {Component} from 'react';
import {Field, reduxForm, FieldArray} from 'redux-form/immutable';
import {connect} from 'react-redux';
import {TextField, FlatButton} from 'material-ui';
import validate from './validate';
import globalStyles from '../../../styles';

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

const mapStateToProps = state => {
    const poll = state.get("poll");
    const initialValues = {index: poll.index(), pollTitle: poll.pollTitle(), pollDescription: poll.pollDescription(), options: poll.optionsDescriptions()};
    return ({
        initialValues
    })
};

const mapDispatchToProps = null;
const mergeProps = null;
const options = {withRef: true};

@connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
@reduxForm({
    form: 'PollForm',
    validate,
})
class PollForm extends Component {

    render() {
        const {
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit} name="PollForm___Name">
                <Field component={renderTextField}
                       style={globalStyles.form.firstField}
                       name="deploy"
                       floatingLabelText="Deploy"
                       maxLength={32}
                />
            </form>
        );
    }
}

export default PollForm;