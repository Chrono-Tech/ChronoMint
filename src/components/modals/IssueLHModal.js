import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import IssueLHForm from '../forms/IssueLH/IssueLHForm';
import { updateLOC, issueLH } from '../../redux/ducks/locs/data';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const mapStateToProps = state => {
    const initialLoc = state.get('loc').toJS();
    return ({initialLoc})
};

const mapDispatchToProps = (dispatch) => ({
    updateLOC: (params) => dispatch(updateLOC(params)),
});

@connect(mapStateToProps, mapDispatchToProps)
class IssueLHModal extends Component {

    handleSubmit = (values) => {
        let oldIssued = this.props.initialLoc.issued.toNumber();
        const issueAmount = +values.get('issueAmount');
        let issued = oldIssued + issueAmount;
        let account = localStorage.getItem('chronoBankAccount');
        let locAddress = values.get('address');
        issueLH({account, issueAmount, locAddress})
            .then(r => {
                if (!r) return;
                this.props.updateLOC({issued, account, locAddress});
                this.props.hideModal();
            });
    };

    handleSubmitClick = () => {
        this.refs.IssueLHForm.getWrappedInstance().submit();
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
                label={"ISSUE LHUS"}
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
                    Issue LH
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
                <IssueLHForm ref="IssueLHForm" onSubmit={this.handleSubmit} />
            </Dialog>
        );
    }
}

export default IssueLHModal;