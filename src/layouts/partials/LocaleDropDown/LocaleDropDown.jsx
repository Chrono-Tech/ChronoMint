import { DropDownMenu, MenuItem } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { changeMomentLocale } from 'redux/ui/actions'
import styles from './styles'

import './LocaleDropDown.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class LocaleDropDown extends PureComponent {
  static propTypes = {
    locale: PropTypes.string,
    translations: PropTypes.object,
    handleChangeLocale: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render () {

    console.log('translations: ', this.props.translations)

    const locales = Object.entries(this.props.translations).map(([name, dictionary]) => ({
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
    translations: state.get('i18n').translations,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleChangeLocale: (locale) => {
      changeMomentLocale(locale, dispatch)
    },
  }
}
