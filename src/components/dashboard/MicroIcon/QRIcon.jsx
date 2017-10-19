import { Popover } from 'material-ui'
import PropTypes from 'prop-types'
import QRCode from 'qrcode'
import React from 'react'
import promisify from 'promisify-node-callback'

import './MicroIcon.scss'

export default class QRIcon extends React.Component {
  static propTypes = {
    value: PropTypes.node,
  }

  constructor (props) {
    super(props)
    this.state = {
      isQROpen: false,
      qrData: null,
      qrAnchorEl: null,
    }
  }

  render () {
    return (
      <div styleName='root'>
        <a
          styleName='micro'
          onTouchTap={e => { e.preventDefault(); this.handleQROpen(e.currentTarget) }}
        >
          <i className='material-icons'>center_focus_weak</i>
        </a>
        <Popover
          zDepth={3}
          open={this.state.isQROpen}
          anchorEl={this.state.qrAnchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={() => this.handleQRClose()}
        >
          {this.renderQR()}
        </Popover>
      </div>
    )
  }

  renderQR () {
    return (
      <img src={this.state.qrData} />
    )
  }

  async handleQROpen (target) {
    this.setState({
      isQROpen: true,
      qrData: this.state.qrData || await promisify(QRCode.toDataURL)(this.props.value),
      qrAnchorEl: target,
    })
  }

  handleQRClose () {
    this.setState({
      isQROpen: false,
      qrAnchorEl: null,
    })
  }
}
