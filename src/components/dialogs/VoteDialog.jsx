import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'
import { vote } from 'redux/voting/actions'

import ModalDialog from './ModalDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import DocumentsList from 'components/common/DocumentsList/DocumentsList'

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

    const { model } = this.props
    const poll = model.poll()
    const details = model.details()

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
                      <div styleName='entry-title'>{details.daysLeft}</div>
                      <div styleName='entry-label'>{pluralize('day', details.daysLeft, false)} left</div>
                    </div>
                    <div styleName='entry entry-status'>
                      <div styleName='entry-badge'>Ongoing</div>
                    </div>
                  </div>
                  <div styleName='layer layer-chart'>
                    <div styleName='entry entry-total'>
                      <div styleName='entry-title'>{details.percents.toString()}%</div>
                      <div styleName='entry-label'>TIME Holders already voted</div>
                    </div>
                    <div styleName='chart chart-1'>
                      <DoughnutChart key={details} weight={0.08} items={[
                        { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                        { value: details.daysLeft, fill: 'transparent' }
                      ]} />
                    </div>
                    <div styleName='chart chart-2'>
                      <DoughnutChart key={details} weight={0.20} items={[
                        { value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9' },
                        { value: (details.shareholdersCount.minus(details.votedCount)).toNumber(), fill: 'transparent' }
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
                      <div styleName='entry-value'>{details.published && moment(details.published).format('MMM Do, YYYY') || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-finished'>
                      <div styleName='entry-label'>End date:</div>
                      <div styleName='entry-value'>{details.endDate && moment(details.endDate).format('MMM Do, YYYY') || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-required'>
                      <div styleName='entry-label'>Required votes:</div>
                      <div styleName='entry-value'>
                        {details.voteLimit == null
                          ? (<i>No</i>)
                          : (<span>{details.voteLimit.toString()} TIME</span>)
                        }
                      </div>
                    </div>
                    <div styleName='entry entry-received'>
                      <div styleName='entry-label'>Received votes:</div>
                      <div styleName='entry-value'>{details.received.toString()} TIME</div>
                    </div>
                    <div styleName='entry entry-variants'>
                      <div styleName='entry-label'>Variants:</div>
                      <div styleName='entry-value'>{details.options.count() || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entry-documents'>
                      <div styleName='entry-label'>Documents:</div>
                      <div styleName='entry-value'>{details.files.count() || (<i>No</i>)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div styleName='body'>
              <div styleName='column'>
                <h3 styleName='title'>{poll.title()}</h3>
                <div styleName='description'>{poll.description()}</div>
                {details.files && details.files.count()
                  ? (
                    <div styleName='clearfix'>
                      <h3 styleName='title'>Documents</h3>
                      <DocumentsList styleName='documents' documents={details.files} />
                    </div>
                  )
                  : null
                }
              </div>
              {details.options && details.options.count()
                ? (
                  <div styleName='column'>
                    <h3 styleName='title'>Choose option</h3>
                    <div styleName='options'>
                      <div styleName='options-table'>
                        {details.options.valueSeq().map((option, index) => (
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
      this.props.handleSubmit({ choice: this.state.choice + 1 })
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
      dispatch(vote(op.model, choice))
    }
  }
}

export default connect(null, mapDispatchToProps)(VoteDialog)
