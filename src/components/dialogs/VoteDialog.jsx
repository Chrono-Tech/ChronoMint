import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'

import { modalsClose } from 'redux/modals/actions'
import { vote } from 'redux/voting/actions'

import DocumentsList from 'components/common/DocumentsList/DocumentsList'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import Moment, { SHORT_DATE } from 'components/common/Moment'

import ModalDialog from './ModalDialog'

import './VoteDialog.scss'

function prefix (token) {
  return `components.dialogs.VoteDialog.${token}`
}

export class VoteDialog extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    onClose: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      choice: null,
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
        transitionLeaveTimeout={250}
      >
        <ModalDialog onClose={() => this.props.handleClose()} styleName='root'>
          <form styleName='content' onSubmit={(e) => this.handleSubmit(e)}>
            <div styleName='header'>
              <div styleName='column'>
                <div styleName='inner'>
                  <div styleName='layer layerHead'>
                    <div styleName='entry entryDate'>
                      <div styleName='entryTitle'>{details.daysLeft}</div>
                      {/* <div styleName='entryLabel'>{pluralize('day', details.daysLeft, false)} left</div> */}
                      <div styleName='entryLabel'><Translate value={prefix('daysLeft')} count={((details.daysLeft % 100 < 20) && (details.daysLeft % 100) > 10) ? 0 : details.daysLeft % 10} /></div>
                    </div>
                    <div styleName='entry entryStatus'>
                      <div styleName='entryBadge'><Translate value={prefix('ongoing')} /></div>
                    </div>
                  </div>
                  <div styleName='layer layerChart'>
                    <div styleName='entry entryTotal'>
                      <div styleName='entryTitle'>{details.percents.toString()}%</div>
                      <div styleName='entryLabel'><Translate value={prefix('timeHoldersAlreadyVoted')} /></div>
                    </div>
                    <div styleName='chart chart1'>
                      <DoughnutChart
                        key={details}
                        weight={0.08}
                        items={[
                          { value: details.daysTotal - details.daysLeft, fillFrom: '#fbda61', fillTo: '#f98019' },
                          { value: details.daysLeft, fill: 'transparent' },
                        ]}
                      />
                    </div>
                    <div styleName='chart chart2'>
                      <DoughnutChart
                        key={details}
                        weight={0.20}
                        items={[
                          { value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9' },
                          { value: (details.shareholdersCount.minus(details.votedCount)).toNumber(), fill: 'transparent' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='column'>
                <div styleName='inner'>
                  <div styleName='layer layerEntries'>
                    <div styleName='entry entryPublished'>
                      <div styleName='entryLabel'><Translate value={prefix('published')} />:</div>
                      <div styleName='entryValue'>{details.published &&
                      <Moment date={details.published} format={SHORT_DATE} /> || (<i><Translate value={prefix('no')} /></i>)}
                      </div>
                    </div>
                    <div styleName='entry entryFinished'>
                      <div styleName='entryLabel'><Translate value={prefix('endDate')} />:</div>
                      <div styleName='entryValue'>{details.endDate &&
                      <Moment date={details.endDate} format={SHORT_DATE} /> || (<i><Translate value={prefix('no')} /></i>)}
                      </div>
                    </div>
                    <div styleName='entry entryRequired'>
                      <div styleName='entryLabel'><Translate value={prefix('requiredVotes')} />:</div>
                      <div styleName='entryValue'>
                        {details.voteLimitInTIME == null
                          ? (<i>Unlimited</i>)
                          : (<span>{details.voteLimitInTIME.toString()} TIME</span>)
                        }
                      </div>
                    </div>
                    <div styleName='entry entryReceived'>
                      <div styleName='entryLabel'><Translate value={prefix('receivedVotes')} />:</div>
                      <div styleName='entryValue'>{details.received.toString()} TIME</div>
                    </div>
                    <div styleName='entry entryVariants'>
                      <div styleName='entryLabel'><Translate value={prefix('variants')} />:</div>
                      <div styleName='entryValue'>{details.options.count() || (<i><Translate value={prefix('no')} /></i>)}</div>
                    </div>
                    <div styleName='entry entryDocuments'>
                      <div styleName='entryLabel'><Translate value={prefix('documents')} />:</div>
                      <div styleName='entryValue'>{details.files.count() || (<i><Translate value={prefix('no')} /></i>)}</div>
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
                    <h3 styleName='title'><Translate value={prefix('chooseOption')} /></h3>
                    <div styleName='options'>
                      <div styleName='optionsTable'>
                        {details.options.valueSeq().map((option, index) => (
                          <div
                            key={index}
                            styleName={classnames('tableItem', { active: index === this.state.choice })}
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
                label={<Translate value={prefix('vote')} />}
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
      choice,
    })
  }
}

function mapDispatchToProps (dispatch, op) {
  return {
    handleClose: () => dispatch(modalsClose()),
    handleSubmit: ({ choice }) => {
      dispatch(modalsClose())
      dispatch(vote(op.model, choice))
    },
  }
}

export default connect(null, mapDispatchToProps)(VoteDialog)
