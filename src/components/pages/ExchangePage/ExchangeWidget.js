import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Paper,
    TextField,
    SelectField,
    MenuItem,
    Divider,
    RaisedButton
} from 'material-ui';

import globalStyles from '../../../styles';

const styles = {
    label: {
        fontWeight: 300
    },
    value: {
        float: 'right',
        fontWeight: 500
    },
    btn: {
        marginTop: 10
    }
};
const mapStateToProps = (state) => ({
    account: state.get('session').account
});

@connect(mapStateToProps, null)
class ExchangeWidget extends Component {
    constructor() {
        super();
        this.state = {
            currenciesFrom: ['ETH', 'LHT', 'TIME'],
            selectedCurrencyFrom: 'ETH',
            currenciesTo: ['USD', 'EUR', 'AUD'],
            selectedCurrencyTo: 'USD'
        }
    }

    handleChange = (event, index, value) => {
      this.setState({selectedCurrency: value});
    };

    render() {
        const {currenciesFrom, currenciesTo} = this.state;
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Exchange tokens</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <div className="row">
                    <div className="col-sm-12">
                        <TextField floatingLabelText="Account"
                                   value={this.props.account || ""}
                                   disabled={true}
                                   fullWidth={true} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <TextField floatingLabelText="Amount"
                                   floatingLabelFixed={true}
                                   hintText="0.0"
                                   fullWidth={true}/>
                    </div>
                    <div className="col-sm-6">
                        <SelectField
                            floatingLabelText="From"
                            value={this.state.selectedCurrencyFrom}
                            fullWidth={true}
                            onChange={this.handleChange}>
                            {currenciesFrom.map(c => <MenuItem key={c} value={c} primaryText={c} />)}
                        </SelectField>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <TextField floatingLabelText="Receive"
                                   floatingLabelFixed={true}
                                   disabled={true}
                                   hintText="0.0"
                                   fullWidth={true}/>
                    </div>
                    <div className="col-sm-6">
                        <SelectField
                            floatingLabelText="To"
                            value={this.state.selectedCurrencyTo}
                            fullWidth={true}
                            onChange={this.handleChange}>
                            {currenciesTo.map(c => <MenuItem key={c} value={c} primaryText={c} />)}
                        </SelectField>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <RaisedButton label="Exchange"
                                      style={styles.btn}
                                      primary={true}
                                      fullWidth={true}
                                      onTouchTap={this.handleClick}/>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default ExchangeWidget;