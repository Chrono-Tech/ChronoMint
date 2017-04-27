import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropDownMenu, MenuItem } from 'material-ui'
import { setLocale } from 'react-redux-i18n'
import LS from '../../../dao/LocalStorageDAO'

const mapStateToProps = (state) => ({
  locale: state.get('i18n').locale
})

const mapDispatchToProps = (dispatch) => ({
  change: (locale) => {
    LS.setLocale(locale)
    dispatch(setLocale(locale))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
class Locales extends Component {
  handleChange = (event, index, value) => {
    this.props.change(value)
  }

  render () {
    const list = Object.keys(require('../../../i18n/'))
    return (
      <DropDownMenu labelStyle={{color: 'white', height: 'auto', lineHeight: '36px', top: '5px'}} underlineStyle={{border: 0}} value={this.props.locale} onChange={this.handleChange}>
        {list.map(item =>
          <MenuItem value={item} key={item} primaryText={item} />
        )}
      </DropDownMenu>
    )
  }
}

export default Locales
