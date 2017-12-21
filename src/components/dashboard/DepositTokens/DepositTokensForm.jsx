import { isTestingNetwork } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import { TOKEN_ICONS } from 'assets'
import BigNumber from 'bignumber.js'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import styles from 'components/dashboard/styles'
import { FlatButton, MenuItem, MuiThemeProvider, Paper, RaisedButton } from 'material-ui'
import Amount from 'models/Amount'
import AssetsCollection from 'models/assetHolder/AssetsCollection'
import TokenModel from 'models/tokens/TokenModel'
import TokensCollection from 'models/tokens/TokensCollection'
import MainWallet from 'models/wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_ASSETS_HOLDER } from 'redux/assetsHolder/actions'
import { DUCK_MAIN_WALLET, mainApprove, requireTIME } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import inversedTheme from 'styles/themes/inversed'
import ColoredSection from '../ColoredSection/ColoredSection'
import IconSection from '../IconSection/IconSection'
import './DepositTokensForm.scss'
import validate from './validate'

const DEPOSIT_LIMIT = 1
const FORM_DEPOSIT_TOKENS = 'FormDepositTokens'

export const ACTION_APPROVE = 'deposit/approve'
export const ACTION_DEPOSIT = 'deposit/deposit'
export const ACTION_WITHDRAW = 'deposit/withdraw'

function prefix (token) {
  return `components.dashboard.DepositTokens.${token}`
}

