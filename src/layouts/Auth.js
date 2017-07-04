import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ModalContainer from '../components/modals/Modal'
import './Auth.scss'

class Auth extends Component {
  render () {
    return (
      <div styleName='auth-layout'>
        {this.props.children}

        <ModalContainer />
      </div>
    )
  }
}

Auth.propTypes ={
  children: PropTypes.object
}

export default Auth
