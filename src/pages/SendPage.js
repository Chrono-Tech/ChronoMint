import React, {Component} from 'react';
import {
    SendWidget,
    BalancesWidget,
    TransactionsWidget
} from '../components/pages/SendPage';

class SendPage extends Component {
    render() {
        return (
            <div>
                <SendWidget />
                <BalancesWidget />
                <TransactionsWidget />
            </div>
        );
    }
}

export default SendPage