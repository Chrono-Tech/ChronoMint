// TODO MINT-266 New LOC
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../styles'
import { showSendToExchangeModal, showLOCModal } from '../../redux/ui/modal'
import { Translate } from 'react-redux-i18n'
import LOCModel from '../../models/LOCModel'

const styles = {
  btn: {
    marginRight: 10,
    marginBottom: 10
  }
}

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: (loc: LOCModel) => dispatch(showLOCModal(loc)),
  showSendToExchangeModal: () => dispatch(showSendToExchangeModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  handleShowLOCModal = () => {
    this.props.showLOCModal({
      loc: new LOCModel()
    })
  }

  handleSendToExchange = () => {
    this.props.showSendToExchangeModal()
  }

  render () {
    return (
      <div style={globalStyles.title2Wrapper}>
        <h3 style={globalStyles.title2}>LOCs</h3>
        <RaisedButton
          label={<Translate value='locs.new' />}
          primary
          style={styles.btn}
          onTouchTap={this.handleShowLOCModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
        <RaisedButton
          label={<Translate value='locs.sendToExchange' />}
          primary
          style={styles.btn}
          onTouchTap={this.handleSendToExchange}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
