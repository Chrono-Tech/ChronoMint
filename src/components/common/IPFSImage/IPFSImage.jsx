import React from 'react'
import PropTypes from 'prop-types'

import IPFS from 'utils/IPFS'

import './IPFSImage.scss'

export default class IPFSImage extends React.Component {

  static propTypes = {
    multihash: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      image: null,
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
      if (image) {
        this.setState({
          image: image.data
        })
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', multihash)
    }
  }

  render () {
    return (
      <div styleName='root' className={this.props.className}
           style={{backgroundImage: `url("${this.state.image || this.props.fallback}")`}}
      ></div>
    )
  }
}
