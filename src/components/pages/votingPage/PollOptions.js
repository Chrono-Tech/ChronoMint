// TODO new voting
/* eslint-disable */
import React, {Component} from 'react'
import globalStyles from '../../../styles'

class PollOptions extends Component {
  render () {
    const {options} = this.props
    return (
      <div style={globalStyles.item.lightGrey}>
        {options.map(option => {
          return (<div key={option.index()}>
            {option.description()}: {option.votes() / 100000000} votes
          </div>)
        })}
      </div>
    )
  }
}

export default PollOptions
