import { CircularProgress, RaisedButton, FlatButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import TokenModel from 'models/tokens/TokenModel'
import { listTokens, revokeToken } from 'redux/settings/erc20/tokens/actions'
import { modalsOpen } from 'redux/modals/actions'
import CBETokenDialog from 'components/dialogs/CBETokenDialog'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'

import './Tokens.scss'

function prefix (token) {
  return `components.settings.Tokens.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends PureComponent {
  static propTypes = {
    isFetched: PropTypes.bool,
    getList: PropTypes.func,
    form: PropTypes.func,
    list: PropTypes.object,
    remove: PropTypes.func,
  }

  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getList()
    }
  }

  render () {
    const list = this.props.list.entrySeq().toArray()

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
                {list.map(([address, item]) => (
                  <div key={address} styleName='tableRow'>
                    <div styleName='bodyTableCell tableCellName'>
                      <div styleName='cellTitle'>Name:&nbsp;</div>
                      <div styleName='cellName'>
                        <div styleName='nameIcon'>
                          <IPFSImage
                            styleName='iconContent'
                            multihash={item.icon()}
                          />
                        </div>
                        <div styleName='nameTitle'>
                          {item.symbol()}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell tableCellAddress'>
                      <div styleName='ellipsis'>
                        <div styleName='ellipsisInner'>
                          <div styleName='cellTitle'>Address:&nbsp;</div>
                          {item.address()}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell'>
                      {item.isFetching()
                        ? (<CircularProgress size={24} thickness={1.5} style={{ float: 'right' }} />)
                        : (
                          <div styleName='tableCellActions'>
                            <div styleName='actionsItem'>
                              <RaisedButton
                                label={<Translate value='terms.modify' />}
                                primary
                                onTouchTap={() => this.props.form(item, true)}
                              />
                            </div>
                            <div styleName='actionsItem'>
                              <RaisedButton
                                label={<Translate value='terms.remove' />}
                                onTouchTap={() => this.props.remove(item)}
                              />
                            </div>
                          </div>
                        )
                      }
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
  const settingsERC20Tokens = state.get('settingsERC20Tokens')
  return {
    list: settingsERC20Tokens.list,
    isFetched: settingsERC20Tokens.isFetched,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listTokens()),
    remove: (token) => dispatch(revokeToken(token)),
    form: (token, isModify) => dispatch(modalsOpen({
      component: CBETokenDialog,
      props: {
        initialValues: token || new TokenModel(),
        isModify,
      },
    })),
  }
}
