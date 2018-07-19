/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import BigNumber from 'bignumber.js'
import web3Converter from '@chronobank/core/utils/Web3Converter'
import FileSelect from 'components/common/FileSelect/FileSelect'
import { change, Field, formPropTypes, formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form/immutable'
import Immutable from 'immutable'
import { ACCEPT_DOCS } from '@chronobank/core/models/FileSelect/FileExtension'
import PollModel from '@chronobank/core/models/PollModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { DatePicker, Slider, TextField, TimePicker } from 'redux-form-material-ui'
import { DUCK_I18N } from 'redux/i18n/actions'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import { daoByType } from '@chronobank/core/refactor/redux/daos/selectors'
import VotingManagerDAO, { TX_CREATE_POLL } from '@chronobank/core/dao/VotingManagerDAO'
import { DUCK_SESSION } from '@chronobank/core/redux/session/actions'
import { createPoll, DUCK_VOTING } from '@chronobank/core/redux/voting/actions'
import { modalsClose } from 'redux/modals/actions'
import Amount from '@chronobank/core/models/Amount'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { FEE_RATE_MULTIPLIER, TIME } from '@chronobank/core/redux/mainWallet/actions'
import TokenValue from 'components/common/TokenValue/TokenValue'
import PollDetailsModel from '@chronobank/core/models/PollDetailsModel'
import FileModel from '@chronobank/core/models/FileSelect/FileModel'
import { Button } from 'components/index'
import './PollEditForm.scss'
import validate from './validate'
import { prefix } from './lang'

export const FORM_EDIT_POLL = 'FormEditPoll'

const createDeadlineDate = (deadline, deadlineTime) => {
  if (!deadline || !deadlineTime) {
    return null
  }
  return new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate(), deadlineTime.getHours(), deadlineTime.getMinutes(), deadlineTime.getSeconds(), deadlineTime.getMilliseconds())
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_EDIT_POLL)
  const formErrors = getFormSyncErrors(FORM_EDIT_POLL)(state)
  const votingDao = daoByType('VotingManager')(state)

  return {
    formErrors,
    votingDao,
    feeMultiplier: selector(state, 'feeMultiplier'),
    deadline: selector(state, 'deadline'),
    deadlineTime: selector(state, 'deadlineTime'),
    options: selector(state, 'options'),
    files: selector(state, 'files'),
    account: state.get(DUCK_SESSION).account,
    maxVoteLimitInTIME: new BigNumber(state.get(DUCK_VOTING).voteLimitInTIME() || 0),
    maxVoteLimitInPercent: new BigNumber(state.get(DUCK_VOTING).voteLimitInPercent() || 0),
    voteLimitInTIME: selector(state, 'voteLimitInTIME'),
    timeToken: state.get(DUCK_TOKENS).item('TIME'),
    locale: state.get(DUCK_I18N).locale,
    initialValues: {
      feeMultiplier: 1,
      deadline: moment().add(1, 'day').toDate(),
      deadlineTime: new Date(),
      voteLimitInTIME: 1,
      options: [
        '',
        '',
        '',
      ],
    },
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addOption: (options) => dispatch(change(FORM_EDIT_POLL, 'options', options.push(''))),
    onSubmit: (values, dispatch, props) => {
      const limitInTIME = props.maxVoteLimitInTIME.div(100).mul(values.get('voteLimitInTIME'))
      const filesCollection = values.get('files')
      const deadline = createDeadlineDate(values.get('deadline'), values.get('deadlineTime'))
      const poll = new PollModel({
        ...values.toJS(),
        deadline,
        files: filesCollection && filesCollection.hash(),
        voteLimitInTIME: new Amount(limitInTIME, TIME),
        options: new Immutable.List(values.get('options').toArray().filter((option) => option.length > 0)),
        owner: props.account,
      })

      dispatch(modalsClose())
      dispatch(createPoll(
        new PollDetailsModel({
          poll,
          files: new Immutable.List((filesCollection && filesCollection.links() || [])
            .map((item) => FileModel.createFromLink(item))),
        })),
      )
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EDIT_POLL, validate })
export default class PollEditForm extends Component {

