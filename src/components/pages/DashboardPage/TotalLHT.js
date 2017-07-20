// TODO New Dashboard
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui'
import InfoBox from './InfoBox'
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart'
import { updateTotalLHT } from '../../../redux/dashboard/actions'

const mapStateToProps = (state) => ({
  balance: state.get('dashboard').totalLHT.balance,
  isFetching: state.get('dashboard').totalLHT.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  updateTotalLHT: () => dispatch(updateTotalLHT())
})

@connect(mapStateToProps, mapDispatchToProps)
class TotalLHT extends Component {
  componentWillMount () {
    this.props.updateTotalLHT()
  }

  render () {
    return (
      <div>
        <InfoBox Icon={ShoppingCart}
          color='#161240'
          title='Total LHT'
          value={this.props.isFetching
                   ? <CircularProgress size={24} thickness={1.5} style={{marginTop: '5px'}} />
                   : <span>{Math.floor(this.props.balance)}</span>
                 }
        />
      </div>
    )
  }
}

export default TotalLHT
