import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import moment from 'moment'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'

import ModalDialog from './ModalDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import DocumentsList from 'components/common/DocumentsList/DocumentsList'

import './PollDetailsDialog.scss'

export class VoteDialog extends React.Component {

  static propTypes = {
    model: PropTypes.object,
    palette: PropTypes.array,
    onClose: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
  }

  static defaultProps = {
    palette: [
      '#00e5ff',
      '#f98019',
      '#fbda61',
      '#fb61da',
      '#8061fb',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FF00FF',
      '#FFFF00',
      '#FF5500'
    ]
  }

  render () {

    const { model, palette } = this.props
    const poll = model.poll()
    const details = model.details()
    const entries = model.voteEntries()

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
              <div styleName='column column-1'>
                <div styleName='inner'>
                  <div styleName='layer layer-entries'>
                    <div styleName='entry'>
                      <div styleName='entry-label'>Published:</div>
                      <div styleName='entry-value'>{details.published && moment(details.published).format('MMM Do, YYYY') || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entry-label'>End date:</div>
                      <div styleName='entry-value'>{details.endDate && moment(details.endDate).format('MMM Do, YYYY') || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entry-label'>Required votes:</div>
                      <div styleName='entry-value'>
                        {details.voteLimitInTIME === null
                          ? (<i>Unlimited</i>)
                          : (<span>{details.voteLimitInTIME.toString()} TIME</span>)
                        }
                      </div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entry-label'>Received votes:</div>
                      <div styleName='entry-value'>{details.received.toString()} TIME</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entry-label'>Variants:</div>
                      <div styleName='entry-value'>{details.options.count() || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entry-label'>Documents:</div>
                      <div styleName='entry-value'>{details.files.count() || (<i>No</i>)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='column column-2'>
                <div styleName='inner'>
                  <div styleName='layer'>
                    {details.status
                      ? (
                        <div styleName='entry entry-status'>
                          {details.active
                            ? (<div styleName='entry-badge badge-orange'>Ongoing</div>)
                            : (<div styleName='entry-badge badge-green'>New</div>)
                          }
                        </div>
                      )
                      : (
                        <div styleName='entry entry-status'>
                          <div styleName='entry-badge badge-blue'>Finished</div>
                        </div>
                      )
                    }
                  </div>
                  <div styleName='layer layer-chart'>
                    <div styleName='entry entry-total'>
                      <div styleName='entry-title'>{details.percents.toString()}%</div>
                      <div styleName='entry-label'>TIME Holders already voted</div>
                    </div>
                    <div styleName='chart chart-1'>
                      <DoughnutChart
                        weight={0.24}
                        rounded={false}
                        items={entries.toArray().map((item, index) => ({
                          value: item.count.toNumber(),
                          fill: palette[index % palette.length]
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {entries && entries.count()
                ? (
                  <div styleName='column column-3'>
                    <div styleName='inner'>
                      <div styleName='layer layer-legend'>
                        <div styleName='legend'>
                          {entries.map((item, index) => (
                            <div styleName='legend-item' key={index}>
                              <div styleName='item-point' style={{ backgroundColor: palette[index % palette.length] }}>
                              </div>
                              <div styleName='item-title'>
                                Option #{index + 1} &mdash; <b>{pluralize('vote', item.count.toNumber(), true)}</b>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
                : null
              }
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
                    <h3 styleName='title'>Poll options</h3>
                    <div styleName='options'>
                      <div styleName='options-table'>
                        {details.options.valueSeq().map((option, index) => (
                          <div key={index} styleName='table-item'>
                            <div styleName='item-left'>
                              {(details.memberVote === index + 1)
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
                label='Close'
                onTouchTap={() => this.props.handleClose()}
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
    handleClose: () => dispatch(modalsClose())
  }
}

export default connect(null, mapDispatchToProps)(VoteDialog)
