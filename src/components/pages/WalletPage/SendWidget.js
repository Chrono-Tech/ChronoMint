import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Paper,
    Divider
} from 'material-ui';

import SendForm from './SendForm';


import globalStyles from '../../../styles';

import {
    transferEth,
    transferLht,
    transferTime
} from '../../../redux/ducks/wallet/wallet';

const mapDispatchToProps = (dispatch) => ({
    transferEth: (amount, recipient) => dispatch(transferEth(amount, recipient)),
    transferLht: (amount, recipient) => dispatch(transferLht(amount, recipient)),
    transferTime: (amount, recipient) => dispatch(transferTime(amount, recipient))
});

@connect(null, mapDispatchToProps)
class SendWidget extends Component {
    constructor() {
        super();
    }

    handleSubmit = (values) => {
        switch(values.get('currency')) {
            case 'ETH':
                this.props.transferEth(values.get('amount'), values.get('recipient'));
                break;
            case 'LHT':
                this.props.transferLht(values.get('amount'), values.get('recipient'));
                break;
            case 'TIME':
                this.props.transferTime(values.get('amount'), values.get('recipient'));
                break;
            default:
                return;
        }
    };


    render() {
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Send tokens</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <SendForm onSubmit={this.handleSubmit} />
            </Paper>
        );
    }
}

export default SendWidget;