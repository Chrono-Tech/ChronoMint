import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import styles from '../styles';

const mapStateToProps = (state) => ({
    contract: state.get('settingsOtherContracts').selected, /** @see AbstractOtherContractModel **/
});

const mapDispatchToProps = (dispatch) => ({

});

@connect(mapStateToProps, mapDispatchToProps)
class OtherContractModal extends Component {
    handleSubmit = (values) => {
        this.handleClose();
    };

    handleSubmitClick = () => {

    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open} = this.props;
        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={'Add'}
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    {'Add other contract'}
                    <IconButton style={styles.close} onTouchTap={this.handleClose}><NavigationClose /></IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={styles.container}
                titleStyle={styles.title}
                modal={true}
                open={open}>

                Hey man! Look at look at me, I'm on the radio!!!

            </Dialog>
        );
    }
}

export default OtherContractModal;