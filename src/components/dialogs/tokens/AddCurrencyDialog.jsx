import Points from 'components/common/Points/Points'
import Immutable from 'immutable'
import { FloatingActionButton, FontIcon } from 'material-ui'
import { Button } from 'components'
import BalancesCollection from 'models/tokens/BalancesCollection'
import TokensCollection from 'models/tokens/TokensCollection'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'
import { modalsClose, modalsOpen } from 'redux/modals/actions'
import { DUCK_SESSION, updateUserProfile } from 'redux/session/actions'
import ProfileModel, { isTokenChecked } from 'models/ProfileModel'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenModel from 'models/tokens/TokenModel'
import { getProfileTokens } from 'redux/session/selectors'
import AddTokenDialog from '../AddTokenDialog/AddTokenDialog'
import ModalDialog from '../ModalDialog'
import './AddCurrencyDialog.scss'
import TokenRow from './TokenRow'
import TokenRowPlaceholder from './TokenRowPlaceholder'

function stateFromProps (props) {
  return {
    selectedTokens: props.profileTokens,
  }
}

export const checkToken = (token: TokenModel, item: Object) => {
  const checkBlockchain = token.blockchain() === item.blockchain
  const checkItem = item.address ? item.address === token.address() : item.symbol === token.symbol()
  return checkBlockchain && checkItem
}

function prefix (token) {
  return `components.dialogs.AddCurrencyDialog.${token}`
}

function mapStateToProps (state) {
  const wallet = state.get(DUCK_MAIN_WALLET)
  const session = state.get(DUCK_SESSION)
  return {
    profileTokens: getProfileTokens()(state),
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
    profileTokens: PropTypes.arrayOf(PropTypes.object),
    profile: PropTypes.instanceOf(ProfileModel),
    tokens: PropTypes.instanceOf(TokensCollection),
    balances: PropTypes.instanceOf(BalancesCollection),
    handleAddToken: PropTypes.func,
    modalsClose: PropTypes.func,
    updateUserProfile: PropTypes.func,
  }

  constructor () {
    super(...arguments)

    this.handleSave = this.handleSave.bind(this)
    this.state = stateFromProps(this.props)
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  handleCurrencyChecked = (token: TokenModel, isSelect: boolean) => {
    let { selectedTokens } = this.state
    let exist = false
    selectedTokens = selectedTokens.map((item) => {
      if (isTokenChecked(token, item)) {
        item.show = isSelect
        exist = true
      }
      return item
    })

    if (!exist) {
      selectedTokens.push({
        address: token.address(),
        symbol: token.symbol(),
        blockchain: token.blockchain(),
        show: isSelect,
      })
    }

    this.setState({ selectedTokens })
  }

  handleSave () {
    const profile = this.props.profile.tokens(new Immutable.Set(this.state.selectedTokens))

    this.props.modalsClose()
    this.props.updateUserProfile(profile)
  }

  renderRow = (selectedTokens, balances, profile) => (token: TokenModel) => {
    let isSelected = false
    selectedTokens.map((item) => {
      if (isTokenChecked(token, item)) {
        isSelected = item.show
      }
    })

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
            <Button
              styleName='action'
              label={<Translate value={prefix('save')} />}
              onTouchTap={this.handleSave}
            />
            <Button
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
