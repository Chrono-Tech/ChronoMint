import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import { DatePicker } from 'redux-form-material-ui'
import FileSelect from '../../common/IPFSFileSelect';
import {TextField} from 'material-ui';
import validate from './validate';

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
            expDate: new Date(loc.expDate.toNumber())
        }
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
            initialValues
        } = this.props;
        return (
            <form onSubmit={handleSubmit} name="PollFormName">

                <Field component={renderTextField}
                       name="pollName"
                       floatingLabelText="Poll title"
                />
                <br />

                <Field component={renderTextField}
                       style={{marginTop: -14}}
                       name="website"
                       hintText="http://..."
                       floatingLabelText="website"
                />

                <Field component={FileSelect}
                       name="publishedHash"
                       initPublishedHash={initialValues.get('publishedHash')}
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

export default PollForm;