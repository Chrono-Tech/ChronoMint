import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import CBETokenDialog from 'components/dialogs/CBETokenDialog/CBETokenDialog'
import { FlatButton, FontIcon, RaisedButton } from 'material-ui'
import TokenModel from 'models/tokens/TokenModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { modalsOpen } from 'redux/modals/actions'
import { revokeToken } from 'redux/settings/erc20/tokens/actions'
import { getChronobankTokens } from 'redux/settings/erc20/tokens/selectors'
import Preloader from 'components/common/Preloader/Preloader'
import './Tokens.scss'

function prefix (token) {
  return `components.settings.Tokens.${token}`
}

function mapStateToProps (state) {
  return {
    tokens: getChronobankTokens()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    remove: (token) => dispatch(revokeToken(token)),
    form: (token, isModify) => {
      dispatch(modalsOpen({
        component: CBETokenDialog,
        props: {
          initialValues: token,
          isModify,
        },
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends PureComponent {
  static propTypes = {
    isFetched: PropTypes.bool,
    tokens: PropTypes.arrayOf(
      PropTypes.instanceOf(TokenModel),
    ),
    form: PropTypes.func,
    remove: PropTypes.func,
  }

  handleEdit = (token, isModify = false) => () => {
    const newToken = token || new TokenModel({
      isERC20: true,
    })
    this.props.form(newToken, isModify)
  }

  handleRemove = (token) => () => {
    this.props.remove(token)
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
              onTouchTap={this.handleEdit()}
            />
          </div>
        </div>
        <div styleName='panelTable'>
          <div styleName='tableHead'>
            <div styleName='tableRow'>
              <div styleName='headTableCell'><Translate value={prefix('name')} /></div>
              <div styleName='headTableCell'><Translate value={prefix('smartContractAddress')} /></div>
              <div styleName='headTableCell'><Translate value={prefix('actions')} /></div>
            </div>
          </div>
          <div styleName='tableBody'>
            {tokens.map((token: TokenModel) => (
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
                  {
                    token.isFetching()
                      ? <div styleName='tableCellActions'><Preloader /></div>
                      : (
                        <div styleName='tableCellActions'>
                          <div styleName='actionsItem'>
                            <RaisedButton
                              label={<Translate value='terms.modify' />}
                              primary
                              onTouchTap={this.handleEdit(token, true)}
                            />
                          </div>
                          <div styleName='actionsItem'>
                            <RaisedButton
                              label={<Translate value='terms.remove' />}
                              onTouchTap={this.handleRemove(token)}
                            />
                          </div>
                        </div>
                      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
