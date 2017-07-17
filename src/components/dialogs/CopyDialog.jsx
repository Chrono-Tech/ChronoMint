import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton, TextField } from 'material-ui'

import ModalDialog from './ModalDialog'

import { modalsClose } from 'redux/modals/actions'

import './CopyDialog.scss'

export class CopyDialog extends React.Component {

  static propTypes = {
    copyValue: PropTypes.string,
    title: PropTypes.string,
    controlTitle: PropTypes.string,
    description: PropTypes.string,
    onClose: PropTypes.func
  }

  componentDidMount () {
    this.inputElement.select()
  }

  render () {

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.onClose()} styleName='root'>
          <div styleName='content'>
            <div styleName='header'>
              <h3>{this.props.title}</h3>
            </div>
            <div styleName='body'>
              <div>
                {this.props.description}
              </div>
              <TextField ref={(el) => { this.inputElement = el }} name='value' value={this.props.copyValue} fullWidth floatingLabelText={this.props.controlTitle} />
            </div>
            <div styleName='footer'>
              <RaisedButton primary label='Close' onTouchTap={() => this.props.onClose()} />
            </div>
          </div>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose())
  }
}

export default connect(null, mapDispatchToProps)(CopyDialog)
