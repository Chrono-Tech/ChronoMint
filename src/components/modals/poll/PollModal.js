import {connect} from 'react-redux';
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import PollForm from '../../forms/PollForm/PollForm';
import {newPoll} from '../../../redux/ducks/polls/data';
import globalStyles from '../../../styles';
import Options from './Options';

const mapStateToProps = state => {
    const poll = state.get("poll");
    return ({index: poll.index(), options: poll.options(), pollTitle: poll.pollTitle(), pollDescription: poll.pollDescription()})
};
@connect(mapStateToProps)
class PollModal extends Component {

    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let jsValues = values.toJS();
        newPoll({...jsValues, account});
        // this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.PollForm.getWrappedInstance().submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, index, pollTitle, pollDescription, pristine, submitting, options} = this.props;
        const actions = [
            <FlatButton
                label="Close"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Deploy"
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
                    {pollTitle}
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
                    {pollDescription}
                </div>
                <Options options={options} pollKey={index} />
                <PollForm ref="PollForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default PollModal;