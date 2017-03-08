import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dialog, FlatButton, RaisedButton, TextField} from 'material-ui';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import globalStyles from '../../../styles';

import VoteDAO from '../../../dao/VoteDAO';
import TimeProxyDAO from '../../../dao/TimeProxyDAO';

const mapStateToProps = (state) => ({
    account: state.get('sessionData').account,
});

@connect(mapStateToProps)
class VotingDepositModal extends Component {
    constructor() {
        super();

        this.state = {
            timeBalance: null,
            amount: null,
            error: null
        };
    }

    updateTimeBalance() {
        TimeProxyDAO.getAccountBalance(this.props.account)
            .then(balance => this.setState({timeBalance: balance.toNumber()}));
    };

    componentWillMount() {
        this.updateTimeBalance();
    };

    handleSubmit = () => {
        if (this.state.timeBalance / 100 < this.state.amount) {
            VoteDAO.depositAmount(this.state.amount * 100, this.props.account);
            this.props.hideModal();
        }
    };

    setAmount = (event, value) => {
        if (this.state.timeBalance / 100 < value) {
            this.setState({error: "Insufficient funds"});
        } else {
            this.setState({error: null, amount: value});
        }
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
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.props.hideModal}
            />,
            <RaisedButton
                label="Lock Tokens"
                buttonStyle={globalStyles.raisedButton}
                labelStyle={globalStyles.raisedButtonLabel}
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <Dialog
                actionsContainerStyle={{padding:26}}
                title={<div>
                    Important information about enabling Rewards contract ----- //todo
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.props.hideModal}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                modal={false}
                iconElementRight={<IconButton><NavigationClose /></IconButton>}
                open={open}>
                <div style={globalStyles.modalGreyText}>Only TIME token holders are eligible for rewards from Chronobank
                    ecosystem operation. Time tokens could be purchased on exchanges, such as Catsrule or Dogsareawesome<br />
                    <br />
                    This operation grants Rewards contract a right to temporarily lock specified amount of TIME tokens on
                    your account. This serves as a measure to enforce fair usage of TIME tokens to get reward for the
                    period only once. The amount that would be locked determines the amount of your share of total revenue
                    that will be divided between shareholders at the end of each reward period. You'll be able to unlock
                    your TIME tokens anytime but then you'll be ineligible for getting rewards in this period untill you
                    lock them again.
                    <br />
                    <b>Balance: {this.state.amount * 100}</b>
                </div>
                <TextField
                    floatingLabelText="Amount to be locked:"
                    fullWidth={false}
                    onChange={this.setAmount}
                    errorText={this.state.error}
                />
            </Dialog>
        );
    }
}

export default VotingDepositModal;