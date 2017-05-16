import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Divider, Paper } from 'material-ui'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'
import { renderBalanceWidget } from '../../common/BalanceWidget/BalanceWidget'
import { updateCMLHTBalance } from '../../../redux/wallet/actions'
import LS from '../../../dao/LocalStorageDAO'

const mapStateToProps = (state) => ({
  lht: state.get('wallet').contractsManagerLHT
})

const mapDispatchToProps = (dispatch) => ({
  updateCMLHTBalance: () => dispatch(updateCMLHTBalance(LS.getAccount()))

})

@connect(mapStateToProps, mapDispatchToProps)
class ExchangeBalances extends Component {
  componentWillMount () {
    this.props.updateCMLHTBalance()
  }

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='exchange.limits'/></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}}/>

        <div className='row' style={{marginTop: 25}}>
          <div className='col-xs-12'>
            {renderBalanceWidget(this.props.lht)}
          </div>
        </div>

      </Paper>
    )
  }
}

export default ExchangeBalances
