/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import spinner from 'assets/img/spinningwheel-1.gif'

import './PersistLoader.scss'

export default class PersistLoader extends React.Component {

  render () {
    return (
      <div styleName='loadingMessage'>
        <img src={spinner} width='24' height='24' alt='' />
      </div>
    )
  }

}
