/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Button } from 'components'
import Immutable from 'immutable'
import { CircularProgress } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { getBlockExplorerUrl } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { connect } from 'react-redux'
import { confirmOperation, listOperations, loadMoreCompletedOperations, revokeOperation, setupOperationsSettings } from '@chronobank/core/redux/operations/actions'
import { modalsOpen } from 'redux/modals/actions'
import OperationsSettingsDialog from 'components/dialogs/OperationsSettingsDialog'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'
import Value from 'components/common/Value/Value'
import './Operations.scss'

function prefix (token) {
  return `components.operations.Operations.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingOperations extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
    filterOperations: PropTypes.func,
    showSignatures: PropTypes.bool,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getList: PropTypes.func,
    handleSettings: PropTypes.func,
    handleRevoke: PropTypes.func,
    handleConfirm: PropTypes.func,
    handleLoadMore: PropTypes.func,
    list: PropTypes.instanceOf(Immutable.Map),
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,

    completedFetching: PropTypes.bool,
    completedEndOfList: PropTypes.bool,
    locale: PropTypes.string,
  }

  static defaultProps = {
    // eslint-disable-next-line
    filterOperations: (op) => true, // get all operations by default
    showSignatures: false, // do not show signatures count by default
  }

  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  renderRow (op, index, href) {
    const tx = op.tx()
    const hash = tx.hash()
    const details = tx.details()

    return (
      <div styleName='tableRow' key={index}>
        <div styleName='bodyTableCell tableCellDescription'>
          <div styleName='entry'>
            <div styleName='entryIcon'>
              <i className='material-icons'>flash_on</i>
            </div>
            <div styleName='entryInfo'>
              <div styleName='infoTitle'>{tx.title()}</div>
              {hash
                ? (<div styleName='infoAddress'>{hash}</div>)
                : null
              }
              {details && details.map((item, index) => (
                <div key={index} styleName='infoProp'>
                  <span styleName='propName'>{item.label}:</span>&nbsp;
                  <span styleName='propValue'><Value value={item.value} /></span>
                </div>
              ))}
              {this.props.showSignatures
                ? (
                  <div styleName='infoProp infoPropSignatures'>
                    <span styleName='propName'><Translate value={prefix('signatures')} />:</span>
                    <span styleName='propValue'>{op.completed()} of {op.remained() + op.completed()}</span>
                  </div>
                )
                : null
              }
              <div styleName='infoDate'>{tx.date()}</div>
            </div>
          </div>
        </div>
        {this.props.showSignatures
          ? (
            <div styleName='bodyTableCell tableCellSignatures'>
              {op.completed()} of {op.remained() + op.completed()}
            </div>
          )
          : null
        }
        <div styleName='bodyTableCell'>
          <div styleName='tableCellActions'>
            {href && (
              <div styleName='tableCellActionsItem'>
                <Button label='View' href={href} target='_blank' />
              </div>
            )}
            {!op.isDone() && (
              <div styleName='tableCellActionsItem'>
                {op.isConfirmed()
                  ? (<Button label='Revoke' onClick={() => this.props.handleRevoke(op)} />)
                  : (<Button label='Confirm' onClick={() => this.props.handleConfirm(op)} />)
                }
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const list = this.props.list.valueSeq().sortBy((o) => o.tx().time()).reverse().toArray()
    const blockExplorerUrl = (txHash) => getBlockExplorerUrl(this.props.selectedNetworkId, this.props.selectedProviderId, txHash, BLOCKCHAIN_ETHEREUM)

    return (
      <div styleName='panel'>
        <div styleName='panelHead'>
          <h3 styleName='headTitle'>{this.props.title}</h3>
          {this.props.showSignatures
            ? (
              <div styleName='headActions'>
                <Button
                  flat
                  label={<Translate value={prefix('settings')} />}
                  primary
                  onClick={this.props.handleSettings}
                />
              </div>
            )
            : null
          }
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
                  <div styleName='headTableCell'><Translate value={prefix('description')} /></div>
                  {this.props.showSignatures
                    ? (<div styleName='headTableCell'><Translate value={prefix('signatures')} /></div>)
                    : null
                  }
                  <div styleName='headTableCell'><Translate value={prefix('actions')} /></div>
                </div>
              </div>
              <div styleName='tableBody'>
                {list.filter(this.props.filterOperations).map((item, index) => this.renderRow(item, index, blockExplorerUrl(item.id())))}
              </div>
            </div>
          )
        }
        {!this.props.completedFetching && !this.props.completedEndOfList
          ? (
            <div styleName='panelMore'>
              <Button
                label={<Translate value='nav.loadMore' />}
                onClick={this.props.handleLoadMore}
              />
            </div>
          )
          : null
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  const operations = state.get('operations')
  const network = state.get(DUCK_NETWORK)
  return {
    list: operations.list,
    isFetched: operations.isFetched,
    isFetching: operations.isFetching && !operations.isFetched,
    completedFetching: operations.isFetching,
    completedEndOfList: operations.completedEndOfList,
    required: operations.required,
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId,
    locale: state.get('i18n').locale,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listOperations()),
    handleConfirm: (operation) => dispatch(confirmOperation(operation)),
    handleRevoke: (operation) => dispatch(revokeOperation(operation)),
    handleLoadMore: () => dispatch(loadMoreCompletedOperations()),
    handleSettings: async () => {
      await dispatch(setupOperationsSettings())
      dispatch(modalsOpen({
        component: OperationsSettingsDialog,
      }))
    },
  }
}
