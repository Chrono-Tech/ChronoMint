import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../../styles'
import { showSendToExchangeModal, showLOCModal } from '../../../redux/ui/modal'
import { Translate } from 'react-redux-i18n'
import LOCModel2 from '../../../models/LOCModel2'

const styles = {
  btn: {
    marginRight: 10,
    marginBottom: 10
  }
}

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: (loc: LOCModel2) => dispatch(showLOCModal(loc)),
  showSendToExchangeModal: () => dispatch(showSendToExchangeModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  handleShowLOCModal = () => {
    this.props.showLOCModal({
      loc: new LOCModel2()
    })
  }

  handleSendToExchange = () => {
    this.props.showSendToExchangeModal()
  }

  render () {
    // TODO @dkchv: refactor to <PageActions>
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