function mapStateToProps (state) {
  // form
  const selector = formValueSelector(FORM_DEPOSIT_TOKENS)
  const tokenId = selector(state, 'symbol')
  const amount = selector(state, 'amount')
  // state
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(tokenId)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances().item(tokenId).amount()

  const assets = assetHolder.assets()
  const spender = assetHolder.wallet()

  return {
    balance,
    deposit: assets.item(token.address()).deposit(),
    allowance: wallet.allowances().item(spender, token.id()).amount(),
    spender,
    amount,
    token,
    tokens,
    assets,
    isShowTIMERequired: isTesting && !wallet.isTIMERequired() && balance.isZero() && token.symbol() === 'TIME',
    account: state.get(DUCK_SESSION).account,
    isTesting,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    requireTIME: () => dispatch(requireTIME()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_DEPOSIT_TOKENS, validate })
export default class DepositTokensForm extends PureComponent {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    allowance: PropTypes.instanceOf(Amount),
    balance: PropTypes.instanceOf(Amount),
    isShowTIMERequired: PropTypes.bool,
    isTesting: PropTypes.bool,
    token: PropTypes.instanceOf(TokenModel),
    account: PropTypes.string,
    wallet: PropTypes.instanceOf(MainWallet),
    tokens: PropTypes.instanceOf(TokensCollection),
    selectedToken: PropTypes.string,
    assets: PropTypes.instanceOf(AssetsCollection),
    requireTIME: PropTypes.func,
    mainApprove: PropTypes.func,
    ...formPropTypes,
  }

  handleApproveAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_APPROVE)
      .set('token', this.props.token)
      .set('spender', this.props.spender)
    )
  }

  handleRevokeAsset = () => {
    const { token, spender } = this.props
    this.props.mainApprove(this.props.token, new Amount(0, token.id()), spender)
  }

  handleDepositAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_DEPOSIT)
      .set('token', this.props.token),
    )
  }

  handleWithdrawAsset = (values) => {
    this.props.onSubmit(values
      .set('action', ACTION_WITHDRAW)
      .set('token', this.props.token),
    )
  }

  handleRequireTime = () => {
    this.props.requireTIME()
  }

  getIsLockValid (amount) {
    const { balance, isTesting, allowance, deposit } = this.props
    const limit = isTesting
      ? BigNumber.min(balance, allowance)
      : BigNumber.min(
        DEPOSIT_LIMIT,
        balance,
        BigNumber.max(new BigNumber(DEPOSIT_LIMIT).minus(deposit), 0),
        allowance,
      )
    return limit.gte(amount)
  }

  renderHead () {
    const { deposit, allowance, token, balance, assets } = this.props
    const symbol = token.symbol()
    return (
      <div>
        <IconSection
          title={<Translate value={prefix('depositTime')} />}
          iconComponent={token.isFetched() && (
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={TOKEN_ICONS[ symbol ]}
            />
          )}
        >
          <MuiThemeProvider theme={inversedTheme}>
            <div>
              {assets.size() === 0
                ? <Preloader />
                : (
                  <Field
                    component={SelectField}
                    name='symbol'
                    fullWidth
                    {...styles}
                  >
                    {assets.items().map((item) => (
                      <MenuItem
                        key={item.id()}
                        value={item.symbol()}
                        primaryText={item.symbol()}
                      />
                    ))}
                  </Field>
                )
              }
              {token.isFetched()
                ? (
                  <div>
                    <div styleName='balance'>
                      <div styleName='label'><Translate value={prefix('yourSymbolBalance')} symbol={symbol} />:</div>
                      <TokenValue isInvert value={balance} />
                    </div>
                    <div styleName='balance'>
                      <div styleName='label'><Translate value={prefix('yourSymbolDeposit')} symbol={symbol} />:</div>
                      <TokenValue isInvert value={deposit} />
                    </div>
                    <div styleName='balance'>
                      <div styleName='label'><Translate value={prefix('symbolHolderAllowance')} symbol={symbol} />:
                      </div>
                      <TokenValue isInvert value={allowance} />
                    </div>
                  </div>
                )
                : (
                  <div styleName='hint'>Select token</div>
                )}
            </div>
          </MuiThemeProvider>
        </IconSection>
      </div>
    )
  }

  renderBody () {
    return (
      <div>
        <Field
          component={TextField}
          hintText='0.00'
          floatingLabelText={<Translate value={prefix('amount')} />}
          name='amount'
          style={{ width: '150px' }}
        />
        {!this.props.isTesting && <div styleName='warning'><Translate value='errors.limitDepositOnMainnet' /></div>}
      </div>
    )
  }

  renderFoot () {
    const { isShowTIMERequired, amount, balance, deposit, token, allowance, pristine, invalid, handleSubmit } = this.props
    const isInvalid = pristine || invalid
    const isRevoke = !allowance.isZero()
    const amountWithDecimals = isInvalid
      ? new BigNumber(0)
      : token.addDecimals(amount || 0)

    const isRevokeDisabled = isInvalid
    const isApproveDisabled = isInvalid || balance.lte(amountWithDecimals)
    const isLockDisabled = isInvalid || !this.getIsLockValid(amountWithDecimals)
    const isWithdrawDisabled = isInvalid || deposit.lt(amountWithDecimals)
    return (
      <div styleName='actions'>
        <span styleName='action'>
          {isShowTIMERequired
            ? (
              <FlatButton
                styleName='actionButton'
                label={<Translate value={prefix('requireTime')} />}
                onTouchTap={this.handleRequireTime}
              />
            ) : (
              <RaisedButton
                styleName='actionButton'
                label={isRevoke ? 'Revoke' : 'Approve'}
                onTouchTap={isRevoke ? this.handleRevokeAsset : handleSubmit(this.handleApproveAsset)}
                disabled={isRevoke ? isRevokeDisabled : isApproveDisabled}
              />
            )
          }
        </span>

        {!isShowTIMERequired && (
          <span styleName='action'>
            <RaisedButton
              styleName='actionButton'
              label='Lock'
              primary
              onTouchTap={handleSubmit(this.handleDepositAsset)}
              disabled={isLockDisabled}
            />
          </span>
        )}
        <span styleName='action'>
          <RaisedButton
            styleName='actionButton'
            label={<Translate value={prefix('withdraw')} />}
            primary
            onTouchTap={handleSubmit(this.handleWithdrawAsset)}
            disabled={isWithdrawDisabled}
          />
        </span>
      </div>
    )
  }

  render () {
    return (
      <Paper>
        <form onSubmit={this.props.handleSubmit}>
          <ColoredSection
            head={this.renderHead()}
            body={this.renderBody()}
            foot={this.renderFoot()}
          />
        </form>
      </Paper>
    )
  }
}
