import MultisigWalletModel from '@/models/wallet/MultisigWalletModel'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import Immutable from 'immutable'
import { TOKEN_ICONS } from 'assets'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import { IPFSImage } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ColoredSection from 'components/dashboard/ColoredSection/ColoredSection'
import IconSection from 'components/dashboard/IconSection/IconSection'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { MenuItem, MuiThemeProvider, Paper, RaisedButton } from 'material-ui'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, Slider, TextField } from 'redux-form-material-ui'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import MainWallet from 'models/wallet/MainWalletModel'
import BalanceModel from 'models/tokens/BalanceModel'
import { DUCK_MAIN_WALLET, getSpendersAllowance } from 'redux/mainWallet/actions'
import AllowanceModel from 'models/wallet/AllowanceModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { getVisibleBalances, BALANCES_COMPARATOR_SYMBOL } from 'redux/session/selectors'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { getCurrentWallet } from 'redux/wallet/actions'
import inversedTheme from 'styles/themes/inversed'
import styles from '../styles'
import './SendTokensForm.scss'
import validate from './validate'

export const FORM_SEND_TOKENS = 'FormSendTokens'

export const ACTION_TRANSFER = 'action/transfer'
export const ACTION_APPROVE = 'action/approve'

const FEE_RATE_MULTIPLIER = {
  min: 0.1,
  max: 1.9,
  step: 0.1,
}

function prefix (token) {
  return 'components.dashboard.SendTokens.' + token
}

