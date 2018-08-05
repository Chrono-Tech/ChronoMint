/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { addError } from '@chronobank/login/redux/network/actions'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import BackButton from '../../components/BackButton/BackButton'
import './LoginUPort.scss'
import { Button } from '../../settings'

const mapStateToProps = (state) => ({
  isLoading: state.get(DUCK_NETWORK).isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  loginUport: () => networkService.loginUport(),
  addError: (e) => dispatch(addError(e)),
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginUPort extends PureComponent {
  static propTypes = {
    addError: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    loginUport: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleLoginClick = this.handleLoginClick.bind(this)
  }

  async handleLoginClick () {
    try {
      await this.props.loginUport()
      this.props.onLogin()
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  render () {
    const { isLoading } = this.props

    return (
      <div styleName='root'>
        <BackButton
          onClick={this.props.onBack}
          to='options'
        />
        <Button
          label={isLoading
            ? (
              <CircularProgress
                style={{ verticalAlign: 'middle', marginTop: -2 }}
                size={24}
                thickness={1.5}
              />
            )
            : <Translate value='LoginUPort.login' />
          }
          disabled={isLoading}
          onTouchTap={this.handleLoginClick}
        />
      </div>
    )
  }
}

export default LoginUPort
