import React, {Component} from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import globalStyles from '../../../styles'
import {handleShowLOCModal} from '../../../redux/locs/locModalActions'
import {showSendToExchangeModal} from '../../../redux/ui/modal'

const mapDispatchToProps = (dispatch) => ({
  handleShowLOCModal: () => dispatch(handleShowLOCModal(null)),
  handleShowSendToExchangeModal: () => dispatch(showSendToExchangeModal())
})

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
  render () {
    return (
      <div>
        <span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
          label='NEW LOC'
          primary
          style={{verticalAlign: 'text-bottom', fontSize: 15}}
          onTouchTap={this.props.handleShowLOCModal}
          buttonStyle={{...globalStyles.raisedButton}}
          labelStyle={globalStyles.raisedButtonLabel}
        />
        <RaisedButton
          label='SEND TO EXCHANGE'
          primary
          style={{fontSize: 15, marginLeft: 16}}
          onTouchTap={this.props.handleShowSendToExchangeModal}
          buttonStyle={{ ...globalStyles.raisedButton }}
          labelStyle={globalStyles.raisedButtonLabel}
        />
      </div>
    )
  }
}

export default PageTitle
