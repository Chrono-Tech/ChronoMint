import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Paper,
    Divider,
    CircularProgress
} from 'material-ui';
import ExchangeForm from './ExchangeForm';
import ExchangeDAO from '../../../dao/ExchangeDAO';

import globalStyles from '../../../styles';

const mapStateToProps = (state) => ({
    exchange: state.get('exchangeData'),
    isFetching: state.get('exchangeCommunication').isFetching
});

@connect(mapStateToProps, null)
class ExchangeWidget extends Component {

    componentDidMount() {
        ExchangeDAO.watchError();
    }

    exchangeLHTOperation = (values) => {
        const {exchange} = this.props;
        if (values.get('buy')) {
            const {sellPrice} = exchange.get(values.get('currency'));
            ExchangeDAO.buy(values.get('amount') * 100, sellPrice, values.get('account'));
        } else {
            const {buyPrice} = exchange.get(values.get('currency'));
            ExchangeDAO.sell(values.get('amount') * 100, buyPrice, values.get('account'));
        }
    };

    handleSubmit = (values) => {
        switch(values.get('currency')) {
            case 'LHT':
                this.exchangeLHTOperation(values);
                return;
            default:
                return false;
        }
    };

    render() {
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Exchange tokens</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                {
                    this.props.isFetching ?
                        (
                            <div style={{textAlign: 'center', height: 270, position: 'relative'}}>
                                <CircularProgress
                                    style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}
                                    thickness={2.5} />
                            </div>
                        ) : <ExchangeForm onSubmit={this.handleSubmit}/>
                }
            </Paper>
        );
    }
}

export default ExchangeWidget;