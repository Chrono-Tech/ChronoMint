import {connect} from 'react-redux';
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton} from 'material-ui';
import globalStyles from '../../../styles';
import Options from './Options';

const mapStateToProps = state => {
    const index = state.get('poll');
    const poll = state.get('polls').get(index);
    return ({index: poll.index(), options: poll.options(), pollTitle: poll.pollTitle(), pollDescription: poll.pollDescription()})
};
@connect(mapStateToProps)
class PollModal extends Component {

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
            </Dialog>
        );
    }
}

export default PollModal;