import { IconButton, Menu, MenuItem, Popover } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import i18n from 'i18n'
import { changeMomentLocale } from 'redux/ui/actions'

import './LocaleDropDown.scss'

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale,
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
    const locales = Object.entries(i18n).map(([ name, dictionary ]) => ({
      name,
      title: dictionary.title,
    }))

    return (
      <div styleName='root'>
        <IconButton
          style={{ padding: 5 }}
          iconClassName='localeDropDawnIcon'
          styleName='langButton'
          onClick={this.handleClick}
        >
          {this.props.locale}
        </IconButton>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu styleName='LocaleDropDown'>
            {locales.map((item) => (
              <MenuItem
                onTouchTap={() => this.handleChangeLocale(item.name)}
                value={item.name}
                key={item.name}
                primaryText={item.title}
              />
            ))}
          </Menu>
        </Popover>
      </div>
    )
  }
}
