import React from 'react'
import PropTypes from 'prop-types'

import IPFS from 'utils/IPFS'

import './IPFSImage.scss'

export default class IPFSImage extends React.Component {

  static propTypes = {
    multihash: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.object,
    timeout: PropTypes.number
  }

  static defaultProps = {
    timeout: 3000
  }

  constructor (props) {
    super(props)
    this.state = {
      imageURL: null
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
          imageURL: data.content
        })
      } else if (image && image.content) {
        this.setState({
          imageURL: image.content
        })
      } else {
        this.setState({
          imageURL: null
        })
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', multihash)
    }
  }

  render () {
    const {icon} = this.props
    const imageURL = this.state.imageURL || this.props.fallback

    return (
      <div
        styleName='root'
        className={this.props.className}
        style={{backgroundImage: `url("${imageURL}")`}}
      >{!imageURL && icon}</div>
    )
  }
}
