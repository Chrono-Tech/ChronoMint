import React, { Component } from 'react'
import { connect } from 'react-redux'
import TwoFaEnableForm from 'components/wallet/TwoFaEnableForm/TwoFaEnableForm'
import './TwoFAContent.scss'

const mapStateToProps = (state, ownProps) => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TwoFAContent extends Component {
  static propTypes = {}

  render () {
    return (
      <div styleName='root'>
        <TwoFaEnableForm />
      </div>
    )
  }
}
