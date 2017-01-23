import React, {Component} from 'react';
import {Paper, TextField, Divider} from 'material-ui';
import {connect} from 'react-redux';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import globalStyles from '../../../styles';

const styles = {
    paper: {
        width: '100%',
        height: 100
    },
    block: {
        padding: '12px 14px 13px 14px'
    },
    icon: {
        color: globalStyles.title.color,
        verticalAlign: 'top'
    },
    currencies: {
        marginTop: 24
    },
    currency: {
        float: 'right',
        fontSize: 16,
        fontWeight: 300
    },
    value: {
        float: 'right',
        fontSize: 16,
        fontWeight: 500
    },
    divider: {
        backgroundColor: globalStyles.title.color
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
                <h3 style={globalStyles.title}>Balances</h3>
                <Divider style={{backgroundColor: globalStyles.title.color}}/>

                <TextField
                    floatingLabelText="Account"
                    fullWidth={true}
                    value={this.props.account || ""}
                    disabled={true}>
                </TextField>

                <div className="row" style={styles.currencies}>
                    <div className="col-sm-4">
                        <Paper style={styles.paper} zDepth={1}>
                            <div style={styles.block}>
                                <AccountBalanceIcon style={styles.icon} />
                                <span style={styles.currency}>ETH</span>
                            </div>
                            <Divider style={styles.divider}/>
                            <div style={styles.block}>
                                <span style={styles.value}>1.0000</span>
                            </div>
                        </Paper>
                    </div>
                    <div className="col-sm-4">
                        <Paper style={styles.paper} zDepth={1}>
                            <div style={styles.block}>
                                <AccountBalanceIcon style={styles.icon} />
                                <span style={styles.currency}>LHT</span>
                            </div>
                            <Divider style={styles.divider}/>
                            <div style={styles.block}>
                                <span style={styles.value}>100</span>
                            </div>
                        </Paper>
                    </div>
                    <div className="col-sm-4">
                        <Paper style={styles.paper} zDepth={1}>
                            <div style={styles.block}>
                                <AccountBalanceIcon style={styles.icon} />
                                <span style={styles.currency}>TIME</span>
                            </div>
                            <Divider style={styles.divider}/>
                            <div style={styles.block}>
                                <span style={styles.value}>98</span>
                            </div>
                        </Paper>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default BalancesWidget;