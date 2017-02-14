import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';

const mapStateToProps = (state) => ({
    initialValues: state.get('settingsTokens').form
});

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
    form: 'SettingsTokenForm', validate: values => {
        const errors = {};

        errors;
        values;

        return errors;
    }
})
class TokenForm extends Component {
    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit}>

            </form>
        );
    }
}

export default TokenForm;