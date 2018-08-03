/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CopyIcon, IPFSImage } from 'components'
import QRCode from 'qrcode'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { Link } from 'react-router'
import { TOKEN_ICONS } from 'assets'
import Select from 'redux-form-material-ui/es/Select'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'
import ModalDialog from 'components/dialogs/ModalDialog'
import { TIME } from '@chronobank/core/redux/mainWallet/actions'
import HITBTC_PNG from 'assets/img/marketsLogos/hitbtc.png'
import LIVECOIN_PNG from 'assets/img/marketsLogos/livecoin.png'
import LIQUI_PNG from 'assets/img/marketsLogos/liqui.png'
import KUCOIN_PNG from 'assets/img/marketsLogos/kucoin.png'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { getTokensForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import { MenuItem } from '@material-ui/core'
import { FORM_RECEIVE_TOKENS } from 'components/constants'
import styles from '../styles'
import './ReceiveTokenModal.scss'

const marketsTIME = [
  {
    title: 'HitBTC',
    url: 'https://hitbtc.com/TIME-to-BTC',
    img: HITBTC_PNG,
  },
  {
    title: 'Livecoin',
    url: 'https://www.livecoin.net/',
    img: LIVECOIN_PNG,
  },
  {
    title: 'Liqui',
    url: 'https://liqui.io/#/exchange/TIME_BTC',
    img: LIQUI_PNG,
  },
  {
    title: 'KuCoin',
    url: 'https://www.kucoin.com/#/trade.pro/TIME-BTC',
    img: KUCOIN_PNG,
  },
]

function prefix (token) {
  return `components.ReceiveTokenModal.${token}`
}

function mapStateToProps (state, ownProps) {
  const selector = formValueSelector(FORM_RECEIVE_TOKENS)
  const tokens = getTokensForBlockchain(ownProps.wallet.blockchain)(state)

  return {
    token: state.get(DUCK_TOKENS).item(selector(state, 'tokenId') || ownProps.tokenId),
    tokens,
    address: ownProps.wallet.address,
    initialValues: {
      tokenId: ownProps.tokenId || tokens[0].id(),
    },
  }
}

@connect(mapStateToProps)
@reduxForm({ form: FORM_RECEIVE_TOKENS })
export default class ReceiveTokenModal extends PureComponent {
  static propTypes = {
    tokenId: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    tokens: PropTypes.arrayOf(PropTypes.instanceOf(TokenModel)),
    address: PropTypes.string,
    dispatch: PropTypes.func,
    ...formPropTypes,
  }

  constructor (props) {
    super(props)
    this.state = {
      qrData: null,
    }
  }

  componentDidMount () {
    QRCode.toDataURL(this.props.address, (err, qrData) => {
      this.setState({
        qrData,
      })
    })
  }

  handleSelectToken (value) {
    this.props.dispatch(change(FORM_RECEIVE_TOKENS, 'tokenId', value))
  }

  handleSubmit () {
    // do nothing
  }

  renderHead () {
    const { token } = this.props
    const symbol = token.symbol()
    return (
      <div styleName='head'>
        <div styleName='mainTitle'><Translate value={prefix('receive')} /></div>
        <div styleName='icon'>
          <div styleName='imgWrapper'>
            <IPFSImage
              styleName='iconImg'
              multihash={token.icon()}
              fallback={TOKEN_ICONS[symbol] || TOKEN_ICONS.DEFAULT}
            />
          </div>
        </div>
        {this.props.tokens.length > 1 && (
          <div styleName='tokenSelector'>
            <Field
              fullWidth
              component={Select}
              name='tokenId'
              {...styles.whiteselectorstyle}
            >
              {
                this.props.tokens
                  .map((token: TokenModel) => {
                    return (<MenuItem
                      key={token.symbol()}
                      value={token.id()}
                      primaryText={<span>{token.symbol()}</span>}
                    />)
                  })}
            </Field>
          </div>
        )}
      </div>
    )
  }

  renderBody () {
    const { token, address } = this.props
    return (
      <div>
        <div styleName='warningWrapper'>
          <div styleName='title'><Translate value={prefix('important')} /></div>
          <div styleName='text'><Translate value={prefix('warningText1')} /><b>{token.symbol()}</b><Translate value={prefix('warningText2')} /></div>
        </div>
        <div styleName='addressWrapper'>
          <div>
            <div styleName='title'><Translate value={prefix('receivingTitle')} symbol={token.symbol()} /></div>
            <div styleName='address'>{address}</div>
          </div>
          <div styleName='copyIcon'>
            <CopyIcon value={address} />
          </div>
        </div>
        <div styleName='qrWrapper'>
          <div styleName='title'><Translate value={prefix('qrTitle')} symbol={token.symbol()} /></div>
          <div styleName='qrCode'><img alt='qr code' src={this.state.qrData} /></div>
        </div>
        {token.id() === TIME && (
          <div styleName='marketWrapper'>
            <div styleName='title'><Translate value={prefix('buyTitle')} symbol={token.symbol()} /></div>
            <div styleName='marketList'>
              {marketsTIME.map((market) => {
                return (
                  <Link styleName='market' key={market.title} href={market.url} target='_blank'>
                    <img src={market.img} alt={market.title} />
                    <div styleName='title'>{market.title}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  render () {
    return (
      <ModalDialog>
        <form styleName='root' onSubmit={this.handleSubmit}>
          {this.renderHead()}
          <div styleName='body'>
            {this.renderBody()}
          </div>
        </form>
      </ModalDialog>
    )
  }
}
