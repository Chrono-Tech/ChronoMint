import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {setLocale} from 'react-redux-i18n'

import {DropDownMenu, MenuItem} from 'material-ui'
import ls from 'utils/LocalStorage'
import i18n from 'i18n'

import styles from './styles'
import './BrandPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class LocaleDropDown extends React.Component {

  static propTypes = {
    locale: PropTypes.string,
    handleChangeLocale: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  render () {

    const locales = Object.entries(i18n).map(([name, dictionary]) => ({
      name,
      title: dictionary.title
    }))

    return (
      <DropDownMenu labelStyle={styles.brand.localeDropDown.labelStyle}
        underlineStyle={{border: 0}} value={this.props.locale}
        onChange={(e, i, value) => this.props.handleChangeLocale(value)}>
        {locales.map((item) =>
          <MenuItem value={item.name} key={item.name} primaryText={item.title}/>
        )}
      </DropDownMenu>
    )
  }

}

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleChangeLocale: (locale) => {
      // TODO @ipavlenko: Do not use LocalStorage directly, use redux store persisted to the LocalStorage instead
      ls.setLocale(locale)
      dispatch(setLocale(locale))
    }
  }
}
