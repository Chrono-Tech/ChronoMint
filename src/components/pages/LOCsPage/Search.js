import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import globalStyles from '../../../styles'

class Search extends Component {
  render () {
    return (
      <div style={{display: 'none'}}>
        <TextField
          floatingLabelText='Search by title'
          style={{width: 'calc(100% - 98px)'}}
        />
        <RaisedButton
          label='SEARCH'
          primary
          buttonStyle={globalStyles.raisedButton}
          style={{marginTop: 33, width: 88, float: 'right'}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default Search
