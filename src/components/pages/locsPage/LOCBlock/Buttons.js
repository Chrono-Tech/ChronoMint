import React, {Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import {handleShowLOCModal, handleShowIssueLHModal, handleShowRedeemLHModal, handleViewContract} from '../../../../redux/locs/locModalActions'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: loc => dispatch(handleShowLOCModal(loc)),
  showIssueLHModal: loc => dispatch(handleShowIssueLHModal(loc)),
  showRedeemLHModal: loc => dispatch(handleShowRedeemLHModal(loc)),
  handleViewContract: loc => dispatch(handleViewContract(loc))
})

@connect(null, mapDispatchToProps)
class Buttons extends Component {
  render () {
    const {loc} = this.props
    const showLHButtons = loc.expDate() > new Date().getTime() && loc.status() === 1

    return (
      <div>
        <FlatButton label='VIEW CONTRACT' style={{color: 'grey'}}
          onTouchTap={() => {
            this.props.handleViewContract(loc)
          }}
        />
        {showLHButtons ? <FlatButton label='ISSUE LH' style={{color: 'grey'}}
          onTouchTap={() => {
            this.props.showIssueLHModal(loc)
          }}
        /> : null}
        {showLHButtons ? <FlatButton label='REDEEM LH' style={{color: 'grey'}}
          onTouchTap={() => {
            this.props.showRedeemLHModal(loc)
          }}
        /> : null}
        <FlatButton label='EDIT LOC INFO' style={{color: 'grey'}}
          onTouchTap={() => {
            this.props.showLOCModal(loc)
          }}
        />
      </div>
    )
  }
}

export default Buttons
