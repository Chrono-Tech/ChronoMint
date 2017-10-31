import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
// TODO @dkchv: not finished due to old design mockup
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import contractManagerDAO from 'dao/ContractsManagerDAO'
import lhtDAO from 'dao/LHTDAO'

import { modalsOpen } from 'redux/modals/actions'

import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'
import SendToExchangeDialog from 'components/dialogs/LOC/LOCSendToExchangeDialog/SendToExchangeDialog'

import globalStyles from '../../styles'
import LOCModel from '../../models/LOCModel'

const styles = {
  btn: {
    marginRight: 10,
    marginBottom: 10,
  },
}

const mapDispatchToProps = dispatch => ({
  showCreateLOCModal: loc => dispatch(modalsOpen({
    component: LOCDialog,
    props: { loc },
  })),
  showSendToExchangeModal: async () => {
    dispatch(modalsOpen({
      component: SendToExchangeDialog,
      props: { allowed: await lhtDAO.getAssetsManagerBalance() },
    }))
  },
})

function prefix (token) {
  return `components.locs.PageTitle.${token}`
}

@connect(null, mapDispatchToProps)
class PageTitle extends PureComponent {
  static propTypes = {
    showCreateLOCModal: PropTypes.func,
    showSendToExchangeModal: PropTypes.func,
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    // TODO replace with async arrow when class properties will work correctly
    this.handleShowLOCModal = this.handleShowLOCModal.bind(this)
  }

  async handleShowLOCModal () {
    const locManager = await contractManagerDAO.getLOCManagerDAO()
    const newLOC = new LOCModel({
      token: locManager.getDefaultToken(),
    })
    this.props.showCreateLOCModal(newLOC)
  }

  handleSendToExchange = () => {
    this.props.showSendToExchangeModal()
  }

  render () {
    return (
      <div style={globalStyles.title2Wrapper}>
        <h3 style={globalStyles.title2}><Translate value={prefix('labourOfferingCompanies')} /></h3>
        <RaisedButton
          label={<Translate value='locs.new' />}
          primary
          style={styles.btn}
          onTouchTap={this.handleShowLOCModal}
          buttonStyle={{ ...globalStyles.raisedButton }}
          labelStyle={globalStyles.raisedButtonLabel}
        />
        <RaisedButton
          label={<Translate value='locs.sendToExchange' />}
          primary
          style={styles.btn}
          onTouchTap={this.handleSendToExchange}
          buttonStyle={{ ...globalStyles.raisedButton }}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
