// TODO new exchange
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Divider, Paper } from 'material-ui'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'
import { renderBalanceWidget } from '../../common/BalanceWidget/BalanceWidget'

const mapStateToProps = (state) => ({
  lht: state.get('exchange').lht,
  eth: state.get('exchange').eth
})

@connect(mapStateToProps, null)
class ExchangeBalances extends Component {
  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='exchange.limits' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        <div className='row' style={{marginTop: 25}}>
          <div className='col-xs-6'>
            {renderBalanceWidget(this.props.eth)}
          </div>
          <div className='col-xs-6'>
            {renderBalanceWidget(this.props.lht)}
          </div>
        </div>

      </Paper>
    )
  }
}

export default ExchangeBalances
