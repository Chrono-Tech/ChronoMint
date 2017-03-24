import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import ChangeNumberSignaturesForm from '../forms/operations/ChangeNumberSignaturesForm';
import { setRequiredSignatures } from '../../redux/ducks/pendings/actions';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const mapDispatchToProps = (dispatch) => ({
    setRequiredSignatures: (required, account, hideModal) => dispatch(setRequiredSignatures(required, account, hideModal)),
});

const mapStateToProps = (state) => ({
    operationsProps: state.get('operationsProps'),
});

@connect(mapStateToProps, mapDispatchToProps)
class ChangeNumberSignaturesModal extends Component {

    handleSubmit = (values) => {
        const numberOfSignatures = +values.get('numberOfSignatures');
        this.props.setRequiredSignatures(numberOfSignatures, localStorage.chronoBankAccount, this.props.hideModal);
    };

    handleSubmitClick = () => {
        this.refs.ChangeNumberSignaturesForm.getWrappedInstance().submit();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, pristine, submitting} = this.props;
        const actions = [
            <FlatButton
                label="CANCEL"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={"SAVE"}
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
                    Change Number of Required Signatures
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
                <ChangeNumberSignaturesForm ref="ChangeNumberSignaturesForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default ChangeNumberSignaturesModal;