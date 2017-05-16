import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { white, darkWhite } from 'material-ui/styles/colors'
import { Translate } from 'react-redux-i18n'

class SearchBox extends Component {
  componentDidMount () {
    this.refs.search.focus()
  }

  render () {
    const styles = {
      textField: {
        color: white,
        backgroundColor: 'transparent',
        borderRadius: 0
      },
      inputStyle: {
        color: white,
        height: 56,
        fontSize: 20
      },
      hintStyle: {
        height: 20,
        fontSize: 20,
        color: darkWhite
      }
    }

    return (
      <TextField
        ref='search'
        hintText={<Translate value='nav.search' />}
        underlineShow={false}
        fullWidth
        style={styles.textField}
        inputStyle={styles.inputStyle}
        hintStyle={styles.hintStyle}
      />
    )
  }
}

export default SearchBox
