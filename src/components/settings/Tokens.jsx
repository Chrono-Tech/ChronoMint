import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import { CircularProgress, RaisedButton, FlatButton, FontIcon } from 'material-ui'

import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import CBETokenDialog from 'components/dialogs/CBETokenDialog'
import TokenModel from 'models/TokenModel'

import { modalsOpen } from 'redux/modals/actions'
import { listTokens, revokeToken } from 'redux/settings/erc20/tokens/actions'

import './Tokens.scss'

function prefix (token) {
  return 'components.settings.Tokens.' + token
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Tokens extends Component {

  static propTypes = {
    isFetched: PropTypes.bool,
    getList: PropTypes.func,
    form: PropTypes.func,
    list: PropTypes.object,
    remove: PropTypes.func
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
        <div styleName='panel-head'>
          <h3 styleName='head-title'><Translate value={prefix('tokens')} /></h3>
          <div styleName='head-actions'>
            <FlatButton
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              label='Add Token'
              primary
              onTouchTap={() => this.props.form(new TokenModel(), false)}
            />
          </div>
        </div>
        {!this.props.isFetched
          ? (
            <div styleName='panel-progress'>
              <CircularProgress size={24} thickness={1.5} />
            </div>
          )
          : (
            <div styleName='panel-table'>
              <div styleName='table-head'>
                <div styleName='table-row'>
                  <div styleName='table-cell'><Translate value={prefix('name')} /></div>
                  <div styleName='table-cell'><Translate value={prefix('smartContractAddress')} /></div>
                  <div styleName='table-cell'><Translate value={prefix('actions')} /></div>
                </div>
              </div>
              <div styleName='table-body'>
                {list.map(([address, item]) => (
                  <div key={address} styleName='table-row'>
                    <div styleName='table-cell table-cell-name'>
                      <div styleName='cell-title'>Name:&nbsp;</div>
                      <div styleName='cell-name'>
                        <div styleName='name-icon'>
                          <IPFSImage
                            styleName='icon-content'
                            multihash={item.icon()} />
                        </div>
                        <div styleName='name-title'>
                          {item.symbol()}
                        </div>
                      </div>
                    </div>
                    <div styleName='table-cell table-cell-address'>
                      <div styleName='ellipsis'>
                        <div styleName='ellipsis-inner'>
                          <div styleName='cell-title'>Address:&nbsp;</div>
                          {item.address()}
                        </div>
                      </div>
                    </div>
                    <div styleName='table-cell table-cell-actions'>
                      {item.isFetching()
                        ? (<CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />)
                        : (
                          <div styleName='actions'>
                            <div styleName='actions-item'>
                              <RaisedButton
                                label={<Translate value='terms.modify' />}
                                primary
                                onTouchTap={() => this.props.form(item, true)}
                              />
                            </div>
                            <div styleName='actions-item'>
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
    isFetched: settingsERC20Tokens.isFetched
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
        isModify
      }
    }))
  }
}
