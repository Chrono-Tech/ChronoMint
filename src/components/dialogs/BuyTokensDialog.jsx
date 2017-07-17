import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { I18n } from 'react-redux-i18n'
import { CSSTransitionGroup } from 'react-transition-group'


import { RaisedButton, TextField } from 'material-ui'

import ModalDialog from './ModalDialog'
import RateHistoryChart from '../exchange/RateHistoryChart'

import { modalsOpen, modalsClose } from 'redux/modals/actions'

import './BuyTokensDialog.scss'

export class BuyTokensDialog extends React.Component {

  static propTypes = {
    order: PropTypes.object,
    handleClose: PropTypes.func
  }

  render () {

    let icons = {
      time: require('assets/img/icn-time.svg'),
      ethereum: require('assets/img/icn-ethereum.svg'),
    }

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()}>
          <div styleName='root'>
            <div styleName='header'>
              <div styleName='row'>
                <div styleName='col1'>
                  <h3>Buy TIME Tokens</h3>
                  <div styleName='balance'>
                    <div styleName='label'>Balance:</div>
                    <div styleName='value'>
                      <span styleName='value1'>1 512 000</span>
                      <span styleName='value2'>.00124 ETH</span>
                    </div>
                  </div>
                </div>
                <div styleName='col2'>
                  <div className='ByTokensDialog__icons'>
                    <div className='row'>
                      <div className='col-xs-1'>
                        <div className='icon'>
                          <div className='content' style={{
                            background: `#05326a url(${icons.time}) no-repeat center center`
                          }}>
                            <div className='title'>Time</div>
                          </div>
                        </div>
                      </div>
                      <div className='col-xs-1'>
                        <div className='icon'>
                          <div className='content' style={{
                            background: `#5c6bc0 url(${icons.ethereum}) no-repeat center center`
                          }}>
                            <div className='title'>Eth</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='content'>
              <div styleName='row'>
                <div styleName='col1'>
                  <div>
                    <div styleName='property'>
                      <div styleName='label'>Account:</div>
                      <div>
                        <span styleName='value'>
                          <span className='fa fa-user'></span>&nbsp;
                          <span styleName='value1'>John Smith</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div styleName='property'>
                      <div styleName='label'>Trade limits:</div>
                      <div>
                        <span styleName='value'>
                          <span styleName='value1'>1 000</span>
                          <span styleName='value2'>.00</span>
                        </span>
                        &mdash;
                        <span styleName='value'>
                          <span styleName='value1'>1 512 000</span>
                          <span styleName='value2'>.00 ETH</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div styleName='col2'>
                  <div className='ByTokensDialog__form'>
                    <div className='row'>
                      <div className='col-xs-1'>
                        <TextField floatingLabelText='TIME:' value='1000000' style={{ width: 150 }} />
                      </div>
                      <div className='col-xs-1'>
                        <TextField floatingLabelText='ETH:' value='1000000' style={{ width: 150 }} />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-xs-2'>
                        <div styleName='actions'>
                          <RaisedButton label='Send Request' primary />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='footer'>
              <div styleName='row'>
                <div styleName='col1'>
                  <h3>Rates</h3>
                  {this.renderRates()}
                </div>
                <div styleName='col2'>
                  <div styleName='chart'>
                    <div styleName='inner'>
                      <RateHistoryChart width={500} height={240} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  renderRates () {

    let data = [
      { asset: 'TIME', btc: 11.01, usd: 10.01, eur: 10.01, color: '#FFFFFF' },
      { asset: 'LHT', btc: 11.01, usd: 10.01, eur: 10.01, color: '#0039CB' },
      { asset: 'LHUS', btc: 11.01, usd: 10.01, eur: 10.01, color: '#50A0F9' }
    ]

    return (
      <div styleName='ratesTable'>
        <div styleName='tableHead'>
          <div styleName='row'>
            <div styleName='colAsset'>Asset</div>
            <div styleName='colValue'>BTC</div>
            <div styleName='colValue'>USD</div>
            <div styleName='colValue'>EUR</div>
            <div styleName='colColor'></div>
          </div>
        </div>
        <div styleName='tableBody'>
          { data.map((item) => this.renderRatesRow(item)) }
        </div>
      </div>
    )
  }

  renderRatesRow (item) {

    let [ btc1, btc2 ] = ('' + item.btc.toFixed(2)).split('.')
    let [ usd1, usd2 ] = ('' + item.usd.toFixed(2)).split('.')
    let [ eur1, eur2 ] = ('' + item.eur.toFixed(2)).split('.')

    return (
      <div styleName='row'>
        <div styleName='colAsset'>
          <i className='fa fa-money'></i>&nbsp;
          <span>{item.asset}</span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{btc1}</span>
            <span styleName='value2'>{btc2}</span>
          </span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{usd1}</span>
            <span styleName='value2'>{usd2}</span>
          </span>
        </div>
        <div styleName='colValue'>
          <span styleName='value'>
            <span styleName='value1'>{eur1}</span>
            <span styleName='value2'>{eur2}</span>
          </span>
        </div>
        <div styleName='colColor'>
          <span styleName='color' style={{ backgroundColor: item.color }}></span>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleOpen: (payload) => { dispatch(modalsOpen(payload)) },
    handleClose: () => dispatch(modalsClose())
  }
}

export default connect(null, mapDispatchToProps)(BuyTokensDialog)