function mapStateToProps (state) {
  const wallet: MainWallet = state.get(DUCK_MAIN_WALLET)
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const tokenId = selector(state, 'symbol')
  const feeMultiplier = selector(state, 'feeMultiplier')
  const recipient = selector(state, 'recipient')
  const symbol = selector(state, 'symbol')

  return {
    wallet,
    visibleBalances: getVisibleBalances(BALANCES_COMPARATOR_SYMBOL)(state),
    tokens: state.get(DUCK_TOKENS),
    balance: getCurrentWallet(state).balances().item(tokenId).amount(),
    allowance: wallet.allowances().item(recipient, tokenId),
    account: state.get(DUCK_SESSION).account,
    token: state.get(DUCK_TOKENS).item(tokenId),
    recipient,
    symbol,
    feeMultiplier,
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class SendTokensForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    wallet: PropTypes.oneOfType([
      PropTypes.instanceOf(MainWallet),
      PropTypes.instanceOf(MultisigWalletModel),
    ]),
    visibleBalances: PropTypes.arrayOf(BalanceModel),
    allowance: PropTypes.instanceOf(AllowanceModel),
    recipient: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    feeMultiplier: PropTypes.number,
    transfer: PropTypes.func,
    onTransfer: PropTypes.func,
    onApprove: PropTypes.func,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {
      isContract: false,
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.token.address() !== this.props.token.address()) {
      this.checkIsContract(newProps.token.address())
        .then((result) => {
          this.setState({
            isContract: result,
          })
        })
    }

    if ((newProps.token.address() !== this.props.token.address() || newProps.recipient !== this.props.recipient) && newProps.token.isERC20()) {
      this.props.dispatch(getSpendersAllowance(newProps.token.id(), newProps.recipient))
    }

    const firstBalance = newProps.visibleBalances.length && newProps.visibleBalances[0]
    const isRelevant = newProps.visibleBalances.find((balance) => balance.id() === newProps.token.id())
    if (!(isRelevant && newProps.token.isFetched()) && firstBalance) {
      this.props.dispatch(change(FORM_SEND_TOKENS, 'symbol', firstBalance.id()))
    }
  }

  checkIsContract (address): Promise {
    return contractsManagerDAO.isContract(address)
  }

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER))
  }

  handleApprove = (values) => {
    if (this.props.allowance.amount().gt(0)) {
      values = values.set('amount', 0)
    }
    this.props.onSubmit(values.set('action', ACTION_APPROVE))
  }

  handleRevoke = () => {
    this.props.onSubmit(new Immutable.Map({
      action: ACTION_APPROVE,
      symbol: this.props.token.symbol(),
      amount: 0,
      recipient: this.props.recipient,
    }))
  }

  getFeeTitle () {
    const { token } = this.props

    switch (token.blockchain()) {
      case BLOCKCHAIN_BITCOIN:
      case BLOCKCHAIN_BITCOIN_CASH:
      case BLOCKCHAIN_BITCOIN_GOLD:
      case BLOCKCHAIN_LITECOIN:
        return 'feeRate'
      case BLOCKCHAIN_ETHEREUM:
        return 'gasPrice'
      default:
        return ''
    }
  }

  renderHead () {
    const { token, visibleBalances } = this.props
    const currentBalance = visibleBalances.find((balance) => balance.id() === token.id()) || visibleBalances[0]

    return (
      <div>
        <IconSection
          title={<Translate value='wallet.sendTokens' />}
          iconComponent={(
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={TOKEN_ICONS[ token.symbol() ]}
            />
          )}
        >
          <MuiThemeProvider theme={inversedTheme}>
            {visibleBalances.length === 0
              ? <Preloader />
              : (
                <Field
                  component={SelectField}
                  name='symbol'
                  fullWidth
                  {...styles}
                >
                  {visibleBalances
                    .map((balance) => {
                      const token: TokenModel = this.props.tokens.item(balance.id())
                      if (token.isLocked()) {
                        return
                      }
                      return (
                        <MenuItem
                          key={balance.id()}
                          value={balance.id()}
                          primaryText={balance.symbol()}
                        />
                      )
                    })}
                </Field>
              )
            }
          </MuiThemeProvider>
        </IconSection>
        <div styleName='balance'>
          <div styleName='label'><Translate value={prefix('balance')} />:</div>
          <div styleName='value'>
            <TokenValue isInvert value={currentBalance.amount()} />
          </div>
        </div>
        {
          token.isERC20() && this.props.allowance &&
          <div styleName='balance'>
            <div styleName='label'><Translate value={prefix('allowance')} />: <TokenValue isInvert value={this.props.allowance.amount()} />
            </div>
          </div>
        }
      </div>
    )
  }

  renderBody () {
    const { invalid, pristine, token, handleSubmit, feeMultiplier, wallet, allowance, recipient } = this.props
    const { isContract } = this.state
    const isApprove = allowance.amount().lte(0)

    return (
      <div>
        <div styleName='from'>From:
          <img
            styleName='fromIcon'
            src={wallet.isMultisig() ? WalletMultiSVG : WalletMainSVG}
          /> {wallet.addresses().item(token.blockchain()).address()}
        </div>
        <div>
          <Field
            component={TextField}
            name='recipient'
            floatingLabelText={<Translate value={prefix('recipientAddress')} />}
            fullWidth
          />
        </div>
        <div styleName='row'>
          <div styleName='amount'>
            <Field
              component={TextField}
              name='amount'
              floatingLabelText={<Translate value={prefix('amount')} />}
              fullWidth
            />
          </div>
        </div>
        {!(feeMultiplier && token.feeRate()) ? null : (
          <div>
            <div styleName='feeRate'>
              <div>
                <small>
                  <Translate
                    value={prefix(this.getFeeTitle())}
                    multiplier={feeMultiplier.toFixed(1)}
                    total={Number((feeMultiplier * token.feeRate()).toFixed(1))}
                  />
                </small>
              </div>
              <Field
                component={Slider}
                sliderStyle={{ marginBottom: 0, marginTop: 5 }}
                name='feeMultiplier'
                {...FEE_RATE_MULTIPLIER}
              />
              <div styleName='tagsWrap'>
                <div><Translate value={prefix('slow')} /></div>
                <div styleName='tagDefault' />
                <div><Translate value={prefix('fast')} /></div>
              </div>
            </div>
          </div>
        )}
        <div styleName='row'>
          <div styleName='send'>
            <RaisedButton
              label={<Translate value={prefix('send')} />}
              primary
              style={{ float: 'right', marginTop: '20px' }}
              disabled={pristine || invalid}
              onTouchTap={!pristine && !invalid && handleSubmit(this.handleTransfer)}
            />
            {token.isERC20() && isApprove && (
              <RaisedButton
                label={<Translate value={prefix('approve')} />}
                primary
                style={{ float: 'right', marginTop: '20px', marginRight: '40px' }}
                disabled={pristine || invalid || !isContract}
                onTouchTap={!pristine && !invalid && isContract && handleSubmit(this.handleApprove)}
              />
            )}
            {token.isERC20() && !isApprove && (
              <RaisedButton
                label={<Translate value={prefix('revoke')} />}
                primary
                style={{ float: 'right', marginTop: '20px', marginRight: '40px' }}
                disabled={!isContract}
                onTouchTap={isContract && token && recipient && this.handleRevoke}
              />
            )}

          </div>
        </div>
      </div>
    )
  }

  render () {
    const { visibleBalances } = this.props
    return !visibleBalances.length ? null : (
      <Paper>
        <form onSubmit={this.props.handleSubmit}>
          <ColoredSection
            head={this.renderHead()}
            body={this.renderBody()}
          />
        </form>
      </Paper>
    )
  }
}
