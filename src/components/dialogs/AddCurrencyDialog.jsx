import { CSSTransitionGroup } from 'react-transition-group'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { RaisedButton, FloatingActionButton, FontIcon, Checkbox } from 'material-ui'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_SETTINGS_ERC20_TOKENS, listTokens } from 'redux/settings/erc20/tokens/actions'
import { modalsOpen, modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION, updateUserProfile } from 'redux/session/actions'
import { DUCK_MAIN_WALLET, watchInitWallet } from 'redux/mainWallet/actions'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import Points from 'components/common/Points/Points'
import TokenValue from 'components/common/TokenValue/TokenValue'
import Preloader from 'components/common/Preloader/Preloader'
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

function mapStateToProps (state) {
  const {account, profile} = state.get(DUCK_SESSION)
  const wallet = state.get(DUCK_MAIN_WALLET)
  const settings = state.get(DUCK_SETTINGS_ERC20_TOKENS)

  // Have no balances
  const sharedTokens = settings.list

  // Have balances
  const walletTokens = wallet.tokens()

  return {
    account,
    profile,
    tokens: sharedTokens.merge(walletTokens).sortBy(token => token.symbol()),
    walletTokens: wallet.tokens(),
    isFetched: settings.isFetched && wallet.isFetched(),
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

export class AddCurrencyDialog extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isFetched: PropTypes.bool,
    loadTokens: PropTypes.func,
    handleAddToken: PropTypes.func,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
  }

  constructor () {
    super(...arguments)
    this.state = {
      selectedTokens: [],
      items: this.props.tokens.valueSeq().toArray(),
    }
  }

  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.loadTokens()
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   this.setState({
  //     items: nextProps.tokens.valueSeq().toArray(),
  //   })
  // }

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

  renderRow (token) {
    const symbol = token.symbol()
    const isSelected = this.state.selectedTokens.includes(token.symbol())

    return (
      <div
        key={token.id()}
        styleName={classnames('row', {rowSelected: isSelected})}
        onTouchTap={() => this.handleCurrencyChecked(token, isSelected)}
      >
        <div styleName='cell'>
          <div styleName='icon'>
            <IPFSImage styleName='iconContent' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
            <div styleName='label'>{symbol}</div>
          </div>
        </div>
        <div styleName='cell cellAuto'>
          <div styleName='symbol'>{symbol}</div>
          <div styleName='value'>
            <TokenValue
              value={token.balance()}
              symbol={token.symbol()}
              isLoading={token.isFetched()}
            />
          </div>
        </div>
        <div styleName='cell'>
          {token.isFetched()
            ? token.isOptional() && <Checkbox checked={isSelected} />
            : <Preloader />}
        </div>
      </div>
    )
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
                {this.props.isFetched
                  ? (
                    <div styleName='table'>
                      {this.props.tokens.map(item => this.renderRow(item))}
                    </div>
                  )
                  : <Preloader />
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
                  this.state.items.filter(item => item.selected && !item.disabled).map(item => item.token.address()),
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyDialog)

