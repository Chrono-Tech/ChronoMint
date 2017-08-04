import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper, CircularProgress, RaisedButton, IconButton, FontIcon } from 'material-ui'

import OperationModel from 'models/OperationModel'
import { listOperations, confirmOperation, revokeOperation, openOperationsSettings, loadMoreCompletedOperations } from 'redux/operations/actions'


import styles from 'layouts/partials/styles'
import './OperationsContent.scss'

export class WalletContent extends Component {

  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getList: PropTypes.func,
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    list: PropTypes.object
  }

  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {

    const list = this.props.list.valueSeq().sortBy(o => o.tx().time()).reverse().toArray()

    console.log(list)

    return this.props.isFetching ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>) : (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <div styleName='operations'>
                <div styleName='operations-head'>
                  <h3 styleName='head-title'>Pending Operations</h3>
                  <div styleName='head-actions'>
                    <IconButton>
                      <FontIcon className='material-icons'>filter_list</FontIcon>
                    </IconButton>
                  </div>
                </div>
                <div styleName='operations-table'>
                  <div styleName='table-head'>
                    <div styleName='table-row'>
                      <div styleName='table-cell'>Description</div>
                      <div styleName='table-cell'>Signatures</div>
                      <div styleName='table-cell'>Actions</div>
                    </div>
                  </div>
                  <div styleName='table-body'>
                    {list.filter(o => !o.isDone()).map((item, index) => this.renderRow(item, index))}
                  </div>
                </div>
              </div>
            </Paper>
          </div>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>
              <div styleName='operations'>
                <div styleName='operations-head'>
                  <h3 styleName='head-title'>Completed Operations</h3>
                  <div styleName='head-actions'>
                    <IconButton>
                      <FontIcon className='material-icons'>filter_list</FontIcon>
                    </IconButton>
                  </div>
                </div>
                <div styleName='operations-table'>
                  <div styleName='table-head'>
                    <div styleName='table-row'>
                      <div styleName='table-cell'>Description</div>
                      <div styleName='table-cell'>Signatures</div>
                      <div styleName='table-cell'>Actions</div>
                    </div>
                  </div>
                  <div styleName='table-body'>
                    {list.filter(o => o.isDone()).map((item, index) => this.renderRow(item, index))}
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    )
  }

  renderRow (op, index) {

    const tx = op.tx()
    const hash = tx.hash()
    const details = tx.details()

    return (
      <div styleName='table-row' key={index}>
        <div styleName='table-cell table-cell-description'>
          <div styleName='entry'>
            <div styleName='entry-icon'>
              <i className='material-icons'>person_add</i>
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
              <div styleName='info-prop info-prop-signatures'>
                <span styleName='prop-name'>Signatures:</span>
                <span styleName='prop-value'>{op.remained()} of {op.remained() + op.completed()}</span>
              </div>
              <div styleName='info-date'>{tx.date()}</div>
            </div>
          </div>
        </div>
        <div styleName='table-cell table-cell-signatures'>
          2 of 4
        </div>
        <div styleName='table-cell table-cell-actions'>
          <div styleName='actions'>
            <div styleName='actions-item'>
              <RaisedButton label='View' onTouchTap={() => this.handleView} />
            </div>
            <div styleName='actions-item'>
              <RaisedButton label='Sign' primary onTouchTap={() => this.handleSign} />
            </div>
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
    confirm: (operation: OperationModel) => dispatch(confirmOperation(operation)),
    revoke: (operation: OperationModel) => dispatch(revokeOperation(operation)),
    openSettings: () => dispatch(openOperationsSettings()),
    handleLoadMore: () => dispatch(loadMoreCompletedOperations())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
