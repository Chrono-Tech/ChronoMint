import React, {Component} from 'react';
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

import globalStyles from '../../../styles';

const styles = {
    columns: {
        id: {
            width: '10%'
        },
        hash: {
            width: '70%'
        },
        status: {
            width: '20%'
        }
    }
};

class TransactionsWidget extends Component {
    render() {
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Transactions</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.id}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.hash}>Hash</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.status}>Status</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn style={styles.columns.id}>1</TableRowColumn>
                            <TableRowColumn style={styles.columns.hash}>0x5472d3837b56f643d0169b98a701e9724de2a4369082e1b8d95f817369c73a2e</TableRowColumn>
                            <TableRowColumn style={styles.columns.status}>Pending</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default TransactionsWidget;