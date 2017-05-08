import React, { Component } from 'react'
import {
  Paper,
  Divider,
  Table,
  TableHeader,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
  TableBody,
  CircularProgress
} from 'material-ui'
import { connect } from 'react-redux'
import globalStyles from '../../../styles'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  rates: state.get('exchangeRates').rates,
  isFetching: state.get('exchangeRates').isFetching
})

@connect(mapStateToProps, null)
class RatesWidget extends Component {
  render () {
    const {isFetching, rates} = this.props

    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='exchange.exchangeRates' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        {isFetching ? (
          <div style={{textAlign: 'center', position: 'relative'}}>
            <CircularProgress
              style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}
              thickness={2.5} />
          </div>
        ) : (
          <Table selectable={false}>
            <TableHeader displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>
                  <Translate value='terms.asset' />
                </TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'right'}}>
                  <Translate value='exchange.buyPrice' />
                </TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'right'}}>
                  <Translate value='exchange.buyPrice' />
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {rates.valueSeq().map(asset => (
                <TableRow key={asset.title}>
                  <TableRowColumn>{asset.title}</TableRowColumn>
                  <TableRowColumn
                    style={{textAlign: 'right'}}>{asset.buyPrice() * 100000000}</TableRowColumn>
                  <TableRowColumn
                    style={{textAlign: 'right'}}>{asset.sellPrice() * 100000000}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
        }
      </Paper>
    )
  }
}

export default RatesWidget
