import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import {TextField} from 'material-ui';
import validate from './validate';
import globalStyles from '../../../styles';

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
    const loc = state.get('locs').get(state.get('loc')).toJS();
    validate.issueLimit = loc.issueLimit.toNumber();
    return ({
        loc,
        initialValues: {
            address: loc.address,
            issueAmount: 0
        }
    })
};

const mapDispatchToProps = null;
const mergeProps = null;
const options = {withRef: true};

@connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
@reduxForm({
    form: 'IssueLHForm',
    validate: validate.bind(validate),
})
class IssueLHForm extends Component {

    render() {
        const {
            handleSubmit,
            loc,
        } = this.props;
        return (
            <form onSubmit={handleSubmit} name="IssueLHFormName">

                <div style={globalStyles.modalGreyText}>
                    <p>Allowed to be issued on behalf of {loc.locName}: {loc.issueLimit.toString()} LHUS</p>
                    <p>This operation must be co-signed by other CBE key holders before it is executed. Corresponding
                    fees will be deducted from this amount</p>
                </div>

                <Field component={renderTextField}
                       style={globalStyles.form.textField}
                       name="issueAmount"
                       type="number"
                       floatingLabelText="Almount to be issued"
                />

                <Field component={renderTextField} name="address" style={{display: 'none'}}/>

            </form>
        );
    }
}

export default IssueLHForm;