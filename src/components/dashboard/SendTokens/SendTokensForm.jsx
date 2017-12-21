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
import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { DUCK_SESSION } from 'redux/session/actions'
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
  max: 2,
  step: 0.1,
}

function prefix (token) {
  return 'components.dashboard.SendTokens.' + token
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_SEND_TOKENS)
  const tokenId = selector(state, 'symbol')
  const feeMultiplier = selector(state, 'feeMultiplier')

  return {
    balance: getCurrentWallet(state).balances().item(tokenId).amount(),
    account: state.get(DUCK_SESSION).account,
    token: state.get(DUCK_TOKENS).item(tokenId),
    feeMultiplier,
  }
}

@connect(mapStateToProps, null)
@reduxForm({ form: FORM_SEND_TOKENS, validate })
export default class SendTokensForm extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    wallet: PropTypes.object,
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

  // TODO @dkchv: !!! restore
  async checkIsContract (address) {
    const isContact = contractsManagerDAO.isContract(address)
  }

  handleTransfer = (values) => {
    this.props.onSubmit(values.set('action', ACTION_TRANSFER))
  }

  handleApprove = (values) => {
    this.props.onSubmit(values.set('action', ACTION_APPROVE))
  }

  renderHead () {
    const { token, wallet } = this.props
    const balances = wallet.balances()
    const currentBalance = balances.item(token.id())

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
            {balances.size() === 0
              ? <Preloader />
              : (
                <Field
                  component={SelectField}
                  name='symbol'
                  fullWidth
                  {...styles}
                >
                  {balances.items().map((balance) => (
                    <MenuItem
                      key={balance.id()}
                      value={balance.id()}
                      primaryText={balance.symbol()}
                    />
                  ))}
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
      </div>
    )
  }

  renderBody () {
    const { invalid, pristine, token, handleSubmit, feeMultiplier, wallet } = this.props
    // TODO @dkchv: !!! restore
    // const { isContract } = this.state
    const isContract = true

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
        {!(feeMultiplier && token.feeRate()) ? null : (
          <div>
            <div styleName='feeRate'>
              <div>
                <small>
                  <Translate
                    value={prefix('feeRate')}
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
            </div>
          </div>
        )}
        <div styleName='row'>
          <div styleName='send'>
            <RaisedButton
              label={<Translate value={prefix('send')} />}
              primary
              style={{ float: 'right', marginTop: '20px' }}
              disabled={pristine || invalid || token.isLocked()}
              onTouchTap={handleSubmit(this.handleTransfer)}
            />
            {token.isERC20() && (
              <RaisedButton
                label={<Translate value={prefix('approve')} />}
                primary
                style={{ float: 'right', marginTop: '20px', marginRight: '40px' }}
                disabled={pristine || invalid || !isContract}
                onTouchTap={handleSubmit(this.handleApprove)}
              />
            )}
          </div>
        </div>
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
          />
        </form>
      </Paper>
    )
  }
}

