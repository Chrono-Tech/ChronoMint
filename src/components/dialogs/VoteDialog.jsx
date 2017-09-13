import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'
import { vote } from 'redux/voting/actions'

import ModalDialog from './ModalDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'

import './VoteDialog.scss'
import Moment from 'components/common/Moment/index'

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
          <form styleName='content' onSubmit={(e) => this.handleSubmit(e)}>
            <div styleName='header'>
              <div styleName='column'>
                <div styleName='inner'>
                  <div styleName='layer layerHead'>
                    <div styleName='entry entryDate'>
                      <div styleName='entryTitle'>{details.daysLeft}</div>
                      <div styleName='entryLabel'>{pluralize('day', details.daysLeft, false)} left</div>
                    </div>
                    <div styleName='entry entryStatus'>
                      <div styleName='entryBadge'>Ongoing</div>
                    </div>
                  </div>
                  <div styleName='layer layerChart'>
                    <div styleName='entry entryTotal'>
                      <div styleName='entryTitle'>{details.percents.toString()}%</div>
                      <div styleName='entryLabel'>TIME Holders already voted</div>
                    </div>
                    <div styleName='chart chart1'>
                      <DoughnutChart key={details} weight={0.08} items={[
                        { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                        { value: details.daysLeft, fill: 'transparent' }
                      ]} />
                    </div>
                    <div styleName='chart chart2'>
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
                  <div styleName='layer layerEntries'>
                    <div styleName='entry entryPublished'>
                      <div styleName='entryLabel'>Published:</div>
                      <div styleName='entryValue'>{details.published &&
                      <Moment date={details.published} format='MMM Do, YYYY'/> || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entryFinished'>
                      <div styleName='entryLabel'>End date:</div>
                      <div styleName='entryValue'>{details.endDate &&
                      <Moment date={details.endDate} format='MMM Do, YYYY'/> || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entryRequired'>
                      <div styleName='entryLabel'>Required votes:</div>
                      <div styleName='entryValue'>
                        {details.voteLimit == null
                          ? (<i>No</i>)
                          : (<span>{details.voteLimit.toString()} TIME</span>)
                        }
                      </div>
                    </div>
                    <div styleName='entry entryReceived'>
                      <div styleName='entryLabel'>Received votes:</div>
                      <div styleName='entryValue'>{details.received.toString()} TIME</div>
                    </div>
                    <div styleName='entry entryVariants'>
                      <div styleName='entryLabel'>Variants:</div>
                      <div styleName='entryValue'>{details.options.count() || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry entryDocuments'>
                      <div styleName='entryLabel'>Documents:</div>
                      <div styleName='entryValue'>{details.files.count() || (<i>No</i>)}</div>
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
                    <div>
                      <h3 styleName='title'>Documents</h3>
                      <div styleName='documents'>
                        <div styleName='documentsList'>
                          {details.files.valueSeq().map((file, index) => (
                            <a key={index} styleName='listItem' href='#'>
                              <i className='material-icons'>insert_drive_file</i>
                              <span styleName='itemTitle'>file-name.pdf</span>
                            </a>
                          ))}
                        </div>
                      </div>
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
                      <div styleName='optionsTable'>
                        {details.options.valueSeq().map((option, index) => (
                          <div key={index}
                            styleName={classnames('tableItem', {active: index === this.state.choice})}
                            onTouchTap={() => this.handleSelect(index)}
                          >
                            <div styleName='itemLeft'>
                              {index === this.state.choice
                                ? (
                                  <div styleName='symbol symbolFill'>
                                    <i className='material-icons'>check</i>
                                  </div>
                                )
                                : (
                                  <div styleName='symbol symbolStroke'>#{index + 1}</div>
                                )
                              }
                            </div>
                            <div styleName='itemMain'>
                              <div styleName='mainTitle'>Option #{index + 1}</div>
                              <div styleName='mainOption'>{option}</div>
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

  handleSubmit (e) {
    e.preventDefault()
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
