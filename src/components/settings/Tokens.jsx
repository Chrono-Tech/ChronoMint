import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { CircularProgress, RaisedButton, FlatButton, FontIcon } from 'material-ui'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'

import TokenModel from 'models/TokenModel'
import { listTokens, formToken, revokeToken } from 'redux/settings/erc20/tokens/actions'

import './Tokens.scss'

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
          <h3 styleName='head-title'>Tokens</h3>
          <div styleName='head-actions'>
            <FlatButton
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              label='Add Token'
              primary
              onTouchTap={() => this.props.form(new TokenModel())}
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
                  <div styleName='table-cell'>Name</div>
                  <div styleName='table-cell'>Smart Contract Address</div>
                  <div styleName='table-cell'>Actions</div>
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
                                label={I18n.t('terms.modify')}
                                primary
                                onTouchTap={() => this.props.form(item)}
                              />
                            </div>
                            <div styleName='actions-item'>
                              <RaisedButton
                                label={I18n.t('terms.remove')}
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
    form: (token) => dispatch(formToken(token)),
    remove: (token) => dispatch(revokeToken(token))
  }
}
