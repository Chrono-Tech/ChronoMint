import BalanceModel from '@/models/tokens/BalanceModel'
import { getCurrentWallet } from '@/redux/wallet/actions'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import { IPFSImage } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ColoredSection from 'components/dashboard/ColoredSection/ColoredSection'
import IconSection from 'components/dashboard/IconSection/IconSection'
import tokenIcons from 'components/tokenIcons'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { MenuItem, MuiThemeProvider, Paper, RaisedButton } from 'material-ui'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import inversedTheme from 'styles/themes/inversed'
import styles from '../styles'
import './SendTokensForm.scss'
import validate from './validate'

export const FORM_SEND_TOKENS = 'FormSendTokens'

export const ACTION_TRANSFER = 'action/transfer'
export const ACTION_APPROVE = 'action/approve'

function prefix (token) {
  return 'components.dashboard.SendTokens.' + token
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const symbol = selector(state, 'symbol')

  return {
    balance: getCurrentWallet(state).balances().item(symbol),
    account: state.get(DUCK_SESSION).account,
    token: state.get(DUCK_TOKENS).item(symbol) || new TokenModel(),
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class SendTokensForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    wallet: PropTypes.object,
    token: PropTypes.instanceOf(TokenModel),
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

  // TODO @dkchv: !!! restore
  async checkIsContract (address) {
    const isContact = contractsManagerDAO.isContract(address)
  }

  renderHead () {
    const { token, wallet } = this.props
    const balances = wallet.balances()
    const currentBalance = balances.item(token.symbol()) || new BalanceModel()

    return (
      <div>
        <IconSection
          title={<Translate value='wallet.sendTokens' />}
          iconComponent={(
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={tokenIcons[ token.symbol() ]}
            />
          )}
        >
          <MuiThemeProvider theme={inversedTheme}>
            <Field
              component={SelectField}
              name='symbol'
              fullWidth
              {...styles}
            >
              {balances.size() > 0
                ? balances.items().map((balance) => {
                  const symbol = balance.id()
                  return (
                    <MenuItem
                      key={symbol}
                      value={symbol}
                      primaryText={symbol}
                    />
                  )
                })
                : <Preloader />
              }
            </Field>
          </MuiThemeProvider>
        </IconSection>
        <div styleName='balance'>
          <div styleName='label'><Translate value={prefix('balance')} />:</div>
          <div styleName='value'>
            <TokenValue
              isInvert
              value={currentBalance.amount()}
            />
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    const { invalid, pristine, token, handleSubmit, onSubmit, wallet } = this.props
    const { isContract } = this.state

    return (
      <div>
        <div styleName='from'>From:
          <img
            styleName='fromIcon'
            src={wallet.isMultisig() ? WalletMultiSVG : WalletMainSVG}
          /> {wallet.address()}
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
        <div styleName='row'>
          <div styleName='send'>
            <RaisedButton
              label={<Translate value={prefix('send')} />}
              primary
              style={{ float: 'right', marginTop: '20px' }}
              disabled={pristine || invalid}
              onTouchTap={handleSubmit((values) => onSubmit(values.set('action', ACTION_TRANSFER)))}
            />
            {token.isERC20() && (
              <RaisedButton
                label={<Translate value={prefix('approve')} />}
                primary
                style={{ float: 'right', marginTop: '20px', marginRight: '40px' }}
                disabled={pristine || invalid || !isContract}
                onTouchTap={handleSubmit((values) => onSubmit(values.set('action', ACTION_APPROVE)))}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { token } = this.props

    return (
      <Paper>
        <form onSubmit={this.props.handleSubmit}>
          <ColoredSection
            head={this.renderHead()}
            body={this.renderBody({ token })}
          />
        </form>
      </Paper>
    )
  }
}

