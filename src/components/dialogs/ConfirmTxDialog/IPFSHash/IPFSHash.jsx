/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import React, { PureComponent } from 'react'
import IPFS from '@chronobank/core/utils/IPFS'
import Value from '../../../common/Value/Value'

import './IPFSHash.scss'
import Preloader from '../../../common/Preloader/Preloader'

export default class IPFSHash extends PureComponent {
  static propTypes = {
    multihash: PropTypes.string,
    className: PropTypes.string,
    timeout: PropTypes.number,
    langPath: PropTypes.string,
  }

  static defaultProps = {
    timeout: 3000,
  }

  constructor (props) {
    super(props)
    this.state = {
      data: null,
      loading: true,
    }
  }

  componentDidMount () {
    IPFS.get(this.props.multihash)
      .then((data) => {
        this.setState({
          data,
          loading: false,
        })
      })
      .catch(() => {
        this.setState({
          data: null,
          loading: false,
        })
      })
  }

  render () {
    if (this.state.loading) {
      return <Preloader />
    }
    return (
      <div styleName='root'>
        {this.state.data
          ? Object.entries(this.state.data).map(([key, value]) => (
            <div styleName='param' key={key}>
              <div styleName='label'>
                <Translate value={`${this.props.langPath}.${key}`} />
              </div>
              <div styleName='value'>
                <Value value={value} />
              </div>
            </div>
          ))
          : null}
      </div>
    )
  }
}
