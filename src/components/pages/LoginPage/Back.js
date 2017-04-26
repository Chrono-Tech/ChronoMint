import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatButton } from 'material-ui'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import styles from './styles'
import { clearWeb3Provider } from '../../../redux/network/networkAction'

const mapDispatchToProps = (dispatch) => ({
  clearWeb3Provider: () => dispatch(clearWeb3Provider())
})

@connect(null, mapDispatchToProps)
class Back extends Component {
  handleBackClick = () => {
    this.props.clearWeb3Provider()
    this.props.onBack && this.props.onBack()
  }

  render () {
    return (
      <FlatButton
        label='Back'
        onTouchTap={this.handleBackClick}
        style={styles.backBtn}
        icon={<ArrowBack />} />
    )
  }
}

export default Back
