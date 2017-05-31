import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import { showLOCModal, showIssueLHModal, showRedeemLHModal, showUploadedFileModal } from '../../../../redux/ui/modal'
import IPFS from '../../../../utils/IPFS'
import LOCModel from '../../../../models/LOCModel'
import LOCModel2 from '../../../../models/LOCModel2'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: (loc: LOCModel2) => dispatch(showLOCModal(loc)),
  showIssueLHModal: (loc: LOCModel2) => dispatch(showIssueLHModal(loc)),
  showRedeemLHModal: (loc: LOCModel2) => dispatch(showRedeemLHModal(loc)),
  showUploadedFileModal: (loc: LOCModel2) => dispatch(showUploadedFileModal(loc))
})

@connect(null, mapDispatchToProps)
class Buttons extends Component {
  handleViewContract = (loc: LOCModel) => {
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

  handleShowLOCModal = (loc: LOCModel2) => {
    this.props.showLOCModal({
      isNew: false,
      loc
    })
  }

  handleShowIssueLHModal = (loc: LOCModel2) => {
    console.log('--Buttons#handleShowIssueLHModal', 1)
    this.props.showIssueLHModal(loc)
  }

  handleShowRedeemLHModal = (loc: LOCModel2) => {
    console.log('--Buttons#handleShowRedeemLHModal', 2)
    this.props.showRedeemLHModal(loc)
  }

  render () {
    const {loc} = this.props
    const showLHButtons = loc.expDate() > new Date().getTime() && loc.status() === 1

    return (
      <div>
        <FlatButton label='VIEW CONTRACT' style={{color: 'grey'}}
          onTouchTap={() => {
            this.handleViewContract(loc)
          }}
        />
        {showLHButtons ? <FlatButton label='ISSUE LH' style={{color: 'grey'}}
          onTouchTap={() => {
            this.handleShowIssueLHModal(loc)
          }}
        /> : null}
        {showLHButtons ? <FlatButton label='REDEEM LH' style={{color: 'grey'}}
          onTouchTap={() => {
            this.handleShowRedeemLHModal(loc)
          }}
        /> : null}
        <FlatButton label='EDIT LOC INFO' style={{color: 'grey'}}
          onTouchTap={() => {
            this.handleShowLOCModal(loc)
          }}
        />
      </div>
    )
  }
}

export default Buttons
