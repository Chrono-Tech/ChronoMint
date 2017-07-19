import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLocale, I18n } from 'react-redux-i18n'

import { MuiThemeProvider, DropDownMenu, MenuItem, IconButton, FontIcon } from 'material-ui'
import BrandLogo from './BrandLogo'
import ls from 'utils/LocalStorage'
import i18n from 'i18n'
import menu from 'menu'

import inversedTheme from 'styles/themes/inversed'
import styles from './styles'
import './BrandPartial.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class BrandPartial extends React.Component {

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
      <div styleName='root' className='BrandPartial__root'>
        <div styleName='row'>
          <div styleName='heading'>
            <h1 styleName='title'><BrandLogo styleName='brand'/></h1>
            <div styleName='subtitle'>beta {require('../../../package.json').version}</div>
          </div>
          <ul styleName='items' key={this.props.locale}>
            {menu.global.map(item => (
              <li key={item.key}>
                <a href={item.path} target='_blank' rel='noopener noreferrer'>{I18n.t(item.title)}</a>
              </li>
            ))}
          </ul>
          <MuiThemeProvider muiTheme={inversedTheme}>
            <ul styleName='actions'>
              <li>
                <DropDownMenu styleName='locale' labelStyle={styles.brand.localeDropDown.labelStyle}
                              underlineStyle={{border: 0}} value={this.props.locale}
                              onChange={(e, i, value) => this.props.handleChangeLocale(value)}>
                  {locales.map((item) =>
                    <MenuItem value={item.name} key={item.name} primaryText={item.title}/>
                  )}
                </DropDownMenu>
              </li>
            </ul>
          </MuiThemeProvider>
        </div>
        {this.state.open
          ? (
            <div styleName='row when-open'>
            </div>
          )
          : null
        }
        <div styleName='toggle'>
          <IconButton iconStyle={styles.brand.toggle.iconStyle} onTouchTap={() => this.handleToggle()}>
            <FontIcon className='material-icons'>{this.state.open ? 'arrow_upward' : 'arrow_downward'}</FontIcon>
          </IconButton>
        </div>
        <div styleName='snackbar'>
          <span styleName='snackbar-entry'>
            <span styleName='entry-status'>New</span>
          </span>
          <span styleName='snackbar-entry'>
            <span styleName='entry-datetime'>21:12, April 13, 2017</span>
          </span>
          <span styleName='snackbar-entry'>
            <span styleName='entry-label'>Operation confirmed, signatures:</span>&nbsp;
            <span styleName='entry-value'>1</span>
          </span>
          <span styleName='snackbar-entry'>
            <span styleName='entry-value'>Add CBE</span>
          </span>
          <span styleName='snackbar-entry'>
            <span styleName='entry-label'>Name:</span>&nbsp;
            <span styleName='entry-value'>Orlando</span>
          </span>
          <span styleName='snackbar-entry'>
            <span styleName='entry-value'>0x9831834F6ACA9831834F6ACA9831834F6ACA</span>
          </span>
        </div>
      </div>
    )
  }

  handleToggle () {
    this.setState({
      open: !this.state.open
    })
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
