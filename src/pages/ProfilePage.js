import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Paper, FlatButton, RaisedButton, CircularProgress } from 'material-ui'
import ProfileForm from '../components/forms/ProfileForm'
import styles from '../styles'
import UserModel from '../models/UserModel'
import { showDepositTIMEModal } from '../redux/ui/modal'
import { requireTIME, updateTIMEBalance, updateTIMEDeposit } from '../redux/wallet/actions'
import { updateUserProfile } from '../redux/session/actions'
import ls from '../utils/localStorage'
import localStorageKeys from '../constants/localStorageKeys'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  isEmpty: state.get('session').profile.isEmpty(),
  isTimeDeposited: !!state.get('wallet').time.deposit,
  isTimeBalance: !!state.get('wallet').time.balance,
  isTimeFetching: !!state.get('wallet').time.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => dispatch(push('/')),
  updateBalance: (account) => dispatch(updateTIMEBalance(account)),
  updateDeposit: (account) => dispatch(updateTIMEDeposit(account)),
  updateProfile: (profile: UserModel) => dispatch(updateUserProfile(profile, ls(localStorageKeys.ACCOUNT))),
  handleDepositTime: () => dispatch(showDepositTIMEModal()),
  handleRequireTime: () => dispatch(requireTIME(ls(localStorageKeys.ACCOUNT)))
})

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends Component {
  componentWillMount () {
    this.props.updateBalance(this.props.account)
    this.props.updateDeposit(this.props.account)
  }

  handleSubmit = (values) => {
    this.props.updateProfile(new UserModel(values))
  }

  handleSubmitClick = () => {
    this.refs.ProfileForm.getWrappedInstance().submit()
  }

  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / Profile</span>

        <Paper style={styles.paper}>
          {!this.props.isTimeDeposited ? <p><b>Deposit TIME if you want get access to Voting and Rewards.</b></p> : ''}
          <div style={{marginTop: '-15px', float: 'left'}}>
            <RaisedButton
              label='REQUIRE TIME'
              primary
              style={{marginTop: 33, marginBottom: 15}}
              onTouchTap={this.props.handleRequireTime}
              buttonStyle={{...styles.raisedButton}}
              labelStyle={styles.raisedButtonLabel}
              disabled={this.props.isTimeFetching || this.props.isTimeBalance}
            />
            <RaisedButton
              label='DEPOSIT OR WITHDRAW TIME TOKENS'
              primary
              style={{marginLeft: 22, marginRight: 22}}
              onTouchTap={this.props.handleDepositTime}
              buttonStyle={{...styles.raisedButton}}
              labelStyle={styles.raisedButtonLabel}
              disabled={this.props.isTimeFetching || !this.props.isTimeBalance}
            />
          </div>
          <div style={{clearfix: 'both'}}>&nbsp;</div>
          <div style={{marginTop: '-3px', marginBottom: '15px'}}>{this.props.isTimeFetching
            ? <CircularProgress size={24} thickness={1.5} style={{marginLeft: '30px'}} /> : <span>&nbsp;</span>}</div>
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
