/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import IPFS from '@chronobank/core/utils/IPFS'

import './IPFSImage.scss'

export default class IPFSImage extends PureComponent {
  static propTypes = {
    multihash: PropTypes.string,
    fallback: PropTypes.string,
    fallbackComponent: PropTypes.node,
    className: PropTypes.string,
    icon: PropTypes.object,
    timeout: PropTypes.number,
  }

  static defaultProps = {
    timeout: 3000,
  }

  constructor (props) {
    super(props)
    this.state = {
      imageURL: null,
    }
  }

  componentDidMount () {
    this.loadImage(this.props.multihash)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.multihash !== this.props.multihash) {
      this.loadImage(newProps.multihash)
    }
  }

  async loadImage (multihash) {
    try {
      const image = multihash && await IPFS.get(multihash)
      if (image && image.links && image.links.length) {
        const data = await IPFS.get(image.links[0].hash, this.props.timeout)
        this.setState({
          imageURL: data.content,
        })
      } else if (image && image.content) {
        this.setState({
          imageURL: image.content,
        })
      } else {
        this.setState({
          imageURL: null,
        })
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', multihash)
    }
  }

  renderIcon (imageURL) {
    return (
      <div
        styleName='root'
        className={this.props.className}
        style={{ backgroundImage: `url("${imageURL}")` }}
      >
        {!imageURL && this.props.icon}
      </div>
    )
  }

  renderFallback () {
    return React.cloneElement(this.props.fallbackComponent, {
      className: this.props.className,
    })
  }

  render () {
    const {
      icon,
      multihash,
      fallback,
      fallbackComponent,
    } = this.props
    const imageURL = this.state.imageURL || fallback

    if (!fallbackComponent) {
      return this.renderIcon(imageURL)
    }

    if (!icon && !multihash) {
      return this.renderFallback()
    }

    if (!icon && !multihash && !fallback) {
      return <span>No icon</span>
    }

    return null
  }
}
