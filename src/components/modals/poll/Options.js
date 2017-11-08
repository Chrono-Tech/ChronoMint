import { FlatButton } from 'material-ui'
// TODO new voting
/* eslint-disable */
import React, { PureComponent } from 'react'

class Options extends PureComponent {
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
