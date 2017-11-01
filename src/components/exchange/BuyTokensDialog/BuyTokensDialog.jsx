import BigNumber from 'bignumber.js'
import { IPFSImage } from 'components'
import { CSSTransitionGroup } from 'react-transition-group'
import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton, TextField } from 'material-ui'
import React from 'react'
import { connect } from 'react-redux'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import { exchange } from 'redux/exchange/actions'
import { modalsClose } from 'redux/modals/actions'
import ModalDialog from 'components/dialogs/ModalDialog'
import TokenValue from 'components/common/TokenValue/TokenValue'
import validate from './validate'
import './BuyTokensDialog.scss'
import styles from './styles'
import { Translate } from 'react-redux-i18n'

function prefix (token) {
  return `components.exchange.BuyTokensDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    exchange: (order: ExchangeOrderModel, amount: BigNumber) => {
      dispatch(modalsClose())
      dispatch(exchange(order, amount))
    },
    handleClose: () => dispatch(modalsClose()),
  }
}

export const FORM_EXCHANGE_BUY_TOKENS = 'ExchangeBuyTokensForm'

const onSubmit = (values, dispatch) => {
  // eslint-disable-next-line
  console.log('--ExchangeWidget#onSubmit filter',)
}

@connect(null, mapDispatchToProps)
@reduxForm({form: FORM_EXCHANGE_BUY_TOKENS, validate, onSubmit})
export default class BuyTokensDialog extends React.Component {
  static propTypes = {
    order: PropTypes.instanceOf(ExchangeOrderModel),
    handleClose: PropTypes.func,
    exchange: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      main: new BigNumber(0),
      second: new BigNumber(0),
      isPossible: false,
    }
  }

  order (): ExchangeOrderModel {
    return this.props.order
  }

  render () {
    const icons = {
      lht: require('assets/img/icn-lht.svg'),
      ethereum: require('assets/img/icn-ethereum.svg'),
    }

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.props.handleClose()}>
          <div styleName='root'>
            <div styleName='header'>
              <div styleName='headerRow'>
                <div styleName='headerRightCol'>
                  <div styleName='title'>
                    <Translate value={prefix(this.order().isBuy() ? 'buy' : 'sell')} />{` ${this.order().symbol()} `}
                    <Translate value={prefix('tokens')} />
                  </div>
                  <div styleName='balanceHeader'>
                    <div styleName='balanceTitle'><Translate value={prefix('balance')} /></div>
                    <div styleName='balanceValue'>
                      <TokenValue
                        isInvert
                        value={this.order().accountBalance()}
                        symbol={this.order().accountBalanceSymbol()}
                      />
                    </div>
                  </div>
                </div>
                <div styleName='headerLeftCol'>
                  <div className='ByTokensDialog__icons'>
                    <div className='row'>
                      <div className='col-xs-1'>
                        <div styleName='icon' style={{background: `#05326a`}}>
                          <IPFSImage
                            fallback={icons.lht}
                            styleName='iconTitle'
                          />
                          <div styleName='tokenTitle'>LHT</div>
                        </div>
                      </div>
                      <div className='col-xs-1'>
                        <div styleName='icon' style={{background: `#5c6bc0`}}>
                          <IPFSImage
                            fallback={icons.ethereum}
                            styleName='iconTitle'
                          />
                          <div styleName='tokenTitle'>Eth</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='content'>
              <div styleName='row'>
                <div styleName='leftCol'>
                  <div styleName='property'>
                    <div styleName='label'><Translate value={prefix('traderAddress')} />:</div>
                    <div styleName='value'>
                      <span>0x9876f6477iocc4757q22dfg3333nmk1111v234x0</span>
                    </div>
                  </div>
                  <div styleName='property'>
                    <div styleName='label'><Translate value={prefix('tradeLimits')} />:</div>
                    <div>
                      <TokenValue
                        value={this.order().limit()}
                        symbol={this.order().symbol()}
                      />
                    </div>
                  </div>
                </div>
                <div styleName='rightCol'>
                  <div className='ByTokensDialog__form'>
                    <div className='row' styleName='amountsWrap'>
                      <div className='col-xs-2 col-sm-1' styleName='mobileFlex'>
                        <div styleName='input'>
                          <Field
                            component={TextField}
                            name='sell'
                            fullWidth
                            floatingLabelFixed
                            floatingLabelStyle={styles.TextField.floatingLabelStyle}
                            floatingLabelText={<span><Translate value={prefix('amountIn')} />&nbsp;LHT</span>}
                            value={this.state.main.toString(10)}
                            style={styles.TextField.style}
                          />
                        </div>
                        <div styleName='iconMobile' style={{background: `#05326a`}}>
                          <IPFSImage
                            fallback={icons.lht}
                            styleName='iconTitle'
                          />
                          <div styleName='tokenTitleMobile'>LHT</div>
                        </div>
                      </div>
                      <div className='col-xs-2 col-sm-1' styleName='mobileFlex'>
                        <div styleName='input'>
                          <Field
                            component={TextField}
                            name='buy'
                            fullWidth
                            floatingLabelFixed
                            floatingLabelStyle={styles.TextField.floatingLabelStyle}
                            floatingLabelText={<span><Translate value={prefix('amountIn')} />&nbsp;ETH</span>}
                            value={this.state.second.toString(10)}
                            style={styles.TextField.style}
                          />
                        </div>
                        <div styleName='iconMobile' style={{background: `#05326a`}}>
                          <IPFSImage
                            fallback={icons.ethereum}
                            styleName='iconTitle'
                          />
                          <div styleName='tokenTitleMobile'>eth</div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-xs-2'>
                        <div styleName='actions'>
                          <RaisedButton label={<Translate value={prefix('sendRequest')} />} primary />
                        </div>
                      </div>
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
}

