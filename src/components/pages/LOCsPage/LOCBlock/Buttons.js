import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import { showLOCModal, showLOCIssueModal, showLOCRedeemModal, showUploadedFileModal, showLOCStatusModal } from '../../../../redux/ui/modal'
import IPFS from '../../../../utils/IPFS'
import LOCModel from '../../../../models/LOCModel'
import { Translate } from 'react-redux-i18n'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: (loc: LOCModel) => dispatch(showLOCModal(loc)),
  showLOCIssueModal: (loc: LOCModel) => dispatch(showLOCIssueModal(loc)),
  showLOCRedeemModal: (loc: LOCModel) => dispatch(showLOCRedeemModal(loc)),
  showUploadedFileModal: (loc: LOCModel) => dispatch(showUploadedFileModal(loc)),
  showLOCStatusModal: (loc: LOCModel) => dispatch(showLOCStatusModal(loc))
})

@connect(null, mapDispatchToProps)
class Buttons extends Component {
  handleViewContract = () => {
    const {loc} = this.props
    IPFS.getAPI().files.cat(loc.publishedHash(), (e, r) => {
      let data = ''
      r.on('data', (d) => {
        data += d
      })
      r.on('end', () => {
        this.props.showUploadedFileModal({data})
      })
    })
  }

  handleEdit = () => {
    this.props.showLOCModal({loc: this.props.loc})
  }

  handleIssue = () => {
    this.props.showLOCIssueModal({loc: this.props.loc})
  }

  handleRedeem = () => {
    this.props.showLOCRedeemModal({loc: this.props.loc})
  }

  handleStatus = () => {
    this.props.showLOCStatusModal({loc: this.props.loc})
  }

  render () {
    const {loc} = this.props
    const isActive = loc.isActive()
    const isNotExpired = loc.isNotExpired()
    const isPending = loc.isPending()
    const currency = loc.currencyString()

    return (
      <div>
        <FlatButton
          label={<Translate value='loc.viewContract' />}
          disabled={isPending}
          onTouchTap={this.handleViewContract}
        />
        {isNotExpired && (
          <FlatButton
            label={<Translate value='locs.issueS' asset={currency} />}
            disabled={!isActive || isPending}
            onTouchTap={this.handleIssue}
          />
        )}
        {isNotExpired && (
          <FlatButton
            label={<Translate value='locs.redeemS' asset={currency} />}
            disabled={!isActive || isPending || loc.issued() === 0}
            onTouchTap={this.handleRedeem}
          />
        )}
        {isNotExpired && (
          <FlatButton
            label={<Translate value='terms.status' />}
            disabled={isPending}
            onTouchTap={this.handleStatus}
          />
        )}
        <FlatButton
          label={<Translate value='locs.editInfo' />}
          disabled={isPending}
          onTouchTap={this.handleEdit}
        />
      </div>
    )
  }
}

Buttons.propTypes = {
  loc: PropTypes.object,
  showUploadedFileModal: PropTypes.func,
  showLOCModal: PropTypes.func,
  showLOCIssueModal: PropTypes.func,
  showLOCRedeemModal: PropTypes.func,
  showLOCStatusModal: PropTypes.func
}

export default Buttons
