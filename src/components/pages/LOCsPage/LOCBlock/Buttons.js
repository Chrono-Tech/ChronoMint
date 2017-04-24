import React, {Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import {showLOCModal, showIssueLHModal, showRedeemLHModal, showUploadedFileModal} from '../../../../redux/ui/modal'
import {storeLOCAction} from '../../../../redux/locs/locForm/actions'
import IPFSDAO from '../../../../dao/IPFSDAO'
import LOCModel from '../../../../models/LOCModel'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: data => dispatch(showLOCModal(data)),
  showIssueLHModal: () => dispatch(showIssueLHModal()),
  showRedeemLHModal: () => dispatch(showRedeemLHModal()),
  prepareLocForm: loc => dispatch(storeLOCAction(loc)),
  showUploadedFileModal: loc => dispatch(showUploadedFileModal(loc))
})

@connect(null, mapDispatchToProps)
class Buttons extends Component {
  handleViewContract = (loc: LOCModel) => {
    IPFSDAO.getNode().files.cat(loc.publishedHash(), (e, r) => {
      let data = ''
      r.on('data', (d) => {
        data += d
      })
      r.on('end', () => {
        this.props.showUploadedFileModal({data})
      })
    })
  }

  handleShowLOCModal = (loc) => {
    this.props.prepareLocForm(loc)
    this.props.showLOCModal({locExists: !!loc})
  }

  handleShowIssueLHModal = (loc) => {
    this.props.prepareLocForm(loc)
    this.props.showIssueLHModal()
  }

  handleShowRedeemLHModal = (loc) => {
    this.props.prepareLocForm(loc)
    this.props.showRedeemLHModal()
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
