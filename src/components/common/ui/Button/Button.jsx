import classnames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

export default class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onTouchTap: PropTypes.func,
    buttonType: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
      PropTypes.number,
    ]),
    onClick: PropTypes.func,
    styleName: PropTypes.string,
    type: PropTypes.string,
  }

  static defaultProps = {
    buttonType: 'raised',
    type: 'button',
    disabled: false,
  }

  componentDidMount () {
    const callback = function (e) {
      const rec = this.getBoundingClientRect()
      let X = e.pageX - rec.x
      let Y = e.pageY - rec.y
      let rippleDiv = document.createElement("div")
      rippleDiv.classList.add('ripple')
      rippleDiv.setAttribute("style", "top:" + Y + "px; left:" + X + "px;")
      this.appendChild(rippleDiv)
      setTimeout(function () {
        rippleDiv.parentElement.removeChild(rippleDiv)
      }, 900)
    }
    this.button.addEventListener('mousedown', callback)
  }

  handleTouchTap = (e) => {
    if (this.props.disabled) {
      return
    }
    if (typeof this.props.onTouchTap === 'function') {
      return this.props.onTouchTap(e)
    }
    if (typeof this.props.onClick === 'function') {
      return this.props.onClick(e)
    }
  }

  setRef = (el) => {
    this.button = el
  }

  render () {
    return (
      <div styleName={classnames('root', this.props.styleName)} className='Button_root'>
        <button
          ref={this.setRef}
          disabled={this.props.disabled}
          styleName={classnames('button', this.props.buttonType)}
          type={this.props.type}
          onTouchTap={this.handleTouchTap}
        >
          {this.props.children
            ? this.props.children
            : <span>{this.props.label}</span>

          }
        </button>
      </div>
    )
  }
}

