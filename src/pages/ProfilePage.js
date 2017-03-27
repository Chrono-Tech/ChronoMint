import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Paper, FlatButton, RaisedButton} from 'material-ui';
import ProfileForm from '../components/forms/ProfileForm';
import styles from '../styles';
import UserModel from '../models/UserModel';
import {updateUserProfile, goToHomePage} from '../redux/ducks/session/actions';

const mapStateToProps = (state) => ({
    isEmpty: state.get('session').profile.isEmpty()
});

const mapDispatchToProps = (dispatch) => ({
    handleClose: () => dispatch(goToHomePage(localStorage.getItem('chronoBankAccount'))),
    updateProfile: (profile: UserModel) => dispatch(updateUserProfile(profile, localStorage.getItem('chronoBankAccount')))
});

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends Component {
    handleSubmit = (values) => {
        this.props.updateProfile(new UserModel(values));
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

                    {this.props.isEmpty ? <b>Your profile is empty. Please specify at least your name.</b> : ''}

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