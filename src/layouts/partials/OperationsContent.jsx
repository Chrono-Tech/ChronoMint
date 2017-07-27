import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper, CircularProgress } from 'material-ui'

import styles from 'layouts/partials/styles'

import './OperationsContent.scss'

export class WalletContent extends Component {

  static propTypes = {
    isReady: PropTypes.bool
  }

  constructor (props) {
    super(props)
  }

  render () {
    return !this.props.isReady ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>) : (
      <div styleName='root'>
        <div styleName='content'>
          <div>
            <div className='WalletContent__grid'>
              <div className='row'>
                <div className='col-md-6'>
                  <Paper style={styles.content.paper.style}>
                    <div styleName='root'>

                    </div>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const operations = state.get('operations')
  return {
    isReady: operations.isFetched
  }
}

function mapDispatchToProps () {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletContent)
