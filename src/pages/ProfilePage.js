import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {Field} from 'redux-form/immutable';
import {Paper, FlatButton, RaisedButton} from 'material-ui';
import ProfileForm from '../components/forms/ProfileForm';
import styles from '../styles';
import UserModel from '../models/UserModel';
import {updateUserProfile} from '../redux/ducks/session/data';

const mapDispatchToProps = (dispatch) => ({
    handleClose: () => dispatch(push('/')),
    updateProfile: (profile: UserModel) => dispatch(updateUserProfile(profile))
});

@connect(null, mapDispatchToProps)
class ProfilePage extends Component {
    handleSubmit = (values) => {
        this.props.updateProfile(new UserModel(values.toJS()));
        this.props.handleClose();
    };

    handleSubmitClick = () => {
        this.refs.ProfileForm.getWrappedInstance().submit();
    };

    render() {
        return (
            <div>
                <span style={styles.navigation}>ChronoMint / Profile</span>
                <Paper style={styles.paper}>
                    <h3 style={styles.title}>Profile</h3>

                    <ProfileForm ref="ProfileForm" onSubmit={this.handleSubmit}/>

                    <p>&nbsp;</p>
                    <RaisedButton
                        label={'Save'}
                        primary={true}
                        onTouchTap={this.handleSubmitClick}
                    />
                    <FlatButton
                        label="Cancel"
                        onTouchTap={this.props.handleClose}
                    />
                </Paper>
            </div>
        );
    }
}

export default ProfilePage;