import {connect} from 'react-redux';
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton} from 'material-ui';
import globalStyles from '../../../styles';
import Options from './Options';
import {votePoll} from '../../../redux/ducks/polls/data';

const mapDispatchToProps = (dispatch) => ({
    votePoll: (params, hideModal) => dispatch(votePoll(params, hideModal)),
});

const mapStateToProps = state => {
    const poll = state.get('poll');
    return ({index: poll.index(), options: poll.options(), pollTitle: poll.pollTitle(), pollDescription: poll.pollDescription()})
};

@connect(mapStateToProps, mapDispatchToProps)
class PollModal extends Component {

    handleClose = () => {
        this.props.hideModal();
    };

    handleVote = (pollKey, optionIndex) => {
        this.props.votePoll({pollKey, optionIndex}, this.props.hideModal);
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
                <Options options={options} pollKey={index} handleVote={this.handleVote} />
            </Dialog>
        );
    }
}

export default PollModal;