import React, { Component } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../../styles'
import { showNewPollModal } from '../../../redux/ui/modal'

const mapDispatchToProps = (dispatch) => ({
  showNewPollModal: () => dispatch(showNewPollModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  handleShowNewPollModal = () => {
    this.props.showNewPollModal()
  }

  render () {
    return (
      <div style={globalStyles.title2Wrapper}>
        <h3 style={globalStyles.title2}>Voting</h3>
        <RaisedButton
          label='NEW POLL'
          primary
          style={{verticalAlign: 'text-bottom', fontSize: 15}}
          onTouchTap={this.handleShowNewPollModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
