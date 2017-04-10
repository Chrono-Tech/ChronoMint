import React, { Component } from 'react'
import {connect} from 'react-redux'

import Face from 'material-ui/svg-icons/action/face'
import InfoBox from './InfoBox'
import {CircularProgress} from 'material-ui'
import { updateTotalMembers } from '../../../redux/dashboard/dashboard'

const mapStateToProps = (state) => ({
  balance: state.get('dashboard').totalMembers.balance,
  isFetching: state.get('dashboard').totalMembers.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateTotalMember: () => dispatch(updateTotalMembers())
})

@connect(mapStateToProps, mapDispatchToProps)
class TotalMembers extends Component {
  componentWillMount () {
    this.props.updateTotalMember()
  }

  render () {
    return (
      <InfoBox Icon={Face}
        color='#e2a864'
        title='New Members'
        value={this.props.isFetching
          ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
          : <span>{this.props.balance}</span>
        }
      />
    )
  }
}

export default TotalMembers
