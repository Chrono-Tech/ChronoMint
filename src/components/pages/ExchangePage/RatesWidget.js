import React, {Component} from 'react'
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
import {connect} from 'react-redux'
import globalStyles from '../../../styles'

const mapStateToProps = (state) => ({
  exchange: state.get('exchangeData'),
  isFetching: state.get('exchangeCommunication').isFetching
})

@connect(mapStateToProps, null)
class RatesWidget extends Component {
  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Exchange rates</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        {this.props.isFetching ? (
          <div style={{textAlign: 'center', height: 270, position: 'relative'}}>
            <CircularProgress
              style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}
              thickness={2.5} />
          </div>
        ) : (
          <Table height='211px' selectable={false}>
            <TableHeader displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Asset</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'right'}}>Buy price</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'right'}}>Sell price</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.exchange.valueSeq().map(asset => (
                <TableRow key={asset.title}>
                  <TableRowColumn>{asset.title}</TableRowColumn>
                  <TableRowColumn
                    style={{textAlign: 'right'}}>{asset.buyPrice()}</TableRowColumn>
                  <TableRowColumn
                    style={{textAlign: 'right'}}>{asset.sellPrice()}</TableRowColumn>
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
