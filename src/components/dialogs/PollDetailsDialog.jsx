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

import './PollDetailsDialog.scss'

export class VoteDialog extends React.Component {

  static propTypes = {
    model: PropTypes.object,
    onClose: PropTypes.func,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
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
                        {details.voteLimit == null
                          ? (<i>No</i>)
                          : (<span>{details.voteLimit.toString()} TIME</span>)
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
                      <DoughnutChart weight={0.24} rounded={false} items={[
                        { value: 100, fill: '#00e5ff' },
                        { value: 200, fill: '#f98019' },
                        { value: 900, fill: '#fbda61' }
                      ]} />
                    </div>
                  </div>
                </div>
              </div>
              {details.options && details.options.count()
                ? (
                  <div styleName='column column-3'>
                    <div styleName='inner'>
                      <div styleName='layer layer-legend'>
                        <div styleName='legend'>
                          {details.options.valueSeq().map((element, index) => (
                            <div styleName='legend-item' key={index}>
                              <div styleName='item-point' style={{ backgroundColor: '#fbda61' }}>
                              </div>
                              <div styleName='item-title'>
                                Option #{index + 1} &mdash; <b>{pluralize('vote', index, true)}</b>
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
                    <div>
                      <h3 styleName='title'>Documents</h3>
                      <div styleName='documents'>
                        <div styleName='documents-list'>
                          {details.files.valueSeq().map((file, index) => (
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
              {details.options && details.options.count()
                ? (
                  <div styleName='column'>
                    <h3 styleName='title'>Poll options</h3>
                    <div styleName='options'>
                      <div styleName='options-table'>
                        {details.options.valueSeq().map((option, index) => (
                          <div key={index} styleName='table-item'>
                            <div styleName='item-left'>
                              <div styleName='symbol symbol-stroke'>#{index + 1}</div>
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
