import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton, TextField} from 'material-ui';

const styles = {
    cancel: {
        marginRight: 10
    }
};

class rewardsEnablingModal extends Component {

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                style={styles.cancel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Lock Tokens"
                primary={true}
                //onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={"Important information about enabling Rewards contract"}
                actions={actions}
                modal={false}
                open={open}>
                <p>Only TIME token holders are eligible for rewards from Chronobank ecosystem operation.</p>
                <p>This operation grants Rewards contract a right to temporarily lock specified amount of TIME tokens on
                    your account. This serves as a measure to enforce fair usage of TIME tokens to get reward for the
                    period only once. The amount that would be locked determines the amount of your share of total revenue
                    that will be divided between shareholders at the end of each reward period. You'll be able to unlock
                    your TIME tokens anytime but then you'll be ineligible for getting rewards in this period untill you
                    lock them again.
                </p>
                <TextField
                       floatingLabelText="Amount to be locked:"
                       fullWidth={false} />
            </Dialog>
        );
    }
}

export default rewardsEnablingModal;