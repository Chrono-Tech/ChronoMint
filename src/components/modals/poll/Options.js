import React, {Component} from 'react'
import {FlatButton} from 'material-ui'
import globalStyles from '../../../styles'

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
              style={globalStyles.flatButton}
              labelStyle={globalStyles.flatButtonLabel}
              onTouchTap={() => onVote(pollKey, option.index())}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Options
