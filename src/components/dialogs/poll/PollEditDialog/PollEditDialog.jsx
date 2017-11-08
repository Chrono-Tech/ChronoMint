import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import ModalDialog from 'components/dialogs/ModalDialog'
import { FlatButton, FontIcon, IconButton } from 'material-ui'
import { validate } from 'models/PollModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { createPoll, DUCK_VOTING, updatePoll } from 'redux/voting/actions'
import PollEditForm from './PollEditForm'
import './PollEditDialog.scss'

export const FORM_EDIT_POLL = 'FormEditPoll'

function prefix (token) {
  return `components.dialogs.PollEditDialog.${token}`
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_EDIT_POLL)
  const session = state.get(DUCK_SESSION)
  const voting = state.get(DUCK_VOTING)
  return {
    options: selector(state, 'options'),
    account: session.account,
    maxVoteLimitInTIME: voting.voteLimitInTIME,
    locale: state.get('i18n').locale,
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    onSubmit: (values) => {
      const voteLimitInTIME = values.voteLimitInTIME()
      const poll = values.set('voteLimitInTIME', voteLimitInTIME
        ? new BigNumber(voteLimitInTIME)
        : null)
      dispatch(modalsClose())
      if (props.isModify) {
        dispatch(updatePoll(poll))
      } else {
        dispatch(createPoll(poll))
      }
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_EDIT_POLL, validate })
export default class PollEditDialog extends PureComponent {
  static propTypes = {
    isModify: PropTypes.bool,
    account: PropTypes.string,
    voteLimit: PropTypes.objectOf(BigNumber),
    locale: PropTypes.string,
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

  handleOptionCreate (options) {
    options.push()
    this.setState({ selectedOptionIndex: options.length })
  }

  handleOptionRemove (options, index) {
    options.remove(index)
    if (this.state.selectedOptionIndex >= options.length) {
      this.setState({ selectedOptionIndex: options.length - 1 })
    }
  }

  renderOptions (options) {
    return (
      <div>
        <div styleName='optionsActions'>
          <FlatButton
            label={<Translate value={prefix('addOption')} />}
            styleName='optionsAction'
            onTouchTap={() => this.handleOptionCreate(options)}
          />
        </div>
        <div styleName='optionsList'>
          <div styleName='listTable'>
            {options.getAll().toArray().map((option, index) => (
              <div
                key={index}
                styleName={classnames('tableItem', { active: this.state.selectedOptionIndex === index })}
                onTouchTap={() => this.handleOptionSelect(index)}
              >
                <div styleName='itemLeft'>
                  <div styleName='symbol symbolFill'>#{index + 1}</div>
                </div>
                <div styleName='itemMain'>
                  <div styleName='mainTitle'><Translate value={prefix('optionIndex')} index={index + 1} /></div>
                  <div styleName='mainOption'>{option}</div>
                </div>
                <div styleName='itemRight'>
                  <IconButton>
                    <FontIcon className='material-icons'>mode_edit</FontIcon>
                  </IconButton>
                  <IconButton>
                    <FontIcon className='material-icons' onTouchTap={() => this.handleOptionRemove(options, index)}>delete</FontIcon>
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
    return (
      <ModalDialog>
        <PollEditForm />
      </ModalDialog>
    )
  }
}
