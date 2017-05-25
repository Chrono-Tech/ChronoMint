import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../../styles'
import { storeLOCAction } from '../../../redux/locs/locForm/actions'
import { showSendToExchangeModal, showLOCModal } from '../../../redux/ui/modal'

const styles = {
  btn: {
    marginRight: 10,
    marginBottom: 10
  }
}

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: data => dispatch(showLOCModal(data)),
  prepareLocForm: loc => dispatch(storeLOCAction(loc)),
  handleShowSendToExchangeModal: () => dispatch(showSendToExchangeModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  handleShowLOCModal = () => {
    this.props.prepareLocForm()
    this.props.showLOCModal({locExists: false})
  }

  render () {
    return (
      <div style={globalStyles.title2Wrapper}>
        <h3 style={globalStyles.title2}>LOCs</h3>
        <RaisedButton
          label='NEW LOC'
          primary
          style={styles.btn}
          onTouchTap={this.handleShowLOCModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
        <RaisedButton
          label='SEND TO EXCHANGE'
          primary
          style={styles.btn}
          onTouchTap={this.props.handleShowSendToExchangeModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
