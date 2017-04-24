import React, {Component} from 'react'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import globalStyles from '../../../styles'
import {PollOptions, PollFiles, StatusBlock, Buttons} from './'
import {dateFormatOptions} from '../../../config'

class Polls extends Component {
  render () {
    const {polls} = this.props
    return (
      <div>
        {polls.map((poll, key) => {
          return (
            <Paper key={key} style={{...globalStyles.item.paper, position: 'relative'}}>
              <div>
                <StatusBlock poll={poll} />
                <div style={globalStyles.item.title}>{poll.pollTitle()}</div>
                <div style={globalStyles.item.greyText}>
                  {poll.pollDescription()}
                </div>
                <PollOptions options={poll.options()} />
                <div style={globalStyles.item.lightGrey}>
                  Exp date: {new Date(poll.deadline()).toLocaleDateString('en-us', dateFormatOptions)}<br />
                  Vote limit: {poll.voteLimit()} votes<br />
                </div>
                <PollFiles files={poll.files()} />
              </div>
              <Buttons poll={poll} />
              {
                poll.isTransaction() || poll.isFetching()
                  ? <CircularProgress size={24} thickness={1.5} style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)'}} />
                  : null
              }
            </Paper>
          )
        }
        ).toArray()
        }
      </div>
    )
  }
}

export default Polls
