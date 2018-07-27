/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import ProfileService from '@chronobank/login/network/ProfileService'

import './ProfileImage.scss'

function mapStateToProps (state) {
  const session = state.get(DUCK_SESSION)
  const profileSignature = session.profileSignature

  return {
    token: profileSignature && profileSignature.token,
  }
}

@connect(mapStateToProps, null)
export default class ProfileImage extends PureComponent {
  static propTypes = {
    icon: PropTypes.object,
    token: PropTypes.string,
    imageId: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor (props) {
    super(props)
    this.state = {
      imageURL: null,
    }
  }

  componentDidMount () {
    this.loadImage(this.props.imageId)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.imageId !== this.props.imageId) {
      this.loadImage(newProps.imageId)
    }
  }

  async loadImage (imageId) {
    const { token } = this.props

    if (!imageId){
      this.setState({
        imageURL: null,
      })

      return
    }

    try {
      const data = await ProfileService.avatarDownload(imageId, token)

      this.setState({
        imageURL: data.url,
      })
    } catch (e) {
      // eslint-disable-next-line
      console.log('Failed to load image', imageId)
    }
  }

  renderImage (){
    const { imageURL } = this.state

    return (
      <div
        styleName='icon'
        className={this.props.className}
        style={{ backgroundImage: `url("${imageURL}")` }}
      >
        { !imageURL && this.props.icon }
      </div>)
  }

  render () {
    return (
      <div styleName='wrapper'>
        { this.renderImage() }
      </div>
    )
  }
}
