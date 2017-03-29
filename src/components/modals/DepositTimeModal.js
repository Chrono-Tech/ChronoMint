import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dialog, FlatButton, RaisedButton, TextField} from 'material-ui';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import globalStyles from '../../styles';
import {depositTime, withdrawTime, updateTimeBalance, updateTimeDeposit} from '../../redux/wallet/wallet';

const mapStateToProps = (state) => ({
    account: state.get('session').account,
    time: state.get('wallet').time,
});

const mapDispatchToProps = (dispatch) => ({
    depositTime: (amount, account, hideModal) => dispatch(depositTime(amount, account, hideModal)),
    withdrawTime: (amount, account, hideModal) => dispatch(withdrawTime(amount, account, hideModal)),
    updateBalance: () => dispatch(updateTimeBalance()),
    updateDeposit: (account) => dispatch(updateTimeDeposit(account))
});

@connect(mapStateToProps, mapDispatchToProps)
class DepositTimeModal extends Component {
    constructor() {
        super();

        this.state = {
            amount: null,
            error: null
        };
    }

    componentWillMount() {
        this.props.updateBalance();
        this.props.updateDeposit(localStorage.chronoBankAccount);
    }

    commonValidate = (value) => {
        this.setState({error: null, amount: +value});
        if (isNaN(value)) {
            this.setState({error: "Must be valid number"});
            return false;
        }else if (value <= 0) {
            this.setState({error: "Must be positive number"});
            return false;
        }
        return true;
    };

    handleDeposit = () => {
        if (!this.commonValidate(this.state.amount)) {
            return;
        }
        if (this.state.amount > this.props.time.balance / 100) {
            this.setState({error: "Insufficient funds. Must be less then " + this.props.time.balance / 100});
            return;
        }
        this.props.depositTime(this.state.amount * 100, this.props.account, this.props.hideModal);
    };

    handleWithdraw = () => {
        if (!this.commonValidate(this.state.amount)) {
            return;
        }
        if (this.state.amount > this.props.time.deposit / 100) {
            this.setState({error: "Insufficient funds. Must be less then " + this.props.time.deposit / 100});
            return;
        }
        this.props.withdrawTime(this.state.amount * 100, this.props.account, this.props.hideModal);
    };

    setAmount = (event, value) => {
        this.commonValidate(value);
    };

    render() {
        const {open} = this.props;
        const actions = [
            <FlatButton
                label="More info"
                style={{...globalStyles.flatButton, float: 'left'}}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
            />,
            <RaisedButton
                label="LOCK TOKENS"
                style={{marginRight: 22}}
                buttonStyle={globalStyles.raisedButton}
                labelStyle={globalStyles.raisedButtonLabel}
                primary={true}
                onTouchTap={this.handleDeposit}
            />,
            <RaisedButton
                label="WITHDRAW TOKENS"
                buttonStyle={globalStyles.raisedButton}
                labelStyle={globalStyles.raisedButtonLabel}
                primary={true}
                onTouchTap={this.handleWithdraw}
            />,
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.props.hideModal}
            />,
        ];

        return (
            <Dialog
                actionsContainerStyle={{padding:26}}
                title={<div>
                    Deposit and Withdraw Time Tokens
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.props.hideModal}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                modal={false}
                iconElementRight={<IconButton><NavigationClose /></IconButton>}
                open={open}>
                <div style={globalStyles.modalGreyText}>Time tokens could be purchased on exchanges, such as Catsrule
                    or Dogsareawesome
                    <p><b>Balance: {this.props.time.balance / 100}</b></p>
                    <p><b>Deposit: {this.props.time.deposit / 100}</b></p>
                </div>
                <TextField
                    floatingLabelText="Amount:"
                    fullWidth={false}
                    onChange={this.setAmount}
                    errorText={this.state.error}
                />
            </Dialog>
        );
    }
}

export default DepositTimeModal;