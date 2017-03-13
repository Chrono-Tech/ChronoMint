import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form/immutable';
import {TextField} from 'redux-form-material-ui';
import * as validation from '../../validate';

const mapStateToProps = (state) => ({
    initialValues: state.get('settingsOtherContracts').selected.settings()
});

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'SettingsExchangeForm', validate: values => {
    const errors = {};
    errors.buyPrice = validation.positiveInt(values.get('buyPrice'));
    errors.sellPrice = validation.positiveInt(values.get('sellPrice'));

    if (!errors.sellPrice && parseInt(values.get('sellPrice'), 10) < parseInt(values.get('buyPrice'), 10)) {
        errors.sellPrice = 'Should be greater than or equal buy price.';
    }

    return errors;
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