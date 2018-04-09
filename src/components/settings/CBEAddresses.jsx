/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { CircularProgress, RaisedButton, FlatButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import CBEModel from 'models/CBEModel'
import { listCBE, revokeCBE } from 'redux/settings/user/cbe/actions'
import { modalsOpen } from 'redux/modals/actions'
import CBEAddressDialog from 'components/dialogs/CBEAddressDialog'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'

import './CBEAddresses.scss'

function prefix (token) {
  return `components.settings.CBEAddresses.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CBEAddresses extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    isFetched: PropTypes.bool,
    getList: PropTypes.func,
    form: PropTypes.func,
    list: PropTypes.object,
    revoke: PropTypes.func,
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
          <h3 styleName='headTitle'><Translate value={prefix('cbeAddresses')} /></h3>
          <div styleName='headActions'>
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
                            multihash={item.user().icon()}
                          />
                        </div>
                        <div styleName='nameTitle'>
                          {item.name() || <em>Unknown</em>}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell tableCellAddress'>
                      <div styleName='ellipsis'>
                        <div styleName='ellipsisInner'>
                          <div styleName='cellTitle'>Address:&nbsp;</div>
                          {address}
                        </div>
                      </div>
                    </div>
                    <div styleName='bodyTableCell'>
                      <div styleName='tableCellActions'>
                        {item.isFetching()
                          ? (<CircularProgress size={24} thickness={1.5} style={{ float: 'right' }} />)
                          : (
                            <div styleName='actionsItem'>
                              <RaisedButton
                                label={<Translate value={prefix('remove')} />}
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
    isFetched: settingsUserCBE.isFetched,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listCBE()),
    revoke: (cbe) => dispatch(revokeCBE(cbe)),
    form: (cbe) => dispatch(modalsOpen({
      component: CBEAddressDialog,
      props: {
        initialValues: cbe || new CBEModel(),
      },
    })),
  }
}
