import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import { DatePicker } from 'redux-form-material-ui'
import fileSelect from './LOCFileSelect';
import {TextField} from 'material-ui';
// import globalStyles from '../../../styles';
import validate from './LOCValidate';

const renderTextField = ({ input, label, hint, meta: { touched, error }, ...custom }) => (
    <TextField hintText={hint}
               floatingLabelText={label}
               fullWidth={false}
               errorText={touched && error}
               {...input}
               {...custom}
    />
);

const mapStateToProps = state => {
    const loc = state.get("loc").toJS();
    return ({
        initialValues: {
            ...loc,
            expDate: new Date(+loc.expDate)
        }
    })
};

const mapDispatchToProps = null;

@reduxForm({
    form: 'LOCForm',
    validate,
})
// @connect(mapStateToProps, mapDispatchToProps)
class LOCForm extends Component {

    render() {
        const {
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit} name="LOCFormName">

                <Field component={renderTextField}
                       name="locName"
                       floatingLabelText="LOC title"
                />
                <br />

                <Field component={renderTextField}
                       style={{marginTop: -14}}
                       name="website"
                       hintText="http://..."
                       floatingLabelText="website"
                />

                <Field component={fileSelect}
                       name="publishedHash"
                       loc={this.props.loc}
                />

                <Field component={DatePicker}
                       name="expDate"
                       hintText="Expiration Date"
                       floatingLabelText="Expiration Date"
                />

                <h3 style={{marginTop: 20}}>Issuance parameters</h3>
                <Field component={renderTextField}
                       style={{marginTop: -8}}
                       name="issueLimit"
                       type="number"
                       floatingLabelText="Allowed to be issued"
                />
                <br />
                <Field component={renderTextField}
                       name="fee"
                       floatingLabelText="Insurance fee"
                       hintText={"0.0%"}
                       floatingLabelFixed={true}
                       style={{marginTop: -8, pointerEvents: 'none'}}
                />

                <Field component={renderTextField} name="address" style={{display: 'none'}}/>

            </form>
        );
    }
}

const mergeProps = null;
const options = {withRef: true};
LOCForm = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
)(LOCForm);

export default LOCForm;