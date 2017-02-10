import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form/immutable';
import {
    Toggle,
    TextField,
    SelectField,
    MenuItem,
    RaisedButton
} from 'material-ui';

import validate from './ExchangeFormValidate';

const styles = {
    btn: {
        marginTop: 32
    },
    toggle: {
        marginTop: 20,
        marginBottom: 10
    }
};

const mapStateToProps = (state) => ({
    account: state.get('session').account,
    exchange: state.get('exchange'),
    initialValues: {
        account: state.get('session').account,
        currency: state.get('exchange').first().title,
        buy: true
    }
});

const renderTextField = ({ input, label, hint, meta: { touched, error }, ...custom }) => (
    <TextField hintText={hint}
               floatingLabelText={label}
               fullWidth={true}
               errorText={touched && error}
        {...input}
        {...custom}
    />
);

const renderToggleField = ({ input, label, hint, meta: { touched, error }, ...custom }) => (
    <Toggle label={input.value ? "Buying" : "Selling"}
            onToggle={() => input.onChange(!input.value)}
            toggled={input.value} />

);

const renderSelectField = ({ input, label, hintText, floatingLabelFixed, meta: { touched, error }, children, ...custom }) => (
    <SelectField
        floatingLabelText={label}
        floatingLabelFixed={floatingLabelFixed}
        errorText={touched && error}
        {...input}
        fullWidth={true}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom} />
);

@connect(mapStateToProps, null)
@reduxForm({form: 'sendForm', validate})
class ExchangeForm extends Component {
    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit} ref="form">
                <div className="row">
                    <div className="col-sm-12">
                        <Field name="account"
                               component={renderTextField}
                               floatingLabelFixed={true}
                               disabled={true}
                               floatingLabelText="Account" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <Field name="amount"
                               component={renderTextField}
                               floatingLabelFixed={true}
                               hintText="0.01"
                               floatingLabelText="Amount" />
                    </div>
                    <div className="col-sm-6">
                        <Field name="currency"
                               component={renderSelectField}
                               floatingLabelFixed={true}
                               floatingLabelText="Currency">
                            {this.props.exchange.valueSeq().map(asset =>
                                <MenuItem key={asset.title} value={asset.title} primaryText={asset.title} />)}
                        </Field>
                    </div>
                </div>

                <div className="row" style={styles.toggle}>
                    <div className="col-sm-12">
                        <Field name="buy"
                               component={renderToggleField} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <RaisedButton label="Exchange"
                                      style={styles.btn}
                                      primary={true}
                                      fullWidth={true}
                                      type="submit" />
                    </div>
                </div>
            </form>
        )
    }
}

export default ExchangeForm;