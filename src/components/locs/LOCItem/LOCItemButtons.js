/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Button from 'components/common/ui/Button/Button'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import LOCModel from '@chronobank/core/models/LOCModel'
import { modalsOpen } from 'redux/modals/actions'
import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'
import LOCIssueDialog from 'components/dialogs/LOC/LOCIssueDialog/LOCIssueDialog'
import LOCRedeemDialog from 'components/dialogs/LOC/LOCRedeemDialog/LOCRedeemDialog'
import LOCStatusDialog from 'components/dialogs/LOC/LOCStatusDialog/LOCStatusDialog'
import IPFS from '@chronobank/core-dependencies/utils/IPFS'
import './LOCItem.scss'

const mapDispatchToProps = (dispatch) => ({
  showLOCDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCDialog,
    props: { loc },
  })),
  showLOCStatusDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCStatusDialog,
    props: { loc },
  })),
  showLOCIssueDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCIssueDialog,
    props: { loc },
  })),
  showLOCRedeemDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCRedeemDialog,
    props: { loc },
  })),
  showUploadedFileModal: (loc: LOCModel) => {
    // eslint-disable-next-line
    console.warn('showUploadedFileModal is not implemented. Args:', loc)
    // TODO @ipavlenko: Dead code, showUploadedFileModal doesn't exist
    // dispatch(showUploadedFileModal(loc))
  },
})

@connect(null, mapDispatchToProps)
class Buttons extends PureComponent {
  static propTypes = {
    loc: PropTypes.instanceOf(LOCModel),
    showUploadedFileModal: PropTypes.func,
    showLOCDialog: PropTypes.func,
    showLOCIssueDialog: PropTypes.func,
    showLOCRedeemDialog: PropTypes.func,
    showLOCStatusDialog: PropTypes.func,
  }

  handleViewContract = () => {
    const { loc } = this.props
    IPFS.getAPI().files.cat(loc.publishedHash(), (e, r) => {
      let data = ''
      r.on('data', (d) => {
        data += d
      })
      r.on('end', () => {
        this.props.showUploadedFileModal({ data })
      })
    })
  }

  handleShowLOCIssueDialog = () => this.props.showLOCIssueDialog(this.props.loc)

  handleShowLOCRedeemDialog = () => this.props.showLOCRedeemDialog(this.props.loc)

  handleShowLOCStatusDialog = () => this.props.showLOCStatusDialog(this.props.loc)

  handleShowLOCDialog = () => this.props.showLOCDialog(this.props.loc)

  render () {
    const { loc } = this.props
    const isActive = loc.isActive()
    const isNotExpired = loc.isNotExpired()
    const isPending = loc.isPending()
    const currency = loc.currency()

    return (
      // TODO @dkchv: view contract disable until MINT-277 (fileSelect & ipfs)
      <div styleName='buttonsWrap'>
        {isNotExpired && (
          <Button
            flat
            label={<Translate value='locs.issueS' asset={currency} />}
            disabled={!isActive || isPending}
            onClick={this.handleShowLOCIssueDialog}
          />
        )}
        {isNotExpired && (
          <Button
            flat
            label={<Translate value='locs.redeemS' asset={currency} />}
            disabled={!isActive || isPending || loc.issued() === 0}
            onClick={this.handleShowLOCRedeemDialog}
          />
        )}
        {isNotExpired && (
          <Button
            flat
            label={<Translate value='terms.status' />}
            disabled={isPending}
            onClick={this.handleShowLOCStatusDialog}
          />
        )}
        <Button
          flat
          label={<Translate value='locs.editInfo' />}
          disabled={isPending || isActive}
          onClick={this.handleShowLOCDialog}
        />
      </div>
    )
  }
}

export default Buttons
