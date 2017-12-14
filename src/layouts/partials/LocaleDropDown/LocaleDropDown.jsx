import { DropDownMenu, MenuItem } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import i18n from 'i18n'
import { changeMomentLocale } from 'redux/ui/actions'
import styles from './styles'

import './LocaleDropDown.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class LocaleDropDown extends PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    handleChangeLocale: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render () {
    const locales = Object.entries(i18n).map(([name, dictionary]) => ({
      name,
      title: dictionary.title,
    }))

    return (
      <DropDownMenu
        styleName='LocaleDropDown'
        labelStyle={styles.labelStyle}
        iconStyle={styles.iconStyle}
        underlineStyle={{ border: 0 }}
        value={this.props.locale}
        onChange={(e, i, value) => this.props.handleChangeLocale(value)}
      >
        {locales.map((item) =>
          <MenuItem value={item.name} key={item.name} primaryText={item.title} />)}
      </DropDownMenu>
    )
  }
}

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleChangeLocale: (locale) => {
      changeMomentLocale(locale, dispatch)
    },
  }
}
