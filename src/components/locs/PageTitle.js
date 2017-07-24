// TODO MINT-266 New LOC
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../styles'
import { showSendToExchangeModal } from '../../redux/ui/modal'
import { Translate } from 'react-redux-i18n'
import LOCModel from '../../models/LOCModel'
import { modalsOpen } from 'redux/modals/actions'
import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'

const styles = {
  btn: {
    marginRight: 10,
    marginBottom: 10
  }
}

const mapDispatchToProps = (dispatch) => ({
  showCreateLOCModal: () => dispatch(modalsOpen({
    component: LOCDialog,
    props: {loc: new LOCModel()}
  })),
  showSendToExchangeModal: () => dispatch(showSendToExchangeModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  handleShowLOCModal = () => {
    this.props.showCreateLOCModal()
  }

  handleSendToExchange = () => {
    this.props.showSendToExchangeModal()
  }

  render () {
    // TODO @dkchv: send to exchange disabled until exchange rework
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
          disabled={true}
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
