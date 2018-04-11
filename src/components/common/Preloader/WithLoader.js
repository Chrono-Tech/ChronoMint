/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Preloader from './Preloader'

const defaultLoader = () => <Preloader />
const defaultCheckLoading = () => false

export const isFetching = (hasFetching) => hasFetching.isFetching()
export const isPending = (hasPending) => hasPending.isPending()

export default class WithLoader extends PureComponent {
  static propTypes = {
    payload: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    loader: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    showLoader: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loader: defaultLoader,
    showLoader: defaultCheckLoading,
    payload: null,
  }

  renderLoader () {
    const { loader } = this.props

    if (typeof loader !== 'function') {
      return loader
    }

    return loader()
  }

  renderContent () {
    const { children, payload, loader, showLoader, ...rest } = this.props

    if (typeof children !== 'function') {
      return 'Children is not a function'
    }

    return children({ payload, ...rest })
  }

  render () {
    const { showLoader, payload } = this.props

    if (typeof showLoader !== 'function') {
      return showLoader ? this.renderLoader() : this.renderContent()
    }

    return showLoader(payload) ? this.renderLoader() : this.renderContent()
  }
}
