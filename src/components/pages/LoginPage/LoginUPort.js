import React, { Component } from 'react'
import styles from './styles'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  // TODO @dkchv
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends Component {
  handleLoginClick = () => {
    // TODO @dkchv
  }

  render () {
    return (
      <RaisedButton
        label={`Uport Login`}
        primary
        fullWidth
        onTouchTap={this.handleLoginClick}
        style={styles.loginBtn} />
    )
  }
}

export default LoginUPort
