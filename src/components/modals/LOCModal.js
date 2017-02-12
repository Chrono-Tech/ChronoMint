import React, {Component} from 'react';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import LOCForm from 'components/forms/LOCForm/LOCForm';
import {proposeLOC, editLOC, removeLOC} from '../../redux/ducks/locs/locs';
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
        //this.props.callback({name, issueLimit, expDate, publishedHash, account});
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
        const {open, loc} = this.props;
        const actions = [
            loc?<FlatButton
                label="Delete LOC"
                style={{...globalStyles.cyanFlatButton, float: 'left'}}
                labelStyle={globalStyles.cyanFlatButtonLabel}
                onTouchTap={this.handleDeleteClick.bind(this)}
            />:"",
            <FlatButton
                label="Cancel"
                style={globalStyles.cyanFlatButton}
                labelStyle={globalStyles.cyanFlatButtonLabel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={loc?"Save changes":"Create LOC"}
                buttonStyle={globalStyles.cyanRaisedButton}
                labelStyle={globalStyles.cyanRaisedButtonLabel}
                onTouchTap={this.handleSubmitClick.bind(this)}
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