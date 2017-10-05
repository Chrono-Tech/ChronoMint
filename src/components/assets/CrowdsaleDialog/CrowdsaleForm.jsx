import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RaisedButton, DatePicker } from 'material-ui'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import { Field, reduxForm, change } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import './CrowdsaleForm.scss'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import { IPFSImage, TokenValue } from 'components'
import BigNumber from 'bignumber.js'

const ICON_OVERRIDES = {
  LHAU: require('assets/img/icn-lhau.svg'),
  LHEU: require('assets/img/icn-lheu.svg'),
  LHUS: require('assets/img/icn-lhus.png'),
}

function prefix (token) {
  return 'Assets.CrowdsaleForm.' + token
}

export const FORM_CROWDSALE_DIALOG = 'CrowdsaleDialog'

function mapStateToProps (state) {
  return {
    locale: state.get('i18n').locale
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    }
  }
}

const validate = (values) => {
  // eslint-disable-next-line
  console.log(values.toJS())
  const platformNameErrors = new ErrorList()
  platformNameErrors.add(validator.required(values.get('platformName')))

  const platformAddressErrors = new ErrorList()
  platformAddressErrors.add(validator.required(values.get('platformAddress')))

  return {
    platformName: platformNameErrors.getErrors(),
    platformAddress: platformAddressErrors.getErrors(),
  }
}

const onSubmit = (values, /*dispatch, props*/) => {
  // eslint-disable-next-line
  console.log('onSubmit', values)
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: FORM_CROWDSALE_DIALOG, validate, onSubmit})
export default class CrowdsaleForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    dispatch: PropTypes.func,
    locale: PropTypes.string
  }

  render () {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>

          <div styleName='leftCol'>
            <div styleName='balanceRow'>
              <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.LHAU} />
              <div styleName='title'>LHUS</div>
              <div styleName='balanceWrap'>
                <div styleName='balance'>
                  <div styleName='title'><Translate value={prefix('issuedAmount')} />:</div>
                  <TokenValue
                    style={{fontSize: '24px', lineHeight: '24px'}}
                    value={new BigNumber(1324123)}
                    symbol={'usd'}
                  />
                </div>
              </div>
            </div>

            <div styleName='crowdsaleTypeRow'>
              <div styleName='title'>
                <Translate value={prefix('crowdsaleType')} />
              </div>
              <RadioButtonGroup name='crowdsaleType'>
                <RadioButton
                  value='time'
                  label={<Translate value={prefix('timeLimited')} />}
                  onClick={(e) => {
                    this.props.dispatch(change(FORM_CROWDSALE_DIALOG, 'crowdsaleType', e.target.value))
                  }}
                />

                <RadioButton
                  value='block'
                  label={<Translate value={prefix('blockLimited')} />}
                  onClick={(e) => {
                    this.props.dispatch(change(FORM_CROWDSALE_DIALOG, 'crowdsaleType', e.target.value))
                  }}
                />
              </RadioButtonGroup>


              <Field
                component={DatePicker}
                locale={this.props.locale}
                DateTimeFormat={Intl.DateTimeFormat}
                cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
                okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
                name='startDate'
                fullWidth
                floatingLabelText={<Translate value={prefix('startDate')} />}
                style={{width: '180px'}}
              />

            </div>

          </div>
          <div styleName='rightCol'>

            <Field
              component={TextField}
              name='platformName'
              fullWidth
              floatingLabelText={<Translate value={prefix('platformName')} />} />

            <Field
              styleName='checkboxField'
              component={Checkbox}
              name='alreadyHave'
              label={<Translate value={prefix('alreadyHave')} />} />

            <Field
              component={TextField}
              name='platformAddress'
              fullWidth
              floatingLabelText={<Translate value={prefix('platformAddress')} />} />
          </div>

        </div>

        <div
          styleName='dialogFooter'>
          <RaisedButton
            styleName='action'
            label={<Translate value={prefix('dialogTitle')} />}
            type='submit'
            primary
          />
        </div>
      </form>
    )
  }
}
