/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import lhtDAO from '@chronobank/core/dao/LHTDAO'
import { modalsOpen } from 'redux/modals/actions'
import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'
import SendToExchangeDialog from 'components/dialogs/LOC/LOCSendToExchangeDialog/SendToExchangeDialog'
import LOCModel from '@chronobank/core/models/LOCModel'
import Amount from '@chronobank/core/models/Amount'
import globalStyles from '../../styles'
import './styles.scss'

const mapDispatchToProps = (dispatch) => ({
  showCreateLOCModal: (loc) => dispatch(modalsOpen({
    component: LOCDialog,
    props: {
      loc,
    },
  })),
  showSendToExchangeModal: async () => {
    dispatch(modalsOpen({
      component: SendToExchangeDialog,
      props: { allowed: new Amount(await lhtDAO.getAssetsManagerBalance(), 'LHT') },
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
    const newLOC = new LOCModel()
    this.props.showCreateLOCModal(newLOC)
  }

  handleSendToExchange = () => {
    this.props.showSendToExchangeModal()
  }

  render () {
    return (
      <div style={globalStyles.title2Wrapper}>
        <h3 style={globalStyles.title2}><Translate value={prefix('labourOfferingCompanies')} /></h3>
        <div styleName='buttonWrapper'>
          <Button
            label={<Translate value='locs.new' />}
            primary
            onClick={this.handleShowLOCModal}
          />
          <Button
            label={<Translate value='locs.sendToExchange' />}
            onClick={this.handleSendToExchange}
          />
        </div>
      </div>
    )
  }
}

export default PageTitle
