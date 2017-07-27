import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { FlatButton, FontIcon, RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'

import ModalDialog from './ModalDialog'

import './VoteDialog.scss'

export class VoteDialog extends React.Component {

  static propTypes = {
    poll: PropTypes.object,
    onClose: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()} styleName='root'>
          <form styleName='content' onSubmit={() => this.props.handleSubmit()}>
            <div styleName='header'>
              <h3>Vote</h3>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <h3 styleName='title'>Allocate 15% of transaction fees to developers</h3>
                <div styleName='description'>
                  With easy access to Broadband and DSL the number of people
                  using the Internet has skyrocket in recent years. Email,
                  instant messaging and file sharing with other Internet users
                  has also provided a platform for faster spreading of viruses,
                  Trojans and Spyware.
                </div>
                <h3 styleName='title'>Documents</h3>
                <div styleName='documents'>
                  <div styleName='documents-list'>
                    <a styleName='list-item' href='#'>
                      <i className='material-icons'>insert_drive_file</i>
                      <span styleName='item-title'>file-name.pdf</span>
                    </a>
                    <a styleName='list-item' href='#'>
                      <i className='material-icons'>insert_drive_file</i>
                      <span styleName='item-title'>file-name.pdf</span>
                    </a>
                    <a styleName='list-item' href='#'>
                      <i className='material-icons'>insert_drive_file</i>
                      <span styleName='item-title'>file-name.pdf</span>
                    </a>
                    <a styleName='list-item' href='#'>
                      <i className='material-icons'>insert_drive_file</i>
                      <span styleName='item-title'>file-name.pdf</span>
                    </a>
                    <a styleName='list-item' href='#'>
                      <i className='material-icons'>insert_drive_file</i>
                      <span styleName='item-title'>file-name.pdf</span>
                    </a>
                  </div>
                </div>
              </div>
              <div styleName='column'>
                <h3 styleName='title'>Choose option</h3>
                <div styleName='options'>
                  <div styleName='options-table'>
                    {[1,2,3,4,5,6].map((option, index) => (
                      <div key={index} styleName={classnames('table-item', {active: index === 2})}>
                        <div styleName='item-left'>
                          <div styleName='symbol symbol-stroke'>#{index + 1}</div>
                        </div>
                        <div styleName='item-main'>
                          <div styleName='main-title'>Option #{index + 1}</div>
                          <div styleName='main-option'>E Banks That Accept Us Casino Players</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label='Vote'
                primary
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleClose: () => dispatch(modalsClose()),
    handleSubmit: (/*values*/) => {
      dispatch(modalsClose())
      // dispatch(newPoll(new PollModel(values)))
    }
  }
}

export default connect(null, mapDispatchToProps)(VoteDialog)
