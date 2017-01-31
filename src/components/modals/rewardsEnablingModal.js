import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton, TextField} from 'material-ui';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import globalStyles from '../../styles';

class rewardsEnablingModal extends Component {

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open} = this.props;
        const actions = [
            <FlatButton
                label="More info"
                style={{...globalStyles.cyanFlatButton, float: 'left'}}
                labelStyle={globalStyles.cyanButtonLabel}
                //onTouchTap={this.handleSubmitClick.bind(this)}
            />,
            <FlatButton
                label="Cancel"
                style={globalStyles.cyanButton}
                labelStyle={globalStyles.cyanButtonLabel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Lock Tokens"
                buttonStyle={globalStyles.cyanRaisedButton}
                labelStyle={globalStyles.cyanRaisedButtonLabel}
                //onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                actionsContainerStyle={{padding:26}}
                title={<div>
                    Important information about enabling Rewards contract
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.handleClose}>
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
                </div>
                <TextField
                    floatingLabelText="Amount to be locked:"
                    fullWidth={false}
                    value="4200"
                    errorText="Amount is greater than your TIME balance"
                />
            </Dialog>
        );
    }
}

export default rewardsEnablingModal;