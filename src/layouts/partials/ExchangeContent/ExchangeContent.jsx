import { ExchangesTable, ExchangeWidget } from 'components'
import { Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { watchExchanges } from 'redux/exchange/actions'
import './ExchangeContent.scss'

const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(watchExchanges()),
})

@connect(null, mapDispatchToProps)
export default class ExchangeContent extends Component {
  static propTypes = {
    init: PropTypes.func,
  }

  componentWillMount () {
    this.props.init()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='ExchangeContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <div styleName='exchangeBox'>
                    <Paper>
                      <ExchangeWidget />
                      <ExchangesTable />
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
