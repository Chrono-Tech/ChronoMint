import { Paper, CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { SendTokens, DepositTokens, Rewards, Voting } from 'components'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'

import styles from '../styles'

import './ContentPartial.scss'

function prefix(token) {
  return `layouts.partials.ContentPartial.${token}`
}

@connect(mapStateToProps)
export default class ContentPartial extends React.Component {
  static propTypes = {
    ready: PropTypes.bool,
  }

  render() {
    return (
      <div styleName='root'>
        <div styleName='inner'>
          <div className='grid'>
            <div className='row'>
              <div className='col-md-3 col-lg-2' styleName='headLight'>
                <Paper style={styles.content.paper.style}>
                  {this.props.ready
                    ? (<SendTokens title={<Translate value={prefix('sendTokens')} />} />)
                    : (<CircularProgress size={24} thickness={1.5} />)
                  }
                </Paper>
              </div>
              <div className='col-md-3 col-lg-2' styleName='headDark'>
                <Paper style={styles.content.paper.style}>
                  <DepositTokens title={<Translate value={prefix('depositTime')} />} />
                </Paper>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={3} progress={70} />
                </Paper>
              </div>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={2} progress={100} />
                </Paper>
              </div>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={1} progress={30} />
                </Paper>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Voting />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const wallet = state.get('wallet')
  return {
    ready: !wallet.tokensFetching,
  }
}