  static propTypes = {
    isModify: PropTypes.bool,
    account: PropTypes.string,
    votingDao: PropTypes.instanceOf(VotingManagerDAO),
    voteLimit: PropTypes.objectOf(BigNumber),
    timeToken: PropTypes.instanceOf(TokenModel),
    maxVoteLimitInTIME: PropTypes.instanceOf(BigNumber),
    maxVoteLimitInPercent: PropTypes.instanceOf(BigNumber),
    locale: PropTypes.string,
    voteLimitInTIME: PropTypes.number,
    ...formPropTypes,
  }

  constructor () {
    super(...arguments)
    this.state = {}
  }

  componentWillReceiveProps (newProps) {
    const { options, voteLimitInTIME, deadline, deadlineTime, feeMultiplier } = newProps
    const newOptionsSize = options.size
    const oldOptionsSize = this.props.options && this.props.options.length
    const newDeadline = createDeadlineDate(deadline, deadlineTime)
    const oldDeadline = createDeadlineDate(this.props.deadline, this.props.deadlineTime)

    if (newOptionsSize !== oldOptionsSize || voteLimitInTIME !== this.props.voteLimitInTIME || newDeadline !== oldDeadline) {
      this.handleGetGasPrice(TX_CREATE_POLL, newOptionsSize, voteLimitInTIME, newDeadline, feeMultiplier)
    }
  }

