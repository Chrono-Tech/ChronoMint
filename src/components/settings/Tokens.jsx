import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import CBETokenDialog from 'components/dialogs/CBETokenDialog'
import { CircularProgress, FlatButton, FontIcon, RaisedButton } from 'material-ui'
import TokensCollection from 'models/tokens/TokensCollection'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsOpen } from 'redux/modals/actions'
import { revokeToken } from 'redux/settings/erc20/tokens/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import './Tokens.scss'

function prefix (token) {
  return `components.settings.Tokens.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends PureComponent {
  static propTypes = {
    isFetched: PropTypes.bool,
    tokens: PropTypes.instanceOf(TokensCollection),
    form: PropTypes.func,
    remove: PropTypes.func,
  }

  render () {
    const { tokens } = this.props

    return (
      <div styleName='panel'>
        <div styleName='panelHead'>
          <h3 styleName='headTitle'><Translate value={prefix('tokens')} /></h3>
          <div styleName='headActions'>
            <FlatButton
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              label={<Translate value={prefix('addToken')} />}
              primary
              onTouchTap={() => this.props.form(new TokenModel(), false)}
            />
          </div>
        </div>
        {!this.props.isFetched
          ? (
            <div styleName='panelProgress'>
              <CircularProgress size={24} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='panelTable'>
              <div styleName='tableHead'>
                <div styleName='tableRow'>
                  <div styleName='headTableCell'><Translate value={prefix('name')} /></div>
                  <div styleName='headTableCell'><Translate value={prefix('smartContractAddress')} /></div>
                  <div styleName='headTableCell'><Translate value={prefix('actions')} /></div>
                </div>
              </div>
              <div styleName='tableBody'>
                {tokens.items().map((token: TokenModel) => (
                  <div key={token.id()} styleName='tableRow'>
                    <div styleName='bodyTableCell tableCellName'>
                      <div styleName='cellTitle'>Name:&nbsp;</div>
                      <div styleName='cellName'>
                        <div styleName='nameIcon'>
                          <IPFSImage
                            styleName='iconContent'
                            multihash={token.icon()}
                          />
                        </div>
                        <div styleName='nameTitle'>
                          {token.symbol()}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell tableCellAddress'>
                      <div styleName='ellipsis'>
                        <div styleName='ellipsisInner'>
                          <div styleName='cellTitle'>Address:&nbsp;</div>
                          {token.address()}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell'>
                      <div styleName='tableCellActions'>
                        <div styleName='actionsItem'>
                          <RaisedButton
                            label={<Translate value='terms.modify' />}
                            primary
                            onTouchTap={() => this.props.form(token, true)}
                          />
                        </div>
                        <div styleName='actionsItem'>
                          <RaisedButton
                            label={<Translate value='terms.remove' />}
                            onTouchTap={() => this.props.remove(token)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state.get(DUCK_TOKENS)
}

function mapDispatchToProps (dispatch) {
  return {
    remove: (token) => dispatch(revokeToken(token)),
    form: (token, isModify) => dispatch(modalsOpen({
      component: CBETokenDialog,
      props: {
        initialValues: token,
        isModify,
      },
    })),
  }
}
