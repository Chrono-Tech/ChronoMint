/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Popover } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { DUCK_I18N } from 'redux/i18n/constants'
import Button from 'components/common/ui/Button/Button'
import { changeMomentLocale } from 'redux/ui/actions'
import classnames from 'classnames'

import styles from './LocaleDropDown.scss'

function mapStateToProps (state) {
  const { locale, translations } = state.get(DUCK_I18N)
  return {
    locale,
    translations,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onChangeLocale: (locale) => {
      dispatch(changeMomentLocale(locale))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LocaleDropDown extends PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    onChangeLocale: PropTypes.func,
    translations: PropTypes.object, // FIXME:  specify data type instead of PropTypes.object
    newButtonStyle: PropTypes.bool,
  }

  static defaultProps = {
    newButtonStyle: false,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  handleChangeLocale = (locale) => {
    this.props.onChangeLocale(locale)
    this.handleRequestClose()
  }

  render () {
    const { locale, newButtonStyle, translations } = this.props
    const locales = Object.entries(translations)
      .map(([ name, dictionary ]) => ({
        name,
        title: dictionary.title,
      }))

    return (
      <div styleName='root'>
        <Button
          styleName={newButtonStyle ? 'langButtonNewStyle' : 'langButton'}
          onClick={this.handleClick}
        >
          {locale}
        </Button>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={this.handleRequestClose}
          classes={{
            paper: styles.popover,
          }}
        >
          <ul styleName='LocaleDropDown'>
            {locales.map((item, i) => (
              <li
                key={i}
                styleName={classnames({
                  LocaleDropDownItem: true,
                  LocaleDropDownItemActive: item.name === locale,
                })}
                onClick={() => this.handleChangeLocale(item.name)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </Popover>
      </div>
    )
  }
}
