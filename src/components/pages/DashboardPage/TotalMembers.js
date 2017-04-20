import React, { Component } from 'react'
import {connect} from 'react-redux'
import Face from 'material-ui/svg-icons/action/face'
import InfoBox from './InfoBox'
import {CircularProgress} from 'material-ui'
import { updateTotalMembers } from '../../../redux/dashboard/actions'

const mapStateToProps = (state) => ({
  number: state.get('dashboard').totalMembers.number,
  isFetching: state.get('dashboard').totalMembers.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateTotalMembers: () => dispatch(updateTotalMembers())
})

@connect(mapStateToProps, mapDispatchToProps)
class TotalMembers extends Component {
  componentWillMount () {
    this.props.updateTotalMembers()
  }

  render () {
    return (
      <InfoBox Icon={Face}
        color='#e2a864'
        title='New Members'
        value={this.props.isFetching
          ? <CircularProgress size={24} thickness={1.5} style={{marginTop: '5px'}} />
          : <span>{this.props.number}</span>
        }
      />
    )
  }
}

export default TotalMembers
