/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { colorFromString } from './utils'

function stateFromProps (props) {
  const token = props.token.toUpperCase()
  return {
    color: token ? colorFromString(token, 1.25) : 'transparent',
    borderColor: colorFromString(token, 0.75),
    textColor: colorFromString(token, 3),
    borderWidth: 9,
  }
}

const devicePixelRatio = (window && window.devicePixelRatio) || 1

class TokenIcon extends PureComponent {
  static propTypes = {
    token: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    token: '',
  }

  constructor (props, context, updater) {
    super(props, context, updater)

    this.canvas = null
    this.state = stateFromProps(props)
  }

  componentDidMount () {
    this.render = this.renderScaled
    this.setState(state => ({ // eslint-disable-line
      width: this.canvas.clientWidth * devicePixelRatio,
      height: this.canvas.clientHeight * devicePixelRatio,
      style: {
        width: this.canvas.clientWidth,
        height: this.canvas.clientHeight,
      },
    }), this.createCanvasIcon)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(stateFromProps(nextProps))
  }

  componentDidUpdate () {
    this.createCanvasIcon()
  }

  componentWillUnmount () {
    this.canvas = null
  }

  createCanvasIcon () {
    const { canvas } = this
    const {
      color,
      borderColor,
      borderWidth,
    } = this.state
    const context = canvas.getContext('2d')

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const canvasCssWidth = canvasWidth
    const canvasCssHeight = canvasHeight
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const radius = centerX * 0.92

    context.fillStyle = color
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    context.lineWidth = borderWidth
    context.strokeStyle = borderColor
    context.stroke()
    context.font = `${centerX * 0.5}px Arial`
    context.textAlign = 'center'
    context.fillStyle = '#FFF'
    context.fillText(this.props.token.toUpperCase(), canvasCssWidth / 2, canvasCssHeight / 1.67)
  }

  refCanvas = (element) => {
    this.canvas = element
  }

  renderScaled () {
    const {
      className,
    } = this.props

    return (
      <canvas
        ref={this.refCanvas}
        width={this.state.width}
        height={this.state.height}
        style={this.state.style}
        className={className}
      />
    )
  }

  render () {
    const {
      className,
    } = this.props

    return (
      <canvas
        ref={this.refCanvas}
        className={className}
      />
    )
  }
}

export default TokenIcon
