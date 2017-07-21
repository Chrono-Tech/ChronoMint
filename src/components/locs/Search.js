// TODO MINT-266 New LOC
/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import { updateLOCFilter } from '../../redux/locs/actions'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  filter: state.get('locs').filter
})

const mapDispatchToProps = (dispatch) => ({
  updateLOCFilter: (value) => dispatch(updateLOCFilter(value))
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Search extends Component {
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
