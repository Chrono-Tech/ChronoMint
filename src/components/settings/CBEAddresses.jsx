import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import { CircularProgress, RaisedButton, FlatButton, FontIcon } from 'material-ui'

import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import CBEAddressDialog from 'components/dialogs/CBEAddressDialog'
import CBEModel from 'models/CBEModel'

import { modalsOpen } from 'redux/modals/actions'
import { listCBE, revokeCBE } from 'redux/settings/user/cbe/actions'

import './CBEAddresses.scss'

function prefix (token) {
  return 'components.settings.CBEAddresses.' + token
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CBEAddresses extends Component {

  static propTypes = {
    account: PropTypes.string,
    isFetched: PropTypes.bool,
    getList: PropTypes.func,
    form: PropTypes.func,
    list: PropTypes.object,
    revoke: PropTypes.func
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
          <h3 styleName='head-title'><Translate value={prefix('cbeAddresses')} /></h3>
          <div styleName='head-actions'>
            <FlatButton
              icon={<FontIcon className='material-icons'>add</FontIcon>}
              label={<Translate value={prefix('addCbe')} />}
              primary
              onTouchTap={() => this.props.form(new CBEModel())}
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
                            multihash={item.user().icon()} />
                        </div>
                        <div styleName='name-title'>
                          {item.name()}
                        </div>
                      </div>
                    </div>
                    <div styleName='table-cell table-cell-address'>
                      <div styleName='ellipsis'>
                        <div styleName='ellipsis-inner'>
                          <div styleName='cell-title'>Address:&nbsp;</div>
                          {address}
                        </div>
                      </div>
                    </div>
                    <div styleName='table-cell table-cell-actions'>
                      <div styleName='actions'>
                        {item.isFetching()
                          ? (<CircularProgress size={24} thickness={1.5} style={{float: 'right'}} />)
                          : (
                            <div styleName='actions-item'>
                              <RaisedButton
                                label='Remove'
                                disabled={this.props.account === address}
                                onTouchTap={() => this.props.revoke(item)}
                              />
                            </div>
                          )
                        }
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
  const settingsUserCBE = state.get('settingsUserCBE')
  const session = state.get('session')
  return {
    account: session.account,
    list: settingsUserCBE.list,
    isFetched: settingsUserCBE.isFetched
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listCBE()),
    revoke: (cbe) => dispatch(revokeCBE(cbe)),
    form: (cbe) => dispatch(modalsOpen({
      component: CBEAddressDialog,
      props: {
        initialValues: cbe || new CBEModel()
      }
    }))
  }
}
