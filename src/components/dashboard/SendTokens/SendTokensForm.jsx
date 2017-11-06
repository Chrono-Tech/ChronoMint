import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { reduxForm, formValueSelector, Field, formPropTypes } from 'redux-form/immutable'
import { SelectField, TextField } from 'redux-form-material-ui'
import { MuiThemeProvider, MenuItem, RaisedButton, Paper } from 'material-ui'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import TokenValue from 'components/common/TokenValue/TokenValue'
import { IPFSImage } from 'components'
import WalletMultiSVG from 'assets/img/icn-wallet-multi.svg'
import WalletMainSVG from 'assets/img/icn-wallet-main.svg'
import IconSection from 'components/dashboard/IconSection/IconSection'
import ColoredSection from 'components/dashboard/ColoredSection/ColoredSection'
import inversedTheme from 'styles/themes/inversed'
import { getCurrentWallet } from 'redux/wallet/actions'
import TokenModel from 'models/TokenModel'
import validate from './validate'
import styles from '../styles'
import './SendTokensForm.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  BTC: require('assets/img/icn-bitcoin.svg'),
  BCC: require('assets/img/icn-bitcoin-cash.svg'),
  TIME: require('assets/img/icn-time.svg'),
}

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
    account: state.get('session').account,
    token: getCurrentWallet(state).tokens().get(symbol),
  }
}

@connect(mapStateToProps, null)
@reduxForm({form: FORM_SEND_TOKENS, validate})
export class SendTokensForm extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    wallet: PropTypes.object,
    token: PropTypes.object,
    transfer: PropTypes.func,
    onTransfer: PropTypes.func,
    onApprove: PropTypes.func,
  } & formPropTypes

  constructor () {
    super(...arguments)
    this.state = {
      isContract: false,
    }
  }

  // TODO @dkchv: !!! restore
  async checkIsContract (address) {
    const isContact = contractsManagerDAO.isContract(address)
    console.log('--SendTokensForm#checkIsContract', isContact)
  }

  renderHead (token = new TokenModel()) {
    const symbol = token.symbol()

    return (
      <div>
        <IconSection
          title={<Translate value={'wallet.sendTokens'} />}
          iconComponent={(
            <IPFSImage
              styleName='content'
              multihash={token.icon()}
              fallback={ICON_OVERRIDES[symbol]}
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
              {this.props.wallet.tokens().keySeq().toArray().map(symbol => (
                <MenuItem
                  key={symbol}
                  value={symbol}
                  primaryText={symbol}
                />
              ))}
            </Field>
          </MuiThemeProvider>
        </IconSection>
        <div styleName='balance'>
          <div styleName='label'><Translate value={prefix('balance')} />:</div>
          <div styleName='value'>
            <TokenValue
              isInvert
              isLoading={!token.isFetched()}
              value={token.balance()}
              symbol={token.symbol()}
            />
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    const {invalid, pristine, token, handleSubmit, onSubmit, wallet} = this.props
    const {isContract} = this.state

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
              style={{float: 'right', marginTop: '20px'}}
              disabled={pristine || invalid}
              onTouchTap={handleSubmit(values => onSubmit(values.set('action', ACTION_TRANSFER)))}
            />
            {token && token.dao().isApproveRequired() && (
              <RaisedButton
                label={<Translate value={prefix('approve')} />}
                primary
                style={{float: 'right', marginTop: '20px', marginRight: '40px'}}
                disabled={pristine || invalid || !isContract}
                onTouchTap={handleSubmit(values => onSubmit(values.set('action', ACTION_APPROVE)))}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {token} = this.props

    return (
      <Paper>
        <form onSubmit={this.props.handleSubmit}>
          <ColoredSection
            head={this.renderHead(token)}
            body={this.renderBody({token})}
          />
        </form>
      </Paper>
    )
  }
}

export default SendTokensForm
