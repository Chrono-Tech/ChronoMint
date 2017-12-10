import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './SlideArrow.scss'

export default class SlideArrow extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    count: PropTypes.number,
    onClick: PropTypes.func,
    direction: PropTypes.string,
  }

  handleClick = () => this.props.onClick(this.props.count)

  render () {
    const direction = this.props.direction === 'left' ? 'arrowLeft' : 'arrowRight'
    return (
      <div styleName={direction} style={{ visibility: this.props.show ? 'visible' : 'hidden' }}>
        <a href='#arrow' styleName='arrowAction' onTouchTap={this.handleClick}>
          <i className='material-icons'>{`keyboard_arrow_${this.props.direction}`}</i>
        </a>
      </div>
    )
  }
}
