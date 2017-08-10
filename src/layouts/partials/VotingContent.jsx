import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PollModel from 'models/PollModel'
import { modalsOpen } from 'redux/modals/actions'
import { listPolls } from 'redux/voting/actions'

import { RaisedButton, Paper, CircularProgress } from 'material-ui'
import { Poll, PollDialog } from 'components'
import styles from 'layouts/partials/styles'

import './VotingContent.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class VotingContent extends Component {

  static propTypes = {
    isCBE: PropTypes.bool,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    list: PropTypes.object,

    getList: PropTypes.func,
    handleNewPoll: PropTypes.func
  }

  static defaultProps = {
    // isFetched: true
  }

  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    return !this.props.isFetched
      ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>)
      : (
        <div styleName='root'>
          <div styleName='content'>
            {this.renderHead()}
            {this.renderBody()}
          </div>
        </div>
      )
  }

  renderHead () {
    return (
      <div styleName='head'>
        <h3>Voting</h3>
        <div styleName='inner'>
          <div className='VotingContent__head'>
            <div className='row'>
              <div className='col-sm-1'>
                <div styleName='stats'>
                  <div styleName='stats-item stats-all'>
                    <div styleName='icon'>
                      <i className='material-icons'>poll</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'>All polls:</span><br />
                      <span styleName='entry2'>200</span>
                    </div>
                  </div>
                  <div styleName='stats-item stats-completed'>
                    <div styleName='icon'>
                      <i className='material-icons'>check</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'>Completed polls:</span><br />
                      <span styleName='entry2'>123</span>
                    </div>
                  </div>
                  <div styleName='stats-item stats-outdated'>
                    <div styleName='icon'>
                      <i className='material-icons'>event_busy</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'>Outdated polls:</span><br />
                      <span styleName='entry2'>77</span>
                    </div>
                  </div>
                  <div styleName='stats-item stats-inactive'>
                    <div styleName='icon'>
                      <i className='material-icons'>error_outline</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'>Inactive polls:</span><br />
                      <span styleName='entry2'>12</span>
                    </div>
                  </div>
                  <div styleName='stats-item stats-ongoing'>
                    <div styleName='icon'>
                      <i className='material-icons'>access_time</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'>Polls ongoing:</span><br />
                      <span styleName='entry2'>45</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-1'>
                <div styleName='alignRight'>
                  <div styleName='entries'>
                  </div>
                  <div styleName='actions'>
                    {this.props.isCBE
                      ? (<RaisedButton
                        label='New Poll'
                        styleName='action'
                        onTouchTap={() => this.props.handleNewPoll()}
                      />)
                      : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody () {

    return (
      <div styleName='body'>
        <div styleName='inner'>
          <div className='VotingContent__body'>
            <div className='row'>
              {this.props.list.entrySeq().map(([index, poll]) => (
                <div className='col-sm-6 col-md-3' key={index}>
                  <Paper style={styles.content.paper.style}>
                    <Poll model={poll} />
                  </Paper>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const session = state.get('session')
  const voting = state.get('voting')
  return {
    list: voting.list,
    isCBE: session.isCBE,
    isFetched: voting.isFetched,
    isFetching: voting.isFetching && !voting.isFetched,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    handleNewPoll: () => dispatch(modalsOpen({
      component: PollDialog,
      props: {
        isModify: false,
        initialValues: new PollModel()
      }
    }))
  }
}
