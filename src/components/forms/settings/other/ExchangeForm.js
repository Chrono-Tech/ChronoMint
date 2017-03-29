import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';
import {validate} from '../../../../models/contracts/ExchangeContractModel';

const mapStateToProps = (state) => ({
    initialValues: state.get('settingsOtherContracts').selected.settings()
});

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'SettingsExchangeForm', validate: values => {
    return validate(values); // TODO weird but if just specify validate callback without this wrapper it won't work
}})
class ExchangeForm extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <Field component={TextField}
                       name="buyPrice"
                       style={{width: '100%'}}
                       floatingLabelText="Buy price in wei"
                />
                <Field component={TextField}
                       name="sellPrice"
                       style={{width: '100%'}}
                       floatingLabelText="Sell price in wei"
                />
            </form>
        );
    }
}

export default ExchangeForm;