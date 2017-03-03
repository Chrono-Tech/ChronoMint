import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';
import isEthAddress from '../../../utils/isEthAddress';

@connect(null, null, null, {withRef: true})
@reduxForm({
    form: 'SettingsTokenForm', validate: values => {
        const errors = {};

        if (!values.get('address')) {
            errors.address = 'Required'
        } else if (!isEthAddress(values.get('address'))) {
            errors.address = 'Should be valid contract address'
        }

        return errors;
    }
})
class TokenForm extends Component {
    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field component={TextField}
                       name="address"
                       style={{width: '100%'}}
                       floatingLabelText="Token asset or proxy contract address"
                />
            </form>
        );
    }
}

export default TokenForm;