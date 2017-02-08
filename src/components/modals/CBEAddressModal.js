import React, {Component} from 'react';
import CBEAddressForm from 'components/forms/CBEAddressForm';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import CBEAddressDAO from '../../dao/CBEAddressDAO';

class CBEAddressModal extends Component {
    handleSubmit = (values) => {
        // TODO Reducer action
        values.get('address');
        CBEAddressDAO.add(values.get('address')).then(r => console.log(r));
    };

    handleSubmitClick = () => {
        this.refs.CBEAddressForm.submit();
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
                label="Add Member"
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    New CBE Address
                    <IconButton style={{float: 'right', margin: "-12px -12px 0px"}} onTouchTap={this.handleClose}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={{padding: 26}}
                titleStyle={{paddingBottom: 10}}
                modal={true}
                open={open}>

                <CBEAddressForm ref="CBEAddressForm" onSubmit={this.handleSubmit}/>

            </Dialog>
        );
    }
}

export default CBEAddressModal;