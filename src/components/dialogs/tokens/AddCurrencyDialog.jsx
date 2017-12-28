import Points from 'components/common/Points/Points'
import Immutable from 'immutable'
import { FloatingActionButton, FontIcon, RaisedButton } from 'material-ui'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { modalsClose, modalsOpen } from 'redux/modals/actions'
import { DUCK_SESSION, updateUserProfile } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import AddTokenDialog from '../AddTokenDialog/AddTokenDialog'
import ModalDialog from '../ModalDialog'
import './AddCurrencyDialog.scss'
import TokenRow from './TokenRow'
import TokenRowPlaceholder from './TokenRowPlaceholder'

function prefix (token) {
  return `components.dialogs.AddCurrencyDialog.${token}`
}

function mapStateToProps (state) {
  const wallet = state.get(DUCK_MAIN_WALLET)
  const session = state.get(DUCK_SESSION)
  return {
    profile: session.profile,
    tokens: state.get(DUCK_TOKENS),
    balances: wallet.balances(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleAddToken: () => dispatch(modalsOpen({
      component: AddTokenDialog,
    })),
    modalsClose: () => dispatch(modalsClose()),
    updateUserProfile: (profile) => dispatch(updateUserProfile(profile)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddCurrencyDialog extends PureComponent {
  static propTypes = {
    profile: PropTypes.object,
    tokens: PropTypes.instanceOf(TokensCollection),
    balances: PropTypes.instanceOf(BalancesCollection),
    handleAddToken: PropTypes.func,
    modalsClose: PropTypes.func,
    updateUserProfile: PropTypes.func,
  }

  constructor () {
    super(...arguments)

    this.handleSave = this.handleSave.bind(this)
    this.state = {
      selectedTokens: [],
    }
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  handleCurrencyChecked = (symbol, isSelect) => {
    const { selectedTokens } = this.state

    this.setState({
      selectedTokens: isSelect
        ? selectedTokens.concat(symbol)
        : selectedTokens.filter((item) => item !== symbol),
    })
  }

  handleSave () {
    const tokens = this.props.tokens.items().filter((item) => item.address() && !item.isOptional() || this.state.selectedTokens.includes(item.symbol()))
    const tokensAddresses = tokens.map((item) => item.address())
    const profile = this.props.profile.tokens(new Immutable.Set(tokensAddresses))

    this.props.modalsClose()
    this.props.updateUserProfile(profile)
  }

  renderRow = (selectedTokens, balances, profile) => (token) => {
    const isSelected = selectedTokens.includes(token.symbol())

    return (
      <TokenRow
        profile={profile}
        balances={balances}
        key={token.id()}
        token={token}
        isSelected={isSelected}
        onClick={this.handleCurrencyChecked}
      />
    )
  }

  renderPlaceholders (count) {
    const placeHolders = []
    for (let i = 0; i < count; i++) {
      placeHolders.push(<TokenRowPlaceholder key={i} />)
    }
    return placeHolders
  }

  renderTokens () {
    const { balances, tokens, profile } = this.props
    const { selectedTokens } = this.state

    return (
      <div styleName='table'>
        {tokens.items().map(this.renderRow(selectedTokens, balances, profile))}
        {this.renderPlaceholders(tokens.leftToFetch())}
      </div>
    )
  }

  render () {
    return (
      <ModalDialog styleName='root'>
        <div styleName='content'>
          <div styleName='header'>
            <h3><Translate value={prefix('tokens')} /></h3>
            <div styleName='subtitle'><Translate value={prefix('addToken')} /></div>
          </div>
          <div styleName='actions'>
            <div styleName='items'>
              <div styleName='item'>
                <FloatingActionButton onTouchTap={this.props.handleAddToken}>
                  <FontIcon className='material-icons'>add</FontIcon>
                </FloatingActionButton>
              </div>
            </div>
          </div>
          <div styleName='body'>
            <div styleName='column'>
              <h5><Translate value={prefix('allTokens')} /></h5>
              {this.renderTokens()}
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
              onTouchTap={this.handleSave}
            />
            <RaisedButton
              styleName='action'
              label={<Translate value={prefix('close')} />}
              onTouchTap={this.handleClose}
            />
          </div>
        </div>
      </ModalDialog>
    )
  }
}
