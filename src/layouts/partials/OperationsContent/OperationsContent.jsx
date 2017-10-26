import React, { Component } from 'react'
import { Paper } from 'material-ui'

import { Operations } from 'components'
import { Translate } from 'react-redux-i18n'

import '../SettingsContent/SettingsContent.scss'

function prefix (token) {
  return 'layouts.partials.OperationsContent.' + token
}

export default class SettingsContent extends Component {

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper>
              <Operations title={<Translate value={prefix('pendingOperations')} />} showSignatures={true} filterOperations={(o) => !o.isDone()} />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper>
              <Operations title={<Translate value={prefix('completedOperations')} />} showSignatures={false} filterOperations={(o) => o.isDone()} />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}
