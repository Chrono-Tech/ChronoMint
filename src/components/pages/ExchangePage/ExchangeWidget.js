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

import ExchangeDAO from '../../../dao/ExchangeDAO';

const mapStateToProps = (state) => ({
    account: state.get('session').account,
    exchange: state.get('exchange')
});

@connect(mapStateToProps, null)
class ExchangeWidget extends Component {
    constructor() {
        super();
        this.state = {
            currencies: ['ETH', 'LHT'],
            selectedCurrencyFrom: 'ETH',
            selectedCurrencyTo: 'LHT',
            amount: 0,
        }
    }

    componentDidMount() {
        ExchangeDAO.watchError();
    }

    handleAmountChange = (event) => {
        this.setState({amount: event.target.value});
    };

    handleChangeFrom = (event, index, value) => {
        this.setState({
            selectedCurrencyFrom: value,
            selectedCurrencyTo: this.state.selectedCurrencyFrom
        });
    };

    handleChangeTo = (event, index, value) => {
      this.setState({selectedCurrencyTo: value});
    };

    handleClick = () => {
        const {exchange} = this.props;

        if ( this.state.selectedCurrencyFrom === 'ETH') {
            const {sellPrice} = exchange.get(this.state.selectedCurrencyTo);
            ExchangeDAO.sell(this.state.amount, sellPrice, this.props.account).then(r => console.log(r));
        } else {
            const {buyPrice} = exchange.get(this.state.selectedCurrencyFrom);
            ExchangeDAO.buy(this.state.amount, buyPrice, this.props.account);
        }
    };

    render() {
        const {currencies, selectedCurrencyFrom, selectedCurrencyTo, amount} = this.state;
        const {exchange} = this.props;

        const {sellPrice, buyPrice} = this.state.selectedCurrencyFrom === 'ETH' ?
            exchange.get(this.state.selectedCurrencyTo) : exchange.get(this.state.selectedCurrencyFrom);

        let receive;
        if (this.state.selectedCurrencyFrom === 'ETH') {
            receive = amount / sellPrice;
        } else {
            receive = amount * buyPrice;
        }

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
                                   onChange={this.handleAmountChange}
                                   fullWidth={true}/>
                    </div>
                    <div className="col-sm-6">
                        <SelectField
                            floatingLabelText="From"
                            value={selectedCurrencyFrom}
                            fullWidth={true}
                            onChange={this.handleChangeFrom}>
                            {currencies.map(c => <MenuItem key={c} value={c} primaryText={c} />)}
                        </SelectField>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <TextField floatingLabelText="Receive"
                                   floatingLabelFixed={true}
                                   disabled={true}
                                   hintText="0.0"
                                   value={receive}
                                   fullWidth={true}/>
                    </div>
                    <div className="col-sm-6">
                        <SelectField
                            floatingLabelText="To"
                            value={selectedCurrencyTo}
                            fullWidth={true}
                            onChange={this.handleChangeTo}>
                            {currencies.map(c => c !== selectedCurrencyFrom && <MenuItem key={c} value={c} primaryText={c} />)}
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