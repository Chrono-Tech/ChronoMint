import React, { Component } from 'react'
import {connect} from 'react-redux'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import InfoBox from './InfoBox'
import {getLOCs} from '../../../redux/locs/actions'
import {CircularProgress} from 'material-ui'

const mapStateToProps = (state) => ({
  locs: state.get('locs'),
  isFetching: state.get('locsCommunication').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getLOCs: () => dispatch(getLOCs())
})

@connect(mapStateToProps, mapDispatchToProps)
class TotalLOCs extends Component {
  account = window.localStorage.chronoBankAccount;

  componentWillMount () {
    this.props.getLOCs(this.account)
  }

  render () {
    return (
      <div>
        <InfoBox Icon={ThumbUp}
          color='#17579c'
          title='LOCs'
          value={this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />
            : <span>{this.props.locs.size}</span>
          }
        />
      </div>
    )
  }
}

export default TotalLOCs
