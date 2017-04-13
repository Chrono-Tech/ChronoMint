import React, { Component } from 'react'
import {connect} from 'react-redux'
import styles from './styles'
import { RaisedButton } from 'material-ui'
import {checkTestRPC} from '../../../redux/network/networkAction'

const mapStateToProps = (state) => ({
  isTestRPC: state.get('network').isTestRPC
})

const mapDispatchToProps = (dispatch) => ({
  checkRPC: () => dispatch(checkTestRPC())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginLocal extends Component {
  componentWillMount () {
    this.props.checkRPC()
  }

  render () {
    return (
      <RaisedButton label='Local (TestRPC) Login'
        primary
        fullWidth
        disabled={!this.props.isTestRPC}
        onTouchTap={() => this.props.onClick()}
        style={styles.loginBtn} />
    )
  }
}

export default LoginLocal
