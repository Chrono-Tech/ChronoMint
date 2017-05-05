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
  exchange: state.get('exchangeData'),
  isFetching: state.get('exchangeCommunication').isFetching
})

@connect(mapStateToProps, null)
class RatesWidget extends Component {
  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}><Translate value='exchange.exchangeRates' /></h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        {this.props.isFetching ? (
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
              {this.props.exchange.valueSeq().map(asset => (
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
