import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';
import {validate} from '../../../models/CBEModel';

const mapStateToProps = (state) => ({
    initialValues: state.get('settingsCBE').selected
});

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'SettingsCBEAddressForm', validate})
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