import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { getEtherscanUrl } from 'Login/network/settings'

import { CircularProgress, RaisedButton, FontIcon, FlatButton } from 'material-ui'
import OperationsSettingsDialog from 'components/dialogs/OperationsSettingsDialog'

import { modalsOpen } from 'redux/modals/actions'
import { listOperations, confirmOperation, revokeOperation, setupOperationsSettings, loadMoreCompletedOperations } from 'redux/operations/actions'

import './Operations.scss'

function prefix (token) {
  return 'components.operations.Operations.' + token
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingOperations extends Component {

  static propTypes = {
    //title: PropTypes.string,
    title: PropTypes.object, // Translate object
    filterOperations: PropTypes.func,
    showSignatures: PropTypes.bool,

    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    getList: PropTypes.func,
    openSettings: PropTypes.func,
    handleRevoke: PropTypes.func,
    handleConfirm: PropTypes.func,
    handleLoadMore: PropTypes.func,
    list: PropTypes.object,
    selectedNetworkId: PropTypes.number,
    selectedProviderId: PropTypes.number,

    completedFetching: PropTypes.bool,
    completedEndOfList: PropTypes.bool,
    locale: PropTypes.string
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
        <div styleName='panelHead'>
          <h3 styleName='headTitle'>{this.props.title}</h3>
          {this.props.showSignatures
            ? (
              <div styleName='headActions'>
                <FlatButton
                  icon={<FontIcon className='material-icons'>settings</FontIcon>}
                  label={<Translate value={prefix('settings')} />}
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
                {list.filter(this.props.filterOperations).map((item, index) => this.renderRow(item, index, etherscanHref(item.id())))}
              </div>
            </div>
          )
        }
        {!this.props.completedFetching && !this.props.completedEndOfList
          ? (
            <div styleName='panelMore'>
              <RaisedButton
                label={<Translate value='nav.loadMore' />}
                onTouchTap={() => this.props.handleLoadMore()} fullWidth primary/>
            </div>
          )
          : null
        }
      </div>
    )
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
              {/*<div styleName='info-description'>Winterfell Gas Station</div>*/}
              {hash
                ? (<div styleName='infoAddress'>{hash}</div>)
                : null
              }
              {details && details.map((item, index) => (
                <div key={index} styleName='infoProp'>
                  <span styleName='propName'>{item.label}:</span>&nbsp;
                  <span styleName='propValue'>{item.value}</span>
                </div>
              ))}
              {this.props.showSignatures
                ? (
                  <div styleName='infoProp infoPropSignatures'>
                    <span styleName='propName'>Signatures:</span>
                    <span styleName='propValue'>{op.remained()} of {op.remained() + op.completed()}</span>
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
              {op.remained()} of {op.remained() + op.completed()}
            </div>
          )
          : null
        }
        <div styleName='bodyTableCell'>
          <div styleName='tableCellActions'>
            {href && (
              <div styleName='tableCellActionsItem'>
                <RaisedButton label='View' href={href} />
              </div>
            )}
            {!op.isDone() && (
              <div styleName='tableCellActionsItem'>
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
    selectedProviderId: network.selectedProviderId,
    locale: state.get('i18n').locale
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listOperations()),
    handleConfirm: (operation) => dispatch(confirmOperation(operation)),
    handleRevoke: (operation) => dispatch(revokeOperation(operation)),
    handleLoadMore: () => dispatch(loadMoreCompletedOperations()),
    openSettings: async () => {
      await dispatch(setupOperationsSettings())
      dispatch(modalsOpen({
        component: OperationsSettingsDialog
      }))
    }
  }
}
