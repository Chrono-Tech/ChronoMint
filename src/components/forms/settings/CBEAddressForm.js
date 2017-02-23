import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';
import isEthAddress from '../../../utils/isEthAddress';

const mapStateToProps = (state) => ({
    initialValues: state.get('settingsCBE').selected
});

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
    form: 'SettingsCBEAddressForm', validate: values => {
        const errors = {};

        if (!values.get('address')) {
            errors.address = 'Required'
        } else if (!isEthAddress(values.get('address'))) {
            errors.address = 'Should be valid ethereum account address'
        }

        if (!values.get('name')) {
            errors.name = 'Required'
        } else if (values.get('name').length < 3) {
            errors.name = 'Member name should have length more than 3 symbols'
        }

        return errors;
    }
})
class CBEAddressForm extends Component {
    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field component={TextField}
                       name="address"
                       style={{width: '100%'}}
                       floatingLabelText="Ethereum account"
                       disabled={this.props.initialValues.address() != null}
                />
                <Field component={TextField}
                       name="name"
                       style={{width: '100%'}}
                       floatingLabelText="Member name"
                />
            </form>
        );
    }
}

export default CBEAddressForm;