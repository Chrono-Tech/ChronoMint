import React, {Component} from 'react'
import {connect} from 'react-redux'
import Label from '../../common/Label'
import {getPendings} from '../../../redux/pendings/data'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  pendings: state.get('pendings'),
  pendingCommunication: state.get('pendingsCommunication')
})

const mapDispatchToProps = (dispatch) => ({
  getPendings: (account) => dispatch(getPendings(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class PendingOperationsCountLabel extends Component {
  componentWillMount () {
    if (!this.props.pendingCommunication.isReady && !this.props.pendingCommunication.isFetching) {
      this.props.getPendings(this.props.account)
    }
  }

  render () {
    return (
      <Label count={this.props.pendings.reduce((count, item) => {
        return count + (item.hasConfirmed() ? 0 : 1)
      }, 0)} />
    )
  }
}

export default PendingOperationsCountLabel
