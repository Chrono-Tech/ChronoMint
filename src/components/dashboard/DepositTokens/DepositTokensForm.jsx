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
import TokenModel from 'models/tokens/TokenModel'
import MainWallet from 'models/wallet/MainWalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { depositAsset, DUCK_ASSETS_HOLDER, initAssetsHolder, withdrawAsset } from 'redux/assetsHolder/actions'
import { DUCK_MAIN_WALLET, mainApprove, requireTIME, updateIsTIMERequired } from 'redux/mainWallet/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import inversedTheme from 'styles/themes/inversed'
import ColoredSection from '../ColoredSection/ColoredSection'
import IconSection from '../IconSection/IconSection'
import './DepositTokensForm.scss'
import validate from './validate'

const DEPOSIT_LIMIT = 1
const FORM_DEPOSIT_TOKENS = 'FormDepositTokens'

function prefix (token) {
  return `components.dashboard.DepositTokens.${token}`
}

function mapStateToProps (state) {
  // form
  const selector = formValueSelector(FORM_DEPOSIT_TOKENS)
  const selectedToken = selector(state, 'symbol')
  // state
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const assetHolder = state.get(DUCK_ASSETS_HOLDER)
  const tokens = state.get(DUCK_TOKENS)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)

  const token = tokens.item(selectedToken)
  const isTesting = isTestingNetwork(selectedNetworkId, selectedProviderId)
  const balance = wallet.balances().item(selectedToken).amount()

  return {
    selectedToken,
    token,
    tokens: tokens.filter((item) => item.isERC20()).toArray(),
    balance,
    deposit: assetHolder.deposit(),
    isShowTIMERequired: isTesting && !wallet.isTIMERequired() && balance.isZero(),
    account: state.get(DUCK_SESSION).account,
    allowance: assetHolder.allowance(),
    isTesting,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    updateRequireTIME: () => dispatch(updateIsTIMERequired()),
    mainApprove: (token, amount, spender) => dispatch(mainApprove(token, amount, spender)),
    depositAsset: (amount, token) => dispatch(depositAsset(amount, token)),
    withdrawAsset: (amount) => dispatch(withdrawAsset(amount)),
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
    initAssetsHolder: PropTypes.func,
    mainApprove: PropTypes.func,
    depositAsset: PropTypes.func,
    withdrawAsset: PropTypes.func,
    requireTIME: PropTypes.func,
    isShowTIMERequired: PropTypes.bool,
    isTesting: PropTypes.bool,
    updateRequireTIME: PropTypes.func,
    token: PropTypes.instanceOf(TokenModel),
    errors: PropTypes.object,
    account: PropTypes.string,
    wallet: PropTypes.instanceOf(MainWallet),
    tokens: PropTypes.arrayOf(TokenModel),
    selectedToken: PropTypes.string,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      errors: null,
    }
  }

  componentWillMount () {
    this.props.initAssetsHolder()
    this.props.updateRequireTIME()
  }

  handleApproveTIME = () => {
    this.props.mainApprove(this.props.token, +this.state.amount, this.props.account)
    if (Number(this.state.amount) === 0) {
      this.setState({ amount: '' })
    }
  }

  handleRevokeTIME = () => {
    this.props.mainApprove(this.props.token, 0, this.props.account)
  }

  handleDepositAsset = () => {
    const { token } = this.props
    this.props.depositAsset(new Amount(this.state.amount, token.symbol(), token))
    this.setState({ amount: '' })
  }

  handleWithdrawAsset = () => {
    const { token } = this.props
    this.props.withdrawAsset(new Amount(this.state.amount, token.symbol()), token)
    this.setState({ amount: '' })
  }

  handleRequireTime = () => this.props.requireTIME()

  getIsLockValid () {
    const { token, isTesting, allowance, deposit } = this.props
    const limit = isTesting
      ? BigNumber.min(
        token.balance(),
        allowance,
      )
      : BigNumber.min(
        DEPOSIT_LIMIT,
        token.balance(),
        BigNumber.max(new BigNumber(DEPOSIT_LIMIT).minus(deposit), 0),
        allowance,
      )
    return limit.gte(this.state.amount)
  }

  renderHead () {
    const { deposit, allowance, token, balance, tokens, selectedToken } = this.props
    const symbol = token.symbol()

    return (
      <div>
        <IconSection
          title={<Translate value={prefix('depositTime')} />}
          iconComponent={selectedToken && (
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={TOKEN_ICONS[ token.symbol() ]}
            />
          )}
        >
          <MuiThemeProvider theme={inversedTheme}>
            <div>
              {tokens.size === 0
                ? <Preloader />
                : (
                  <Field
                    component={SelectField}
                    name='symbol'
                    fullWidth
                    {...styles}
                  >
                    {tokens.map((item) => (
                      <MenuItem
                        key={item.id()}
                        value={item.id()}
                        primaryText={item.symbol()}
                      />
                    ))}
                  </Field>
                )
              }
              {selectedToken
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
                  <div>Select token</div>
                )}
            </div>
          </MuiThemeProvider>
        </IconSection>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='form'>
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
      </div>
    )
  }

  renderFoot () {
    const { amount } = this.state
    const { isShowTIMERequired, deposit, errors, token, allowance } = this.props
    const isValid = !errors && String(amount).length > 0 && +amount > 0

    const isApprove = isValid && token.balance().gte(amount)
    const isLock = isValid && this.getIsLockValid()
    const isWithdraw = isValid && +amount <= deposit
    const isRevoke = !allowance.isZero()
    return (
      <div styleName='actions'>
        {isShowTIMERequired
          ? (
            <span styleName='action'>
              <FlatButton
                styleName='actionButton'
                label={<Translate value={prefix('requireTime')} />}
                onTouchTap={this.handleRequireTime}
              />
            </span>
          ) : (
            <span styleName='action'>
              <RaisedButton
                styleName='actionButton'
                label={isRevoke ? 'Revoke' : 'Approve'}
                onTouchTap={isRevoke ? this.handleRevokeTIME : this.handleApproveTIME}
                disabled={!isRevoke && !isApprove}
              />
            </span>
          )
        }
        {!isShowTIMERequired && (
          <span styleName='action'>
            <RaisedButton
              styleName='actionButton'
              label='Lock'
              primary
              onTouchTap={this.handleDepositAsset}
              disabled={!isLock}
            />
          </span>
        )}
        <span styleName='action'>
          <RaisedButton
            styleName='actionButton'
            label={<Translate value={prefix('withdraw')} />}
            primary
            onTouchTap={this.handleWithdrawAsset}
            disabled={!isWithdraw}
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
            styleName='root'
            head={this.renderHead()}
            body={this.renderBody()}
            foot={this.renderFoot()}
          />
        </form>
      </Paper>
    )
  }
}
