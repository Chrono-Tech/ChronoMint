import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../../styles'
import { storeLOCAction } from '../../../redux/locs/locForm/actions'
import { showSendToExchangeModal, showLOCModal } from '../../../redux/ui/modal'

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
      <div>
        <span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
        label='NEW LOC'
        primary
        style={{verticalAlign: 'text-bottom', fontSize: 15}}
        onTouchTap={this.handleShowLOCModal}
        buttonStyle={{...globalStyles.raisedButton}}
        labelStyle={globalStyles.raisedButtonLabel}
      />
        <RaisedButton
          label='SEND TO EXCHANGE'
          primary
          style={{fontSize: 15, marginLeft: 16}}
          onTouchTap={this.props.handleShowSendToExchangeModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
