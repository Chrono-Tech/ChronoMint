import React, { Component } from 'react'
import { FlatButton } from 'material-ui'

class Options extends Component {
  render () {
    const {options, pollKey, onVote} = this.props
    return (
      <div>
        {options.map((option, index) =>
          <div key={index}>
            <br />
            <FlatButton
              label={option.description()}
              onTouchTap={() => onVote(pollKey, option.index())}
              disabled={this.props.disabled}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Options
