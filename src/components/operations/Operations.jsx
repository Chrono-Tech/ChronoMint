import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getEtherscanUrl } from 'network/settings'

import { CircularProgress, RaisedButton, FontIcon, FlatButton } from 'material-ui'

import { listOperations, confirmOperation, revokeOperation, openOperationsSettings, loadMoreCompletedOperations } from 'redux/operations/actions'

import './Operations.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingOperations extends Component {

  static propTypes = {
    title: PropTypes.string,
    filterOperations: PropTypes.func,
    showSignatures: PropTypes.bool,

    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getList: PropTypes.func,
    openSettings: PropTypes.func,
    handleRevoke: PropTypes.func,
    handleConfirm: PropTypes.func,
    list: PropTypes.object,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number
  }

  static defaultProps = {
    // eslint-disable-next-line
    filterOperations: (op) => true, // get all operations by default
    showSignatures: false // do not show signatures count by default
  }

  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    const list = this.props.list.valueSeq().sortBy(o => o.tx().time()).reverse().toArray()
    const etherscanHref = (txHash) => getEtherscanUrl(this.props.selectedNetworkId, this.props.selectedProviderId, txHash)

    return (
      <div styleName='panel'>
        <div styleName='panel-head'>
          <h3 styleName='head-title'>{this.props.title}</h3>
          {this.props.showSignatures
            ? (
              <div styleName='head-actions'>
                <FlatButton
                  icon={<FontIcon className='material-icons'>settings</FontIcon>}
                  label='Settings'
                  primary
                  onTouchTap={() => this.props.openSettings()}
                />
              </div>
            )
            : null
          }
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
                  <div styleName='table-cell'>Description</div>
                  {this.props.showSignatures
                    ? (<div styleName='table-cell'>Signatures</div>)
                    : null
                  }
                  <div styleName='table-cell'>Actions</div>
                </div>
              </div>
              <div styleName='table-body'>
                {list.filter(this.props.filterOperations).map((item, index) => this.renderRow(item, index, etherscanHref(item.id())))}
              </div>
            </div>
          )
        }
      </div>
    )
  }

  renderRow (op, index, href) {

    const tx = op.tx()
    const hash = tx.hash()
    const details = tx.details()

    return (
      <div styleName='table-row' key={index}>
        <div styleName='table-cell table-cell-description'>
          <div styleName='entry'>
            <div styleName='entry-icon'>
              <i className='material-icons'>flash_on</i>
            </div>
            <div styleName='entry-info'>
              <div styleName='info-title'>{tx.title()}</div>
              {/*<div styleName='info-description'>Winterfell Gas Station</div>*/}
              {hash
                ? (<div styleName='info-address'>{hash}</div>)
                : null
              }
              {details && details.map((item, index) => (
                <div key={index} styleName='info-prop'>
                  <span styleName='prop-name'>{item.label}:</span>&nbsp;
                  <span styleName='prop-value'>{item.value}</span>
                </div>
              ))}
              {this.props.showSignatures
                ? (
                  <div styleName='info-prop info-prop-signatures'>
                    <span styleName='prop-name'>Signatures:</span>
                    <span styleName='prop-value'>{op.remained()} of {op.remained() + op.completed()}</span>
                  </div>
                )
                : null
              }
              <div styleName='info-date'>{tx.date()}</div>
            </div>
          </div>
        </div>
        {this.props.showSignatures
          ? (
            <div styleName='table-cell table-cell-signatures'>
              {op.remained()} of {op.remained() + op.completed()}
            </div>
          )
          : null
        }
        <div styleName='table-cell table-cell-actions'>
          <div styleName='actions'>
            {href && (
              <div styleName='actions-item'>
                <RaisedButton label='View' href={href} />
              </div>
            )}
            {!op.isDone() && (
              <div styleName='actions-item'>
                {op.isConfirmed()
                  ? (<RaisedButton label='Revoke' primary onTouchTap={() => this.props.handleRevoke(op)} />)
                  : (<RaisedButton label='Confirm' primary onTouchTap={() => this.props.handleConfirm(op)} />)
                }
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const operations = state.get('operations')
  const network = state.get('network')
  return {
    list: operations.list,
    isFetched: operations.isFetched,
    isFetching: operations.isFetching && !operations.isFetched,
    completedFetching: operations.isFetching,
    completedEndOfList: operations.completedEndOfList,
    required: operations.required,
    selectedNetworkId: network.selectedNetworkId,
    selectedProviderId: network.selectedProviderId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listOperations()),
    handleConfirm: (operation) => dispatch(confirmOperation(operation)),
    handleRevoke: (operation) => dispatch(revokeOperation(operation)),
    openSettings: () => dispatch(openOperationsSettings()),
    handleLoadMore: () => dispatch(loadMoreCompletedOperations())
  }
}
