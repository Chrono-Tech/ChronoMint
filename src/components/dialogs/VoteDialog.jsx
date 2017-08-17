import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'
import { vote } from 'redux/voting/actions'

import ModalDialog from './ModalDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './VoteDialog.scss'

export class VoteDialog extends React.Component {

  static propTypes = {
    model: PropTypes.object,
    onClose: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state ={
      choice: null
    }
  }

  render () {

    const model = this.props.model
    const poll = model.poll()
    const endDate = poll.deadline()
    const voteLimit = poll.voteLimit()
    const options = poll.options()
    const files = poll.files()

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        <ModalDialog onClose={() => this.props.handleClose()} styleName='root'>
          <form styleName='content' onSubmit={() => this.handleSubmit()}>
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
                    <div styleName='chart chart-1'>
                      <DoughnutChart weight={0.08} items={[
                        { value: 300, fillFrom: '#fbda61', fillTo: '#f98019' },
                        { value: 60, fill: 'transparent' }
                      ]} />
                    </div>
                    <div styleName='chart chart-2'>
                      <DoughnutChart weight={0.20} items={[
                        { value: 250, fillFrom: '#311b92', fillTo: '#d500f9' },
                        { value: 110, fill: 'transparent' }
                      ]} />
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
                      <div styleName='entry-value'>{endDate && moment.unix(endDate / 1000).format('MMM Do, YYYY') || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-required'>
                      <div styleName='entry-label'>Required votes:</div>
                      <div styleName='entry-value'>{voteLimit || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-received'>
                      <div styleName='entry-label'>Received votes:</div>
                      <div styleName='entry-value'>36</div>
                    </div>
                    <div styleName='entry entry-variants'>
                      <div styleName='entry-label'>Variants:</div>
                      <div styleName='entry-value'>{options && options.count() || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-documents'>
                      <div styleName='entry-label'>Documents:</div>
                      <div styleName='entry-value'>{files && files.count() || (<i>No</i>)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <h3 styleName='title'>{poll.title()}</h3>
                <div styleName='description'>{poll.description()}</div>
                {files && files.count()
                  ? (
                    <div>
                      <h3 styleName='title'>Documents</h3>
                      <div styleName='documents'>
                        <div styleName='documents-list'>
                          {files.valueSeq().map((file, index) => (
                            <a key={index} styleName='list-item' href='#'>
                              <i className='material-icons'>insert_drive_file</i>
                              <span styleName='item-title'>file-name.pdf</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                  : null
                }
              </div>
              {options && options.count()
                ? (
                  <div styleName='column'>
                    <h3 styleName='title'>Choose option</h3>
                    <div styleName='options'>
                      <div styleName='options-table'>
                        {options.valueSeq().map((option, index) => (
                          <div key={index}
                            styleName={classnames('table-item', {active: index === this.state.choice})}
                            onTouchTap={() => this.handleSelect(index)}
                          >
                            <div styleName='item-left'>
                              {index === this.state.choice
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
                              <div styleName='main-option'>{option}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
                : null
              }
            </div>
            <div styleName='footer'>
              <RaisedButton
                styleName='action'
                label='Vote'
                type='submit'
                primary
                disabled={this.state.choice === null}
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }

  handleSubmit () {
    if (this.state.choice !== null) {
      this.props.handleSubmit({ choice: this.state.choice })
    }
  }

  handleSelect (choice) {
    this.setState({
      choice
    })
  }
}

function mapDispatchToProps (dispatch, op) {
  return {
    handleClose: () => dispatch(modalsClose()),
    handleSubmit: ({ choice }) => {
      dispatch(modalsClose())
      dispatch(vote(op.model.poll(), choice))
    }
  }
}

export default connect(null, mapDispatchToProps)(VoteDialog)
