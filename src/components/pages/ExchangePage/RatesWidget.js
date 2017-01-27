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
import {connect} from 'react-redux';
import globalStyles from '../../../styles';

const styles = {
    columns: {
        currency: {
            width: '25%'
        },
        eth: {
            width: '25%'
        },
        lht: {
            width: '25%'
        },
        time: {
            width: '25%'
        }
    }
};

const mapStateToProps = (state) => ({
    account: state.get('session').account
});

@connect(mapStateToProps, null)
class BalancesWidget extends Component {
    render() {
        return (
            <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
                <h3 style={globalStyles.title}>Exchange rates</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <Table selectable={false} height={211} fixedHeader={true}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.currency} />
                            <TableHeaderColumn style={styles.columns.eth}>ETH</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.lht}>LHT</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.time}>TIME</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} showRowHover={true}
                               stripedRows={true}>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>USD</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>10</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>20</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>25</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>EUR</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>7</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>16</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>22</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>AUD</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>15</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>30</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>35</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>CAD</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>15</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>30</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>35</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>RUB</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>1500</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>3000</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>3500</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn style={styles.columns.currency}>UAH</TableRowColumn>
                            <TableRowColumn style={styles.columns.eth}>800</TableRowColumn>
                            <TableRowColumn style={styles.columns.lht}>1500</TableRowColumn>
                            <TableRowColumn style={styles.columns.time}>1750</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>

            </Paper>
        );
    }
}

export default BalancesWidget;