import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from '../forms/LOCForm/LOCForm';
import {proposeLOC, editLOC, removeLOC} from '../../redux/ducks/locs';
import globalStyles from '../../styles';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


class LOCModal extends Component {
    handleSubmit = (values) => {
        let account = localStorage.getItem('chronoBankAccount');
        let address = values.get('address');
        if (!address) {
            proposeLOC({...values.toJS(), account});
        } else {
            editLOC({...values.toJS(), account, address});
        }
        //this.props.callback({locName, issueLimit, expDate, publishedHash, account});
        this.props.hideModal();
    };

    handleSubmitClick = () => {
        this.refs.LOCForm.getWrappedInstance().submit();
    };

    handleDeleteClick = () => {
        let address = this.refs.LOCForm.getWrappedInstance().props.loc.address;
        removeLOC({address});
        this.props.hideModal();
    };

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {open, loc, pristine, submitting} = this.props;
        const actions = [
            loc.address?<FlatButton
                label="Delete LOC"
                style={{...globalStyles.flatButton, float: 'left'}}
                labelStyle={globalStyles.flatButtonLabel}
                onTouchTap={this.handleDeleteClick.bind(this)}
            />:"",
            <FlatButton
                label="Cancel"
                style={globalStyles.flatButton}
                labelStyle={globalStyles.flatButtonLabel}
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={loc?"Save changes":"Create LOC"}
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
                    New LOC
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
                <LOCForm ref="LOCForm" onSubmit={this.handleSubmit} loc={loc} />
            </Dialog>
        );
    }
}

export default LOCModal;