import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
//import moment from 'moment'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import { RaisedButton } from 'material-ui'

import { modalsClose } from 'redux/modals/actions'

import ModalDialog from './ModalDialog'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import DocumentsList from 'components/common/DocumentsList/DocumentsList'

import './PollDetailsDialog.scss'
import Moment, { SHORT_DATE } from 'components/common/Moment'

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
              <div styleName='column column1'>
                <div styleName='inner'>
                  <div styleName='layer layerEntries'>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>Published:</div>
                      <div styleName='entryValue'>{details.published && <Moment date={details.published} format={SHORT_DATE}/> || (<i>No</i>)}</div>
                      {/*<div styleName='entryValue'>{details.published && moment(details.published).format('MMM Do, YYYY') || (<i>No</i>)}</div>*/}
                    </div>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>End date:</div>
                      <div styleName='entryValue'>{details.endDate && <Moment date={details.endDate} format={SHORT_DATE}/> || (<i>No</i>)}</div>
                      {/*<div styleName='entryValue'>{details.endDate && moment(details.endDate).format('MMM Do, YYYY') || (<i>No</i>)}</div>*/}
                    </div>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>Required votes:</div>
                      <div styleName='entryValue'>
                        {details.voteLimitInTIME === null
                          ? (<i>Unlimited</i>)
                          : (<span>{details.voteLimitInTIME.toString()} TIME</span>)
                        }
                      </div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>Received votes:</div>
                      <div styleName='entryValue'>{details.received.toString()} TIME</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>Variants:</div>
                      <div styleName='entryValue'>{details.options.count() || (<i>No</i>)}</div>
                    </div>
                    <div styleName='entry'>
                      <div styleName='entryLabel'>Documents:</div>
                      <div styleName='entryValue'>{details.files.count() || (<i>No</i>)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div styleName='column column2'>
                <div styleName='inner'>
                  <div styleName='layer'>
                    {details.status
                      ? (
                        <div styleName='entry entryStatus'>
                          {details.active
                            ? (<div styleName='entryBadge badgeOrange'>Ongoing</div>)
                            : (<div styleName='entryBadge badgeGreen'>New</div>)
                          }
                        </div>
                      )
                      : (
                        <div styleName='entry entryStatus'>
                          <div styleName='entryBadge badgeBlue'>Finished</div>
                        </div>
                      )
                    }
                  </div>
                  <div styleName='layer layerChart'>
                    <div styleName='entry entryTotal'>
                      <div styleName='entryTitle'>{details.percents.toString()}%</div>
                      <div styleName='entryLabel'>TIME Holders already voted</div>
                    </div>
                    <div styleName='chart chart1'>
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
                  <div styleName='column column3'>
                    <div styleName='inner'>
                      <div styleName='layer layerLegend'>
                        <div styleName='legend'>
                          {entries.map((item, index) => (
                            <div styleName='legendItem' key={index}>
                              <div styleName='itemPoint' style={{ backgroundColor: palette[index % palette.length] }}>
                              </div>
                              <div styleName='itemTitle'>
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
                      <div styleName='optionsTable'>
                        {details.options.valueSeq().map((option, index) => (
                          <div key={index} styleName='tableItem'>
                            <div styleName='itemLeft'>
                              {(details.memberVote === index + 1)
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
