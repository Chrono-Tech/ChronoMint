import React, {Component} from 'react';
import {connect} from 'react-redux';
import CBEAddressForm from 'components/forms/CBEAddressForm';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import {addCBE} from '../../redux/ducks/settings';

const mapDispatchToProps = (dispatch) => ({
    addCBE: (address) => dispatch(addCBE(address, localStorage.getItem('chronoBankAccount')))
});

@connect(null, mapDispatchToProps)
class CBEAddressModal extends Component {
    handleSubmit = (values) => {
        this.props.addCBE(values.get('address'));
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
                label="Add Address"
                primary={true}
                onTouchTap={this.handleSubmitClick.bind(this)}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    Add CBE Address
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