/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Operations } from 'components'
import { Paper } from 'material-ui'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'

import '../SettingsContent/SettingsContent.scss'

function prefix (token) {
  return `layouts.partials.OperationsContent.${token}`
}

export default class SettingsContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper>
              <Operations
                title={<Translate value={prefix('pendingOperations')} />}
                showSignatures
                filterOperations={(o) => !o.isDone()}
              />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper>
              <Operations
                title={<Translate value={prefix('completedOperations')} />}
                showSignatures={false}
                filterOperations={(o) => o.isDone()}
              />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}

