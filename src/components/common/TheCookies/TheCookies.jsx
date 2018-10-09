/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { Link } from 'react-router'
import { setCookiesBarVisible, initCookiesBar } from 'redux/ui/thunks'
import { getCookiesBarVisible } from 'redux/ui/selectors'
import { prefix } from './lang'
import './TheCookies.scss'
import Button from '../ui/Button/Button'

@connect(mapStateToProps, mapDispatchToProps)
export default class TheCookies extends React.Component {

  static propTypes = {
    isCookiesBarVisible: PropTypes.bool,
    closeCookiesBar: PropTypes.func,
    initCookiesBar: PropTypes.func,
  }

  componentDidMount () {
    this.props.initCookiesBar()
  }

  handleCloseBar = (e) => {
    e.stopPropagation()
    this.props.closeCookiesBar()
  }

  render () {
    const { isCookiesBarVisible } = this.props
    return (
      <section styleName={classnames('root', isCookiesBarVisible ? 'the-cookies-visible' : 'the-cookies-hidden')}>
        <div styleName='the-cookies'>
          <div styleName='info'>
            <span><Translate value={`${prefix}.cookiesWeUse`} />&nbsp;</span>
            <Link route='cookies-policies' target='_blank' to='https://chronobank.io/cookies-policies'><span styleName='link'><Translate value={`${prefix}.cookiesPolicies`} /></span></Link>
            <span>&nbsp;<Translate value={`${prefix}.cookiesLearnMore`} /></span>
          </div>
          <div styleName='action'>
            <Button onClick={this.handleCloseBar}><Translate value={`${prefix}.accept`} /></Button>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps (state) {
  return {
    isCookiesBarVisible: getCookiesBarVisible(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    closeCookiesBar: () => {
      dispatch(setCookiesBarVisible(false))
    },
    initCookiesBar: () => {
      dispatch(initCookiesBar())
    },
  }
}
