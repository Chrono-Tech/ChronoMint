import React from 'react'

import { RaisedButton, FloatingActionButton, FontIcon } from 'material-ui'

import SplitSection from './SplitSection'

import './Voting.scss'

class Voting extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <SplitSection title="Voting"
          head={(
            <div styleName="title">
              <h3>Voting ongoing</h3>
            </div>
          )}
          foot={(
            <div styleName="buttons">
              <RaisedButton label="All Polls" primary />
            </div>
          )}
          right={(
            <FloatingActionButton>
              <FontIcon className="material-icons">chevron_right</FontIcon>
            </FloatingActionButton>
          )}
        >
          <div styleName="content">
          </div>
        </SplitSection>
      </div>
    )
  }
}

export default Voting
