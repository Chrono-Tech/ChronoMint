import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RaisedButton } from 'material-ui'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import './AddTokenForm.scss'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import { IPFSImage, TokenValue } from 'components'
import BigNumber from 'bignumber.js'

const ICON = require('assets/img/icn-lhau.svg')

function prefix(token) {
  return `Assets.AddTokenForm.${token}`
}

export const FORM_ADD_TOKEN_DIALOG = 'AddTokenDialog'

function mapStateToProps(state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ADD_TOKEN_DIALOG) && form.get(FORM_ADD_TOKEN_DIALOG).get('values'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
  }
}

const validate = values => {
  const tokenSymbolErrors = new ErrorList()
  tokenSymbolErrors.add(validator.address(values.get('tokenSymbol'), true))

  const smallestUnitErrors = new ErrorList()
  smallestUnitErrors.add(validator.positiveNumber(values.get('smallestUnit')))

  const amountErrors = new ErrorList()
  if (values.get('reissuable')) {
    amountErrors.add(validator.positiveNumber(values.get('amount')))
    amountErrors.add(validator.required(values.get('amount')))
  }

  const feePercentErrors = new ErrorList()
  if (values.get('withFee')) {
    feePercentErrors.add(validator.positiveNumber(values.get('feePercent')))
    feePercentErrors.add(validator.required(values.get('feePercent')))
  }

  return {
    tokenSymbol: tokenSymbolErrors.getErrors(),
    smallestUnit: smallestUnitErrors.getErrors(),
    amount: amountErrors.getErrors(),
    feePercent: feePercentErrors.getErrors(),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_TOKEN_DIALOG, validate })
export default class AddPlatformForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    formValues: PropTypes.object,
  }

  render() {
    const withFee = this.props.formValues && this.props.formValues.get('withFee')
    const reissuable = this.props.formValues && this.props.formValues.get('reissuable')

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

          <div styleName='tokenInfoRow'>
            <IPFSImage styleName='tokenIcon' fallback={ICON} />
            <div styleName='info'>
              <div styleName='name'>MEGATOKEN</div>
              <TokenValue
                style={{ fontSize: '16px', lineHeight: '30px' }}
                value={new BigNumber(1324123)}
                symbol='MGTKN'
              />
              <div styleName='platform'>
                <div styleName='subTitle'>
                  <Translate value={prefix('platformName')} />
                </div>
                <div styleName='number'>
                  0x9876f6477iocc4757q22dfg3333nmk1111v234x0
                </div>
              </div>
            </div>
          </div>

          <Field
            component={TextField}
            name='tokenSymbol'
            fullWidth
            floatingLabelText={<Translate value={prefix('tokenSymbol')} />}
          />

          <Field
            component={TextField}
            name='description'
            fullWidth
            floatingLabelText={<Translate value={prefix('description')} />}
          />

          <div className='AddTokenForm__grid'>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={TextField}
                  name='smallestUnit'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('smallestUnit')} />}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='reissuable'
                  label={<Translate value={prefix('reissuable')} />}
                />
                <Field
                  disabled={!reissuable}
                  component={TextField}
                  name='amount'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('amount')} />}
                />
              </div>
              <div className='col-xs-12 col-sm-6'>
                <Field
                  component={Checkbox}
                  name='withFee'
                  label={<Translate value={prefix('withFee')} />}
                />
                <Field
                  disabled={!withFee}
                  component={TextField}
                  name='feePercent'
                  fullWidth
                  floatingLabelText={<Translate value={prefix('feePercent')} />}
                />
              </div>
            </div>
          </div>

          <Field
            styleName='checkboxField'
            component={Checkbox}
            name='startWithCrowdsale'
            label={<Translate value={prefix('startWithCrowdsale')} />}
          />

        </div>
        <div
          styleName='dialogFooter'
        >
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
