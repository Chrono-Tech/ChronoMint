import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Paper,
    Divider,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn
} from 'material-ui';
import {getTransactionsByAccount} from '../../../redux/ducks/wallet/wallet';

import globalStyles from '../../../styles';

const styles = {
    columns: {
        id: {
            width: '10%'
        },
        hash: {
            width: '60%'
        },
        time: {
            width: '20%'
        },
        value: {
            width: '10%'
        }
    }
};

const mapStateToProps = (state) => ({
   ethTransactions: state.get('wallet').eth.transactions
});

const mapDispatchToProps = (dispatch) => ({
    getTransactionsByAccount: (account) => dispatch(getTransactionsByAccount(account))
});

@connect(mapStateToProps, mapDispatchToProps)
class TransactionsWidget extends Component {
    componentWillMount() {
        this.props.getTransactionsByAccount(localStorage.getItem('chronoBankAccount'), 1000);
    }
    render() {
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Transactions</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.id}>Block Number</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.hash}>Hash</TableHeaderColumn>
                            <TableHeaderColumn>Time</TableHeaderColumn>
                            <TableHeaderColumn>Value</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.props.ethTransactions.valueSeq()
                                .reverse()
                                .map(tx => (
                                    <TableRow key={tx.blockNumber}>
                                        <TableRowColumn style={styles.columns.id}>{tx.blockNumber}</TableRowColumn>
                                        <TableRowColumn style={styles.columns.hash}>{tx.txHash}</TableRowColumn>
                                        <TableRowColumn style={styles.columns.time}>{tx.getTransactionTime()}</TableRowColumn>
                                        <TableRowColumn style={styles.columns.value}>
                                            {tx.getTransactionSign() + tx.getValue()}
                                            </TableRowColumn>
                                    </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default TransactionsWidget;