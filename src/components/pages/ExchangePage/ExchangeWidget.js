import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Paper,
  Divider,
  CircularProgress
} from 'material-ui'
import ExchangeForm from './ExchangeForm'
import ExchangeDAO from '../../../dao/ExchangeDAO'
import globalStyles from '../../../styles'

const mapStateToProps = (state) => ({
  exchange: state.get('exchangeData'),
  isFetching: state.get('exchangeCommunication').isFetching
})

@connect(mapStateToProps, null)
class ExchangeWidget extends Component {
  componentDidMount () {
    ExchangeDAO.watchError()
  }

  exchangeLHTOperation = (values) => {
    /** @type AssetModel */
    const asset = this.props.exchange.get(values.get('currency'))
    if (values.get('buy')) {
      ExchangeDAO.buy(values.get('amount'), asset.sellPrice())
    } else {
      ExchangeDAO.sell(values.get('amount'), asset.buyPrice())
    }
  };

  handleSubmit = (values) => {
    switch (values.get('currency')) {
      case 'LHT':
        this.exchangeLHTOperation(values)
        return
      default:
        return false
    }
  };

  render () {
    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Exchange tokens</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />

        {this.props.isFetching
          ? (
            <div style={{textAlign: 'center', height: 270, position: 'relative'}}>
              <CircularProgress
                style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}
                thickness={2.5} />
            </div>
          ) : <ExchangeForm onSubmit={this.handleSubmit} />
        }
      </Paper>
    )
  }
}

export default ExchangeWidget
