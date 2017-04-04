import React, {Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Paper, FlatButton, RaisedButton} from 'material-ui'
import ProfileForm from '../components/forms/ProfileForm'
import styles from '../styles'
import UserModel from '../models/UserModel'
import {showDepositTimeModal} from '../redux/ui/modal'
import {requireTime} from '../redux/wallet/wallet'
import {updateUserProfile} from '../redux/session/actions'

const mapStateToProps = (state) => ({
  isEmpty: state.get('session').profile.isEmpty(),
  isTimeDeposited: !!state.get('wallet').time.deposit
})

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => dispatch(push('/')),
  updateProfile: (profile: UserModel) => dispatch(updateUserProfile(profile, window.localStorage.getItem('chronoBankAccount'))),
  showDepositTimeModal: () => dispatch(showDepositTimeModal()),
  requireTime: () => dispatch(requireTime(window.localStorage.getItem('chronoBankAccount')))
})

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends Component {
  handleSubmit = (values) => {
    this.props.updateProfile(new UserModel(values))
  };

  handleSubmitClick = () => {
    this.refs.ProfileForm.getWrappedInstance().submit()
  };

  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / Profile</span>

        <Paper style={styles.paper}>
          {!this.props.isTimeDeposited ? <p><b>Deposit TIME if you want get access to Voting and Rewards.</b></p> : ''}
          <div style={{marginTop: '-15px'}}>
            <RaisedButton
              label='Require TIME'
              primary
              style={{marginTop: 33, marginBottom: 15}}
              onTouchTap={this.props.requireTime}
              buttonStyle={{...styles.raisedButton}}
              labelStyle={styles.raisedButtonLabel}
            />
            <RaisedButton
              label='DEPOSIT TIME TOKENS'
              primary
              style={{marginLeft: 22}}
              onTouchTap={this.props.showDepositTimeModal}
              buttonStyle={{...styles.raisedButton}}
              labelStyle={styles.raisedButtonLabel}
            />
          </div>
        </Paper>

        <br />

        <Paper style={styles.paper}>
          <h3 style={styles.title}>Profile</h3>

          {this.props.isEmpty ? <p><b>Your profile is empty. Please at least specify your name.</b></p> : ''}

          <ProfileForm ref='ProfileForm' onSubmit={this.handleSubmit} />

          <p>&nbsp;</p>
          <RaisedButton
            label={'Save'}
            primary
            onTouchTap={this.handleSubmitClick}
          />
          <FlatButton
            label='Cancel'
            onTouchTap={this.props.handleClose}
          />
        </Paper>
      </div>
    )
  }
}

export default ProfilePage
