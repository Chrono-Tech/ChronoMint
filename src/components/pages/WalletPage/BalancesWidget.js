import React, {Component} from 'react';
import {Paper, TextField, Divider} from 'material-ui';
import {connect} from 'react-redux';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import globalStyles from '../../../styles';
import TimeProxyDAO from '../../../dao/TimeProxyDAO';

const styles = {
    paper: {
        width: '100%',
        height: 100
    },
    block: {
        padding: '12px 14px 13px 14px'
    },
    blockTop1: {
        padding: '12px 14px 13px 14px',
        backgroundColor: '#161240'
    },
    blockTop2: {
        padding: '12px 14px 13px 14px',
        backgroundColor: '#17579c'
    },
    blockTop3: {
        padding: '12px 14px 13px 14px',
        backgroundColor: '#4a8fb9'
    },
    icon: {
        color: '#fff',
        verticalAlign: 'top'
    },
    currencies: {
        marginTop: 24
    },
    currency: {
        float: 'right',
        color: '#fff',
        fontSize: 16,
        fontWeight: 400
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
        this.props.account && TimeProxyDAO.getAccountBalance(this.props.account).then(balance => {
            console.log(this.props.account);
            console.log(balance.toNumber())
        });
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
                            <div style={styles.blockTop1}>
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
                            <div style={styles.blockTop2}>
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
                            <div style={styles.blockTop3}>
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