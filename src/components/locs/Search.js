/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

// TODO MINT-266 New LOC
/* eslint-disable */
import React, { PureComponent } from 'react'
import TextField from 'material-ui/TextField'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { updateLOCFilter } from '@chronobank/core/redux/locs/actions'

const mapStateToProps = (state) => ({
  filter: state.get('locs').filter
})

const mapDispatchToProps = (dispatch) => ({
  updateLOCFilter: (value) => dispatch(updateLOCFilter(value))
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Search extends PureComponent {
  handleChange = (event, value) => {
    this.props.updateLOCFilter(value.toLowerCase())
  }

  render () {
    return (
      <TextField
        onChange={this.handleChange}
        floatingLabelText={<Translate value='terms.search' />}
        fullWidth
        value={this.props.filter}
      />
    )
  }
}
