import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { CSSTransitionGroup } from 'react-transition-group'

import Immutable from 'immutable'

import { RaisedButton, FloatingActionButton, FontIcon, Checkbox, CircularProgress } from 'material-ui'

import ModalDialog from './ModalDialog'
import AddTokenDialog from './AddTokenDialog'
import Points from 'components/common/Points/Points'
import IPFSImage from  'components/common/IPFSImage/IPFSImage'

import { watchInitWallet } from 'redux/wallet/actions'
import { updateUserProfile } from 'redux/session/actions'
import { listTokens } from 'redux/settings/erc20/tokens/actions.js'
import { modalsOpen, modalsClose } from 'redux/modals/actions'

import './AddCurrencyDialog.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  TIME: require('assets/img/icn-time.svg')
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
    handleSave: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      items: this.props.tokens.valueSeq().toArray()
    }
  }

  componentWillMount () {
    if (!this.props.isTokensLoaded) {
      this.props.loadTokens()
    }
  }

  componentWillReceiveProps (nextProps) {

    this.setState({
      items: nextProps.tokens.valueSeq().toArray()
    })
  }

  handleCurrencyChecked (item, value) {

    if (item.disabled) {
      return
    }

    const items = [ ...this.state.items ]
    const index = items.indexOf(item)
    if (index >= 0) {
      items.splice(index, 1, {
        ...item,
        selected: value
      })
      this.setState({
        items
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
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()} styleName='root'>
          <div styleName='content'>
            <div styleName='header'>
              <h3>Tokens</h3>
              <div styleName='subtitle'>Add Token</div>
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
                <h5>All tokens</h5>
                {this.props.isTokensLoaded
                  ? (
                    <div styleName='table'>
                      { this.state.items.map((item) => this.renderRow(item)) }
                    </div>
                  )
                  : (<CircularProgress style={{marginTop: '25px'}} size={24} thickness={1.5} />)
                }
              </div>
              <div styleName='column'>
                <h5>How to add your token? It&#39;s easy!</h5>
                <div styleName='description'>
                  <p>
                    You can connect to your personal wallet one of the already added tokens or add any other ERC20 token.
                  </p>
                </div>
                <Points>
                  <span>
                    Click on the + plus button above.
                  </span>
                  <span>
                    Fill the form, check values and press SAVE.
                  </span>
                  <span>
                    Wait until your token will be added (mined), select it in the list on the left and press SAVE.
                  </span>
                </Points>
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label='Save'
                primary
                onTouchTap={() => this.props.handleSave(
                  this.props.profile,
                  this.state.items.filter((item) => item.selected && !item.disabled).map(item => item.token.address())
                )} />
              <RaisedButton styleName='action' label='Close' onTouchTap={() => this.props.handleClose()} />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  renderRow (item) {

    const token = item.token
    const symbol = token.symbol().toUpperCase()
    const balance = token.balance()
    const [ balance1, balance2 ] = balance ? ('' + balance).split('.') : [null, null]

    return (
      <div key={item.token.id()} styleName={classnames('row', { 'row-selected': item.selected })}
        onTouchTap={() => this.handleCurrencyChecked(item, !item.selected)}
      >
        <div styleName='cell'>
          <div styleName='icon'>
            <IPFSImage styleName='content' multihash={token.icon()} fallback={ICON_OVERRIDES[symbol]} />
            <div styleName='label'>{symbol}</div>
          </div>
        </div>
        <div styleName='cell cell-auto'>
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
          { item.disabled ? null : (
            <Checkbox checked={item.selected} />
          )}
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
    token
  }))

  // Have balances
  const walletTokens = wallet.tokens.map(token => ({
    selected: true,
    disabled: ['ETH', 'TIME'].indexOf(token.symbol().toUpperCase()) >= 0,
    token
  }))

  return {
    account: session.account,
    profile: session.profile,
    tokens: sharedTokens.merge(walletTokens).sortBy(item => item.token.symbol()),
    walletTokens: wallet.tokens,
    isTokensLoaded: settings.isFetched && !wallet.tokensFetching
  }
}

function mapDispatchToProps (dispatch) {
  return {

    loadTokens: () => dispatch(listTokens()),

    handleAddToken: (data) => dispatch(modalsOpen({
      component: AddTokenDialog,
      data
    })),
    handleClose: () => dispatch(modalsClose()),
    handleSave: async (profile, tokens) => {

      dispatch(modalsClose())

      await dispatch(updateUserProfile(
        profile.set('tokens', new Immutable.Set(tokens))
      ))

      dispatch(watchInitWallet())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCurrencyDialog)
