import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { MuiThemeProvider, IconButton, FontIcon } from 'material-ui'
import BrandLogo from './BrandLogo'
import menu from 'menu'
import LocaleDropDown from 'layouts/partials/LocaleDropDown'

import inversedTheme from 'styles/themes/inversed'
import styles from './styles'
import './BrandPartial.scss'

@connect(mapStateToProps, {})
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

    return (
      <div styleName='root' className='BrandPartial__root'>
        <div styleName='row'>
          <div styleName='heading'>
            <h1 styleName='title'><BrandLogo styleName='brand'/></h1>
            <div styleName='subtitle'>{require('../../../package.json').version}</div>
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
                <LocaleDropDown />
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

