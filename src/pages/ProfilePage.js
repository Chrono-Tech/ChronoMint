import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Paper, FlatButton, RaisedButton } from 'material-ui'
import ProfileForm from '../components/forms/ProfileForm'
import styles from '../styles'
import ProfileModel from '../models/ProfileModel'
import { showDepositTIMEModal } from '../redux/ui/modal'
import { updateTIMEDeposit, TIME, requireTIME } from '../redux/wallet/actions'
import { updateUserProfile } from '../redux/session/actions'

const mapStateToProps = (state) => {
  const time = state.get('wallet').tokens.get(TIME)
  return {
    profile: state.get('session').profile,
    isTimeBalance: time ? !!time.balance() : false,
    isTimeFetching: time ? !!time.isFetching() : true
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => dispatch(push('/')),
  updateDeposit: () => dispatch(updateTIMEDeposit()),
  updateProfile: (profile: ProfileModel) => dispatch(updateUserProfile(profile)),
  handleDepositTime: () => dispatch(showDepositTIMEModal()),
  requireTIME: () => dispatch(requireTIME())
})

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends Component {
  static propTypes = {
    isTimeFetching: PropTypes.bool,
    isTimeBalance: PropTypes.bool,
    profile: PropTypes.object,
    updateDeposit: PropTypes.func,
    updateProfile: PropTypes.func,
    handleDepositTime: PropTypes.func,
    handleClose: PropTypes.func,
    requireTIME: PropTypes.func
  }

  componentWillMount () {
    this.props.updateDeposit()
  }

  handleSubmit = (values) => {
    this.props.updateProfile(new ProfileModel(values.toJS()))
    this.props.handleClose()
  }

  handleSubmitClick = () => {
    this.profileForm.getWrappedInstance().submit()
  }

  render () {
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / Profile</span>
        <Paper style={styles.paper}>
          <h3 style={styles.title}>Profile</h3>

          {this.props.profile.isEmpty ? <p><b>Your profile is empty. Please at least specify your name.</b></p> : ''}

          <ProfileForm ref={i => { this.profileForm = i }} onSubmit={this.handleSubmit} />

          <p>&nbsp;</p>
          <RaisedButton
            label={'Save'}
            primary
            style={{marginRight: '20px'}}
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
