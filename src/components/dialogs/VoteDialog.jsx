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
              <div styleName='column'>
                <div styleName='inner'>
                  <div styleName='layer layer-head'>
                    <div styleName='entry entry-date'>
                      <div styleName='entry-title'>31</div>
                      <div styleName='entry-label'>days left</div>
                    </div>
                    <div styleName='entry entry-status'>
                      <div styleName='entry-badge'>Ongoing</div>
                    </div>
                  </div>
                  <div styleName='layer layer-chart'>
                    <div styleName='entry entry-total'>
                      <div styleName='entry-title'>77%</div>
                      <div styleName='entry-label'>TIME Holders already voted</div>
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='column'>
                <div styleName='inner'>
                  <div styleName='layer layer-entries'>
                    <div styleName='entry entry-published'>
                      <div styleName='entry-label'>Published:</div>
                      <div styleName='entry-value'>May 23, 2017</div>
                    </div>
                    <div styleName='entry entry-finished'>
                      <div styleName='entry-label'>End date:</div>
                      <div styleName='entry-value'>Jul 23, 2017</div>
                    </div>
                    <div styleName='entry entry-required'>
                      <div styleName='entry-label'>Required votes:</div>
                      <div styleName='entry-value'>120</div>
                    </div>
                    <div styleName='entry entry-received'>
                      <div styleName='entry-label'>Received votes:</div>
                      <div styleName='entry-value'>36</div>
                    </div>
                    <div styleName='entry entry-variants'>
                      <div styleName='entry-label'>Variants:</div>
                      <div styleName='entry-value'>15</div>
                    </div>
                    <div styleName='entry entry-documents'>
                      <div styleName='entry-label'>Documents:</div>
                      <div styleName='entry-value'>4</div>
                    </div>
                  </div>
                </div>
              </div>
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
                          {index === 2
                            ? (
                              <div styleName='symbol symbol-fill'>
                                <i className='material-icons'>check</i>
                              </div>
                            )
                            : (
                              <div styleName='symbol symbol-stroke'>#{index + 1}</div>
                            )
                          }
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
