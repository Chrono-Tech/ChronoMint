import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import NewPollForm from '../forms/NewPollForm/NewPollForm';
import {newPoll} from '../../redux/ducks/polls/data';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class NewPollModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let jsValues = values.toJS();
        newPoll({...jsValues, account});
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.PollForm.getWrappedInstance().submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, pristine, submitting} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Create Poll"
                buttonStyle={globalStyles.raisedButton}
                labelStyle={globalStyles.raisedButtonLabel}
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
                disabled={pristine || submitting}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    New Poll
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.handleClose}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={{padding:26}}
                titleStyle={{paddingBottom:10}}
                modal={true}
                open={open}>
                <div style={globalStyles.modalGreyText}>
                    This operation must be co-signed by other CBE key holders before it is executed.
                </div>
                <NewPollForm ref="PollForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default NewPollModal;