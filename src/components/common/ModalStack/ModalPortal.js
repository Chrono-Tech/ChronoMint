/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { PureComponent } from 'react'
import ReactDOM from 'react-dom'

export default class ModalPortal extends PureComponent {
  constructor (props) {
    super(props)
    this.element = document.createElement('div')
  }

  componentDidMount () {
    document.body.appendChild(this.element)
  }

  componentWillUnmount () {
    document.body.removeChild(this.element)
  }

  render () {
    return ReactDOM.createPortal(this.props.children, this.element)
  }
}
