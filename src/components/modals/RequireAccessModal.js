import React, {Component} from 'react';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Dialog, FlatButton, RaisedButton} from 'material-ui';
import ProfileForm from '../forms/ProfileForm';
import styles from './styles';
import UserModel from '../../models/UserModel';
import CBEModel from '../../models/CBEModel';
import {updateUserProfile} from '../../redux/ducks/session/data';
import {treatCBE} from '../../redux/ducks/settings/cbe';
import {login} from '../../redux/ducks/session/data';

const mapDispatchToProps = (dispatch) => ({
    updateProfile: (profile: UserModel, account) => dispatch(updateUserProfile(profile, account)),
    treatCBE: (cbe: CBEModel, account) => dispatch(treatCBE(cbe, account)),
    login: (account) => dispatch(login(account))
});

@connect(null, mapDispatchToProps)
class RequireAccessModal extends Component {
    handleSubmit = (values) => {
        this.props.login(this.props.account).then(() => {
            this.props.treatCBE(new CBEModel({
                address: this.props.account,
                name: values.get('name')
            }), this.props.account).then(() => {
                this.props.updateProfile(new UserModel(values), this.props.account);
            });
        });
        this.handleClose();
    };

    handleSubmitClick = () => {
        this.refs.ProfileForm.getWrappedInstance().submit();
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
                label={'Require'}
                primary={true}
                onTouchTap={this.handleSubmitClick}
            />,
        ];

        return (
            <Dialog
                title={<div>
                    Require Access
                    <IconButton style={styles.close} onTouchTap={this.handleClose}>
                        <NavigationClose />
                    </IconButton>
                </div>}
                actions={actions}
                actionsContainerStyle={styles.container}
                titleStyle={styles.title}
                modal={true}
                open={open}>

                <ProfileForm ref="ProfileForm" onSubmit={this.handleSubmit}/>

            </Dialog>
        );
    }
}

export default RequireAccessModal;