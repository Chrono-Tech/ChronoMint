import React, {Component} from 'react'
import ModalContainer from '../containers/modal'

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

export default Auth