  handleGetGasPrice = (action: string, optionsSize: number, voteLimitInTIME, newDeadline: Date, feeMultiplier: number) => {
    const { account } = this.props

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.votingDao.estimateGasForVoting(
        action,
        [action, [optionsSize, 'hashStub', new BigNumber(voteLimitInTIME), newDeadline.getTime()], new BigNumber(0), account],
        (error, result) => {
          const { gasFee, gasPrice } = result
          if (!error) {
            this.setState({ gasFee, gasPrice })
          } else {
            // eslint-disable-next-line
            console.error(error)
          }
        },
        feeMultiplier,
      )
    }, 1000)
  }

  handleOptionCreate = () => {
    this.props.addOption(this.props.options)
  }

  render () {
    const { isModify, handleSubmit, pristine, invalid, voteLimitInTIME, maxVoteLimitInPercent, options, feeMultiplier, formErrors } = this.props
    const limitInTIME = this.props.maxVoteLimitInTIME.div(100).mul(voteLimitInTIME || 1)
    return (
      <div styleName='root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <form styleName='content' onSubmit={handleSubmit}>
          <div styleName='body'>
            <div styleName='column'>
              <Field
                component={TextField}
                name='title'
                fullWidth
                floatingLabelText={<Translate value={`${prefix}.pollTitle`} />}
              />
              <Field
                component={TextField}
                name='description'
                fullWidth
                multiLine
                floatingLabelText={<Translate value={`${prefix}.pollDescription`} />}
              />

              <Field
                component={FileSelect}
                returnCollection
                name='files'
                fullWidth
                accept={ACCEPT_DOCS}
                multiple
              />
            </div>

            <div styleName='column'>

              <div styleName='column-title'><Translate value={`${prefix}.options`} /></div>

              <div styleName='optionsCountWarning'>{formErrors.optionsCount ? <Translate value={`${prefix}.countOptions`} /> : null}</div>

              {options && options.map((value, i) => (
                <div styleName='option' key={i}>
                  <div styleName='number'>#{i + 1}</div>
                  <Field
                    component={TextField}
                    name={`options[${i}]`}
                    fullWidth
                    floatingLabelText={<Translate value={`${prefix}.option`} />}
                  />
                </div>
              ))}

              <div styleName='optionsAction'>
                <Button
                  flat
                  label={<Translate value={`${prefix}.addOption`} />}
                  onClick={this.handleOptionCreate}
                />
              </div>

            </div>

            <div styleName='column'>

              <div styleName='column-title'><Translate value={`${prefix}.endPollTitle`} /></div>
              <div styleName='column-description'><Translate value={`${prefix}.endPollDescription`} /></div>

              <div styleName='sliderWrapper'>
                <div styleName='labelWrap'>
                  <div>1%</div>
                  <div>{maxVoteLimitInPercent.toNumber() || 10}%</div>
                </div>

                <Field
                  component={Slider}
                  name='voteLimitInTIME'
                  sliderStyle={{ marginBottom: 0, marginTop: 10 }}
                  min={1}
                  max={maxVoteLimitInPercent.toNumber() || 10}
                  step={1}
                />
                <div styleName='limitTitle'>
                  <b><Translate value={`${prefix}.limitTitle_1`} /></b>
                  <Translate value={`${prefix}.limitTitle_2`} />
                  <b><TokenValue value={new Amount(limitInTIME, TIME)} noRenderPrice noRenderSymbol /></b>
                </div>
              </div>
            </div>

            <div styleName='column'>

              <div styleName='column-title'><Translate value={`${prefix}.deadlineTitle`} /></div>

              <div styleName='timeWrapper'>
                <Field
                  component={DatePicker}
                  locale={this.props.locale}
                  DateTimeFormat={Intl.DateTimeFormat}
                  cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
                  okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
                  name='deadline'
                  fullWidth
                  floatingLabelText={<Translate value={`${prefix}.finishedDate`} />}
                  style={{ width: '165px' }}
                />
                <Field
                  component={TimePicker}
                  format={(value) => value === '' ? null : value}
                  cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
                  okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
                  name='deadlineTime'
                  fullWidth
                  floatingLabelText={<Translate value={`${prefix}.finishedTime`} />}
                  style={{ width: '165px', marginLeft: '40px' }}
                />
              </div>
            </div>

            <div styleName='column'>

              <div styleName='column-title'><Translate value={`${prefix}.transactionFeeTitle`} /></div>

              <div>
                <div styleName='feeRate'>
                  <div styleName='tagsWrap'>
                    <div><Translate value={`${prefix}.slow`} /></div>
                    <div styleName='tagDefault' />
                    <div><Translate value={`${prefix}.fast`} /></div>
                  </div>

                  <Field
                    component={Slider}
                    sliderStyle={{ marginBottom: 0, marginTop: 5 }}
                    name='feeMultiplier'
                    {...FEE_RATE_MULTIPLIER}
                  />
                </div>
              </div>
              <div styleName='transactionsInfo'>
                <div>
                  <div><b><Translate value={`${prefix}.transactionFee`} /></b>
                    <span styleName='infoText'>
                      {this.state.gasFee && <TokenValue value={this.state.gasFee} noRenderPrice />}
                      &nbsp;({this.state.gasFee && <TokenValue value={this.state.gasFee} renderOnlyPrice />})
                    </span>
                  </div>
                  <div>
                    <Translate value={`${prefix}.averageFee`} multiplier={feeMultiplier} />
                  </div>

                  <div>
                    <b><Translate value={`${prefix}.gasPrice`} /></b>
                    {this.state.gasPrice && `${web3Converter.fromWei(this.state.gasPrice, 'gwei').toString()} Gwei`}
                    {this.state.gasPrice && <Translate value={`${prefix}.multiplier`} multiplier={feeMultiplier} />}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div styleName='footer'>
            <Button
              styleName='footerAction'
              label={<Translate value={`${prefix}.${isModify ? 'updatePoll' : 'createPoll'}`} />}
              type='submit'
              disabled={pristine || invalid || !!formErrors.optionsCount}
            />
          </div>
        </form>
      </div>
    )
  }
}
