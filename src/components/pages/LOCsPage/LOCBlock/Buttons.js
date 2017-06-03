import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import { showLOCModal, showIssueLHModal, showRedeemLHModal, showUploadedFileModal } from '../../../../redux/ui/modal'
import IPFS from '../../../../utils/IPFS'
import LOCModel from '../../../../models/LOCModel'
import { Translate } from 'react-redux-i18n'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: (loc: LOCModel) => dispatch(showLOCModal(loc)),
  showIssueLHModal: (loc: LOCModel) => dispatch(showIssueLHModal(loc)),
  showRedeemLHModal: (loc: LOCModel) => dispatch(showRedeemLHModal(loc)),
  showUploadedFileModal: (loc: LOCModel) => dispatch(showUploadedFileModal(loc))
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

  handleShowLOCModal = () => {
    this.props.showLOCModal({loc: this.props.loc})
  }

  handleShowIssueLHModal = () => {
    this.props.showIssueLHModal({loc: this.props.loc})
  }

  handleShowRedeemLHModal = () => {
    this.props.showRedeemLHModal({loc: this.props.loc})
  }

  render () {
    const isActive = this.props.loc.isActive()
    const isPending = this.props.loc.isPending()

    return (
      <div>
        <FlatButton
          label={<Translate value='loc.viewContract' />}
          disabled={isPending}
          onTouchTap={this.handleViewContract}
        />
        {isActive && (
          <FlatButton
            label={<Translate value='locs.issueLHT' />}
            disabled={isPending}
            onTouchTap={this.handleShowIssueLHModal}
          />
        )}
        {isActive && (
          <FlatButton
            label={<Translate value='locs.redeemLHT' />}
            disabled={isPending}
            onTouchTap={this.handleShowRedeemLHModal}
          />
        )}
        <FlatButton
          label={<Translate value='locs.editInfo' />}
          disabled={isPending}
          onTouchTap={this.handleShowLOCModal}
        />
      </div>
    )
  }
}

export default Buttons
