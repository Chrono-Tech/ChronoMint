/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import FileSelect from 'components/common/FileSelect/FileSelect'
import { change, Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import Immutable from 'immutable'
import { FontIcon, IconButton } from 'material-ui'
import { ACCEPT_DOCS } from 'models/FileSelect/FileExtension'
import PollModel from 'models/PollModel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { TimePicker, DatePicker, Slider, TextField } from 'redux-form-material-ui'
import { DUCK_I18N } from 'redux/i18n/actions'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { createPoll, DUCK_VOTING } from 'redux/voting/actions'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import { TIME } from 'redux/mainWallet/actions'
import TokenValue from 'components/common/TokenValue/TokenValue'
import PollDetailsModel from 'models/PollDetailsModel'
import FileModel from 'models/FileSelect/FileModel'
import { Button } from 'components/index'
import './PollEditForm.scss'
import validate from './validate'
import { prefix } from './lang'
import { FEE_RATE_MULTIPLIER } from '../../../redux/mainWallet/actions'

export const FORM_EDIT_POLL = 'FormEditPoll'

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_EDIT_POLL)

  return {
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
      const poll = new PollModel({
        ...values.toJS(),
        files: filesCollection && filesCollection.hash(),
        voteLimitInTIME: new Amount(limitInTIME, TIME),
        options: new Immutable.List(values.get('options')),
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
    this.state = {
      selectedOptionIndex: 0,
    }
  }

  handleOptionSelect (index) {
    this.setState({ selectedOptionIndex: index })
  }

  handleOptionCreate = () => {
    this.props.addOption(this.props.options)
    this.setState({ selectedOptionIndex: this.props.options.length + 1 })
  }

  handleOptionRemove (options, index) {
    options.remove(index)
    if (this.state.selectedOptionIndex >= options.length) {
      this.setState({ selectedOptionIndex: options.length - 1 })
    }
  }

  renderOptions (options) {
    const optionsList = options.getAll()
    return (
      <div>
        <div styleName='optionsActions'>
          <Button
            flat
            label={<Translate value={`${prefix}.addOption`} />}
            styleName='optionsAction'
            onClick={() => this.handleOptionCreate(options)}
          />
        </div>
        <div styleName='optionsList'>
          <div styleName='listTable'>
            {optionsList && optionsList.toArray().map((option, index) => (
              <div
                key={index}
                styleName={classnames('tableItem', { active: this.state.selectedOptionIndex === index })}
                onClick={() => this.handleOptionSelect(index)}
              >
                <div styleName='itemLeft'>
                  <div styleName='symbol symbolFill'>#{index + 1}</div>
                </div>
                <div styleName='itemMain'>
                  <div styleName='mainTitle'><Translate value={`${prefix}.optionIndex`} index={index + 1} /></div>
                  <div styleName='mainOption'>{option}</div>
                </div>
                <div styleName='itemRight'>
                  <IconButton>
                    <FontIcon className='material-icons'>mode_edit</FontIcon>
                  </IconButton>
                  <IconButton>
                    <FontIcon
                      className='material-icons'
                      onClick={() => this.handleOptionRemove(options, index)}
                    >delete
                    </FontIcon>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { isModify, handleSubmit, pristine, invalid, voteLimitInTIME, maxVoteLimitInPercent, options, deadlineTime } = this.props
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

              <div styleName='gasSlider'>
                <Field
                  component={Slider}
                  sliderStyle={{ marginBottom: 0, marginTop: 5 }}
                  name='feeMultiplier'
                  {...FEE_RATE_MULTIPLIER}
                />
                <div styleName='tagsWrap'>
                  <div><Translate value={`${prefix}.slow`} /></div>
                  <div styleName='tagDefault' />
                  <div><Translate value={`${prefix}.fast`} /></div>
                </div>
              </div>
            </div>

          </div>
          <div styleName='footer'>
            <Button
              styleName='footerAction'
              label={<Translate value={`${prefix}.${isModify ? 'updatePoll' : 'createPoll'}`} />}
              buttonType='flat'
              type='submit'
              disabled={pristine || invalid}
              primary
            />
          </div>
        </form>
      </div>
    )
  }
}
