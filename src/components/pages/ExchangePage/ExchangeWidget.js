import React, {Component} from 'react';
import ExchangeLhtDAO from '../../../dao/ExchangeLhtDAO';
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
            currencies: ['ETH', 'LHT', 'TIME'],
            selectedCurrencyFrom: 'ETH',
            selectedCurrencyTo: 'LHT',
            lhtSellPrice: 1,
            lhtBuyPrice: 1,
            amount: 0,
        }
    }

    componentWillMount() {
        ExchangeLhtDAO.getBuyPrice().then((price) => {
            this.setState({lhtBuyPrice: price.toNumber()});
        });

        ExchangeLhtDAO.getSellPrice().then((price) => {
            this.setState({lhtSellPrice: price.toNumber()});
        });
    }

    handleAmountChange = (event) => {
        this.setState({amount: event.target.value});
    };

    handleChangeFrom = (event, index, value) => {
        this.setState({selectedCurrencyFrom: value});
    };

    handleChangeTo = (event, index, value) => {
      this.setState({selectedCurrencyTo: value});
    };

    handleClick = () => {
        const {selectedCurrencyFrom, selectedCurrencyTo} = this.state;
        if (selectedCurrencyFrom === 'ETH') {
            if (selectedCurrencyTo === 'LHT') {
                ExchangeLhtDAO.sell(this.state.amount, this.state.lhtSellPrice, this.props.account);
            }
        }

        if (selectedCurrencyFrom === 'LHT') {
            if (selectedCurrencyTo === 'ETH') {
                ExchangeLhtDAO.buy(this.state.amount, this.state.lhtBuyPrice, this.props.account);
            }
        }
    };

    render() {
        const {currencies, selectedCurrencyFrom} = this.state;



        const receive = selectedCurrencyFrom === 'ETH' ?
            this.state.amount / this.state.lhtSellPrice : this.state.amount * this.state.lhtBuyPrice;
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
                            value={this.state.selectedCurrencyFrom}
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
                            value={this.state.selectedCurrencyTo}
                            fullWidth={true}
                            onChange={this.handleChangeTo}>
                            {currencies.map(c => c !== this.state.selectedCurrencyFrom && <MenuItem key={c} value={c} primaryText={c} />)}
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