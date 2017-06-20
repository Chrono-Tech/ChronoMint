import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Paper, TextField, Divider } from 'material-ui'
import LS from '../../../utils/LocalStorage'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'
import { renderBalanceWidget } from '../../common/BalanceWidget/BalanceWidget'

const mapStateToProps = (state) => ({
  tokens: state.get('wallet').tokens
})

@connect(mapStateToProps, null)
class WalletBalances extends Component {
  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='terms.balances' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        <TextField
          floatingLabelText={<Translate value='terms.account' />}
          fullWidth
          value={LS.getAccount() || ''}
          disabled />
        <div className='row' style={{marginTop: 25}}>
          {this.props.tokens.entrySeq().map(([symbol, token]) =>
            <div key={symbol} className='col-xs-4'>
              {renderBalanceWidget(token)}
            </div>
          )}
        </div>
      </Paper>
    )
  }
}

WalletBalances.propTypes = {
  tokens: PropTypes.object
}

export default WalletBalances
