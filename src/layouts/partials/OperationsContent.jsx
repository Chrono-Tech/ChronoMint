import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper, CircularProgress, RaisedButton, IconButton, FontIcon } from 'material-ui'

import styles from 'layouts/partials/styles'

import './OperationsContent.scss'

export class WalletContent extends Component {

  static propTypes = {
    isReady: PropTypes.bool
  }

  render () {
    return !this.props.isReady ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>) : (
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
                    {[0,1,2,3,4,5,6,7,8,9].map((row, index) => this.renderRow(row, index))}
                  </div>
                </div>
              </div>
            </Paper>
          </div>
          <div styleName='column'>
            <Paper style={styles.content.paper.style}>

            </Paper>
          </div>
        </div>
      </div>
    )
  }

  renderRow (row, index) {
    return (
      <div styleName='table-row' key={index}>
        <div styleName='table-cell'>
          <div styleName='entry'>
            <div styleName='entry-icon'>
            </div>
            <div styleName='entry-info'>
              <div styleName='info-title'>Add New LOC:</div>
              <div styleName='info-description'>Winterfell Gas Station</div>
              <div styleName='info-prop'>
                <div styleName='prop-name'>On Behalf Of:</div>
                <div styleName='prop-value'>Fat Dog</div>
              </div>
              <div styleName='info-date'>Winterfell Gas Station</div>
            </div>
          </div>
        </div>
        <div styleName='table-cell'>
          2 of 4
        </div>
        <div styleName='table-cell'>
          <RaisedButton label='View' onTouchTap={() => this.handleView} />
          <RaisedButton label='Sign' primary onTouchTap={() => this.handleSign} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  // const operations = state.get('operations')
  return {
    isReady: true//operations.isFetched
  }
}

function mapDispatchToProps () {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
