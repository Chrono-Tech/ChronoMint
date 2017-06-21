import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ModalContainer from '../components/modals/Modal'

class Auth extends Component {
  render () {
    return (
      <div className='auth-layout'>
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
