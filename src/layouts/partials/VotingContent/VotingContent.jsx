import { Poll, PollEditDialog } from 'components'
import Preloader from 'components/common/Preloader/Preloader'
import { RaisedButton } from 'material-ui'
import Amount from 'models/Amount'
import PollModel from 'models/PollModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router'
import { DUCK_ASSETS_HOLDER, initAssetsHolder } from 'redux/assetsHolder/actions'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { DUCK_VOTING, listPolls } from 'redux/voting/actions'
import { getStatistics } from 'redux/voting/getters'

import './VotingContent.scss'
import VotingCollection from '../../../models/voting/VotingCollection'

function prefix (token) {
  return `layouts.partials.VotingContent.${token}`
}

function mapStateToProps (state) {
  const voting = state.get(DUCK_VOTING)
  const tokens = state.get(DUCK_TOKENS)

  const timeToken = tokens.item('TIME')

  return {
    list: voting.list(),
    tokens,
    deposit: state.get(DUCK_ASSETS_HOLDER).assets().item(timeToken.address()).deposit(),
    statistics: getStatistics(voting),
    isCBE: state.get(DUCK_SESSION).isCBE,
    isFetched: voting.isFetched(),
    isFetching: voting.isFetching() && !voting.isFetched(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    handleNewPoll: async () => dispatch(modalsOpen({
      component: PollEditDialog,
      props: {
        isModify: false,
        initialValues: new PollModel(),
      },
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class VotingContent extends Component {
  static propTypes = {
    isCBE: PropTypes.bool,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    list: PropTypes.object,
    timeDeposit: PropTypes.object,
    statistics: PropTypes.object,
    initAssetsHolder: PropTypes.func,
    getList: PropTypes.func,
    handleNewPoll: PropTypes.func,
    deposit: PropTypes.instanceOf(Amount),
  }

  componentWillMount () {
    this.props.initAssetsHolder()

    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  renderHead () {
    const { statistics, isFetching } = this.props

    return (
      <div styleName='head'>
        <h3><Translate value={prefix('voting')} /></h3>
        <div styleName='headInner'>
          <div className='VotingContent__head'>
            <div className='row'>
              <div className='col-sm-1'>
                <div styleName='contentStats'>
                  <div styleName='contentStatsItem statsAll'>
                    <div styleName='icon'>
                      <i className='material-icons'>poll</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entryTitle'><Translate value={prefix('allPolls')} />:</span><br />
                      <span styleName='entryValue'>{isFetching ? <Preloader /> : statistics.all}</span>
                    </div>
                  </div>
                </div>
                <div styleName='contentStats'>
                  <div styleName='contentStatsItem statsCompleted'>
                    <div styleName='icon'>
                      <i className='material-icons'>check</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entryTitle'><Translate value={prefix('completedPolls')} />:</span><br />
                      <span styleName='entryValue'>{isFetching ? <Preloader /> : statistics.completed}</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <i className='material-icons'>event_busy</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entryTitle'><Translate value={prefix('outdatedPolls')} />:</span><br />
                      <span styleName='entryValue'>{isFetching ? <Preloader /> : statistics.outdated}</span>
                    </div>
                  </div>
                </div>
                <div styleName='contentStats'>
                  <div styleName='contentStatsItem statsInactive'>
                    <div styleName='icon'>
                      <i className='material-icons'>error_outline</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entryTitle'><Translate value={prefix('inactivePolls')} />:</span><br />
                      <span styleName='entryValue'>{isFetching ? <Preloader /> : statistics.inactive}</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOngoing'>
                    <div styleName='icon'>
                      <i className='material-icons'>access_time</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entryTitle'><Translate value={prefix('pollsOngoing')} />:</span><br />
                      <span styleName='entryValue'>{isFetching ? <Preloader /> : statistics.ongoing}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-1'>
                <div styleName='contentAlignRight'>
                  <div styleName='entries' />
                  <div>
                    <RaisedButton
                      disabled={this.props.deposit.isZero()}
                      label={<Translate value={prefix('newPoll')} />}
                      styleName='action'
                      onClick={this.props.handleNewPoll}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody (polls) {
    return (
      <div styleName='body'>
        <div styleName='bodyInner'>
          <div className='VotingContent__body'>
            <div className='row'>
              {polls.items().map((poll) => (
                <div className='col-sm-6 col-md-3' key={poll.id()}>
                  <Poll
                    model={poll}
                    deposit={this.props.deposit}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const polls = this.props.isFetched
      ? this.props.list.reverse()
      : new VotingCollection()

    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.renderHead(polls)}
          {this.props.isFetched && this.props.deposit.isZero() &&
          (
            <div styleName='accessDenied'>
              <i className='material-icons' styleName='accessDeniedIcon'>warning</i>Deposit TIME on <Link
              to='/wallet'>Wallet page</Link> if you want get access this page.
            </div>
          )}
          {this.props.isFetched && this.renderBody(polls)}
        </div>
      </div>
    )
  }
}
