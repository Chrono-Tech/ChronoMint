import { CSSTransitionGroup } from 'react-transition-group'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { RaisedButton, FloatingActionButton, FontIcon, Checkbox, CircularProgress } from 'material-ui'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'

import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type TokenModel from 'models/TokenModel'

import { listTokens } from 'redux/settings/erc20/tokens/actions'
import { modalsOpen, modalsClose } from 'redux/modals/actions'
import { updateUserProfile } from 'redux/session/actions'
import { watchInitWallet } from 'redux/wallet/actions'

import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import Points from 'components/common/Points/Points'

import AddTokenDialog from './AddTokenDialog'
import ModalDialog from './ModalDialog'

import './AddCurrencyDialog.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  BTC: require('assets/img/icn-bitcoin.svg'),
  BCC: require('assets/img/icn-bitcoin-cash.svg'),
  TIME: require('assets/img/icn-time.svg'),
}

function prefix (token) {
  return `components.dialogs.AddCurrencyDialog.${token}`
}

export class AddCurrencyDialog extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    loadTokens: PropTypes.func,
    handleAddToken: PropTypes.func,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      items: this.props.tokens.valueSeq().toArray(),
    }
  }

  componentWillMount () {
    if (!this.props.isTokensLoaded) {
      this.props.loadTokens()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      items: nextProps.tokens.valueSeq().toArray(),
    })
  }

  handleCurrencyChecked (item, value) {
    if (item.disabled) {
      return
    }

    const items = [...this.state.items]
    const index = items.indexOf(item)
    if (index >= 0) {
      items.splice(index, 1, {
        ...item,
        selected: value,
      })
      this.setState({
        items,
      })
    }
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.props.handleClose()} styleName='root'>
          <div styleName='content'>
            <div styleName='header'>
              <h3><Translate value={prefix('tokens')} /></h3>
              <div styleName='subtitle'><Translate value={prefix('addToken')} /></div>
            </div>
            <div styleName='actions'>
              <div styleName='items'>
                <div styleName='item'>
                  <FloatingActionButton onTouchTap={() => { this.props.handleAddToken() }}>
                    <FontIcon className='material-icons'>add</FontIcon>
                  </FloatingActionButton>
                </div>
              </div>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <h5><Translate value={prefix('allTokens')} /></h5>
                {this.props.isTokensLoaded
                  ? (
                    <div styleName='table'>
                      { this.state.items.map(item => this.renderRow(item)) }
                    </div>
                  )
                  : (<CircularProgress style={{ marginTop: '25px' }} size={24} thickness={1.5} />)
                }
              </div>
              <div styleName='column'>
                <h5><Translate value={prefix('howToAddYourToken')} /></h5>
                <div styleName='description'>
                  <p>
                    <Translate value={prefix('youCanConnectToYourPersonalWallet')} />
                  </p>
                </div>
                <Points>
                  <span>
                    <Translate value={prefix('clickOnThePlusButtonAbove')} />
                  </span>
                  <span>
                    <Translate value={prefix('fillTheForm')} />
                  </span>
                  <span>
                    <Translate value={prefix('waitUntilYourToken')} />
                  </span>
                </Points>
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label={<Translate value={prefix('save')} />}
                primary
                onTouchTap={() => this.props.handleSave(
                  this.props.profile,
                  this.state.items.filter(item => item.selected && !item.disabled).map(item => item.token.address())
                )}
              />
              <RaisedButton
                styleName='action'
                label={<Translate value={prefix('close')} />}
                onTouchTap={() => this.props.handleClose()}
              />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  renderRow (item) {
    const token: TokenModel | AbstractFetchingModel = item.token
    const symbol = token.symbol().toUpperCase()
    const balance = token.balance().toString(10)
    const [balance1, balance2] = balance ? balance.split('.') : [null, null]

    return (
      <div
        key={item.token.id()}
        styleName={classnames('row', { rowSelected: item.selected })}
        onTouchTap={() => this.handleCurrencyChecked(item, !item.selected)}
      >
        <div styleName='cell'>
          <div styleName='icon'>
            <IPFSImage styleName='iconContent' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
            <div styleName='label'>{symbol}</div>
          </div>
        </div>
        <div styleName='cell cellAuto'>
          <div styleName='symbol'>{symbol}</div>
          {!balance ? null : (
            <div styleName='value'>
              <span styleName='value1'>{balance1}</span>
              {!balance2 ? null : (
                <span styleName='value2'>.{balance2}</span>
              )}&nbsp;
              <span styleName='value3'>{symbol}</span>
            </div>
          )}
        </div>
        <div styleName='cell'>
          { item.disabled || token.isFetching() ? null : (
            <Checkbox checked={item.selected} />
          )}
          {token.isFetching() ? <CircularProgress size={20} thickness={1.5} style={{ marginRight: '17px' }} /> : ''}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('wallet')
  const settings = state.get('settingsERC20Tokens')

  // Have no balances
  const sharedTokens = settings.list.map(token => ({
    selected: false,
    token,
  }))

  // Have balances
  const walletTokens = wallet.tokens.map(token => ({
    selected: true,
    disabled: ['ETH', 'TIME', 'BTC', 'BCC'].indexOf(token.symbol().toUpperCase()) >= 0,
    token,
  }))

  return {
    account: session.account,
    profile: session.profile,
    tokens: sharedTokens.merge(walletTokens).sortBy(item => item.token.symbol()),
    walletTokens: wallet.tokens,
    isTokensLoaded: settings.isFetched && !wallet.tokensFetching,
  }
}

function mapDispatchToProps (dispatch) {
  return {

    loadTokens: () => dispatch(listTokens()),

    handleAddToken: () => dispatch(modalsOpen({
      component: AddTokenDialog,
    })),
    handleClose: () => dispatch(modalsClose()),
    handleSave: async (profile, tokens) => {
      dispatch(modalsClose())

      await dispatch(updateUserProfile(profile.set('tokens', new Immutable.Set(tokens))))

      dispatch(watchInitWallet())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyDialog)

