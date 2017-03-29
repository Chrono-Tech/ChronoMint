import React, {Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import {handleShowLOCModal, handleShowIssueLHModal, handleViewContract} from '../../../../redux/locs/locModalActions'

const mapDispatchToProps = (dispatch) => ({
  showLOCModal: loc => dispatch(handleShowLOCModal(loc)),
  showIssueLHModal: loc => dispatch(handleShowIssueLHModal(loc)),
  handleViewContract: loc => dispatch(handleViewContract(loc))
})

@connect(null, mapDispatchToProps)
class Buttons extends Component {
  render () {
    const {loc, showLOCModal, showIssueLHModal, handleViewContract} = this.props
    return (
      <div>
        <FlatButton label='VIEW CONTRACT' style={{color: 'grey'}}
          onTouchTap={() => {
            handleViewContract(loc)
          }}
        />
        <FlatButton label='ISSUE LH' style={{color: 'grey'}}
          onTouchTap={() => {
            showIssueLHModal(loc)
          }}
        />
        <FlatButton label='REDEEM LH' style={{color: 'grey'}}
          onTouchTap={() => {
            showLOCModal(loc)
          }}
        />
        <FlatButton label='EDIT LOC INFO' style={{color: 'grey'}}
          onTouchTap={() => {
            showLOCModal(loc)
          }}
        />
      </div>
    )
  }
}

export default Buttons
