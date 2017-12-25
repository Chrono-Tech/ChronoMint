import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { modalsClose } from 'redux/modals/actions'
import DocumentsList from 'components/common/DocumentsList/DocumentsList'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import Moment from 'components/common/Moment'
import { SHORT_DATE } from 'models/constants'
import ModalDialog from './ModalDialog'
import './PollDetailsDialog.scss'

function prefix (token) {
  return `components.dialogs.PollDetailsDialog.${token}`
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class VoteDialog extends PureComponent {
  static propTypes = {
    model: PropTypes.object,
    palette: PropTypes.array,
    handleSubmit: PropTypes.func,
    modalsClose: PropTypes.func,
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
      '#FF5500',
    ],
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    const { model, palette } = this.props
    const poll = model.poll()
    const details = model.details()
    const entries = model.voteEntries()

    return (
      <ModalDialog styleName='root'>
        <form styleName='content' onSubmit={this.props.handleSubmit}>
          <div styleName='header'>
            <div styleName='column column1'>
              <div styleName='inner'>
                <div styleName='layer layerEntries'>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('published')} />:</div>
                    <div styleName='entryValue'>{details.published &&
                    <Moment date={details.published} format={SHORT_DATE} /> || (<i>No</i>)}</div>
                  </div>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('endDate')} />:</div>
                    <div styleName='entryValue'>{details.endDate &&
                    <Moment date={details.endDate} format={SHORT_DATE} /> || (<i>No</i>)}</div>
                  </div>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('requiredVotes')} />:</div>
                    <div styleName='entryValue'>
                      {details.voteLimitInTIME === null
                        ? (<i>Unlimited</i>)
                        : (<span>{details.voteLimitInTIME.toString()} TIME</span>)
                      }
                    </div>
                  </div>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('receivedVotes')} />:</div>
                    <div styleName='entryValue'>{details.received.toString()} TIME</div>
                  </div>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('variants')} />:</div>
                    <div styleName='entryValue'>{details.options.count() || (
                      <i><Translate value={prefix('no')} /></i>)}</div>
                  </div>
                  <div styleName='entry'>
                    <div styleName='entryLabel'><Translate value={prefix('documents')} />:</div>
                    <div styleName='entryValue'>{details.files.count() || (
                      <i><Translate value={prefix('no')} /></i>)}</div>
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
                          ? (<div styleName='entryBadge badgeOrange'><Translate value={prefix('ongoing')} /></div>)
                          : (<div styleName='entryBadge badgeGreen'><Translate value={prefix('new')} /></div>)
                        }
                      </div>
                    )
                    : (
                      <div styleName='entry entryStatus'>
                        <div styleName='entryBadge badgeBlue'><Translate value={prefix('finished')} /></div>
                      </div>
                    )
                  }
                </div>
                <div styleName='layer layerChart'>
                  <div styleName='entry entryTotal'>
                    <div styleName='entryTitle'>{details.percents.toString()}%</div>
                    <div styleName='entryLabel'><Translate value={prefix('timeHoldersAlreadyVoted')} /></div>
                  </div>
                  <div styleName='chart chart1'>
                    <DoughnutChart
                      weight={0.24}
                      rounded={false}
                      items={entries.toArray().map((item, index) => ({
                        value: item.count.toNumber(),
                        fill: palette[index % palette.length],
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
                            <div styleName='itemPoint' style={{ backgroundColor: palette[index % palette.length] }} />
                            <div styleName='itemTitle'>
                              <Translate value={prefix('optionNumber')} number={index + 1} /> &mdash; <b><Translate
                              value={prefix('numberVotes')} number={item.count.toNumber()}
                              count={((item.count.toNumber() % 100 < 20) && (item.count.toNumber() % 100) > 10) ? 0 : item.count.toNumber() % 10} /></b>
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
                  <h3 styleName='title'><Translate value={prefix('pollOptions')} /></h3>
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
                                <div styleName='symbol symbolStroke'><Translate value={prefix('idxNumber')}
                                                                                number={index + 1} /></div>
                              )
                            }
                          </div>
                          <div styleName='itemMain'>
                            <div styleName='mainTitle'><Translate value={prefix('optionNumber')} number={index + 1} />
                            </div>
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
              onTouchTap={this.handleClose}
              primary
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
