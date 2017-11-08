import BigNumber from 'bignumber.js'
import { Field, reduxForm, change, formPropTypes } from 'redux-form/immutable'
// import validator from 'components/forms/validator'
// import ErrorList from 'components/forms/ErrorList'
import { IPFSImage, TokenValue } from 'components'
import PropTypes from 'prop-types'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import { RaisedButton, DatePicker, FlatButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { modalsClose } from 'redux/modals/actions'
import styles from './styles'

import './CrowdsaleForm.scss'

const ICON_OVERRIDES = {
  LHAU: require('assets/img/icn-lhau.svg'),
  ETH: require('assets/img/icn-eth.png'),
  BTC: require('assets/img/icn-bitcoin.svg'),
  LTC: require('assets/img/icn-lht.svg'),
  TIME: require('assets/img/icn-time.svg'),
  LHUS: require('assets/img/icn-lhus.svg'),
  LHEU: require('assets/img/icn-lheu.svg'),
}

const CROWDSALE_COINS = Object.keys(ICON_OVERRIDES).map((coin) => coin.toLowerCase())

function prefix (token) {
  return `Assets.CrowdsaleForm.${token}`
}

export const FORM_CROWDSALE_DIALOG = 'CrowdsaleDialog'

function mapStateToProps (state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_CROWDSALE_DIALOG) && form.get(FORM_CROWDSALE_DIALOG).get('values'),
    locale: state.get('i18n').locale,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
  }
}

const validate = (/* values */) => ({})

class CrowdsaleCurrency extends PureComponent {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    currentCurrency: PropTypes.string.isRequired,
    onSelectCurrency: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onSelectCurrency(this.props.currency)
  }

  render () {
    const {
      currency,
      currentCurrency,
    } = this.props

    return (
      <button
        onClick={this.handleClick}
        styleName={classnames('currencyItem', { selected: currentCurrency === currency })}
      >
        <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES[currency.toUpperCase()]} />
        <div styleName='name'>Ethereum</div>
      </button>
    )
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CROWDSALE_DIALOG, validate })
export default class CrowdsaleForm extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    dispatch: PropTypes.func,
    locale: PropTypes.string,
    formValues: PropTypes.object,
  } & formPropTypes

  handleSelectType = (e) => {
    this.props.dispatch(change(FORM_CROWDSALE_DIALOG, 'crowdsaleType', e.target.value))
  }

  handleSelectCurrency = (value) => {
    this.props.dispatch(change(FORM_CROWDSALE_DIALOG, 'currency', value))
  }

  renderCrowdsaleCurrency = (currency) => {
    const currentCurrency = this.props.formValues && this.props.formValues.get('currency')

    return (
      <CrowdsaleCurrency
        key={currency}
        currency={currency}
        currentCurrency={currentCurrency}
        onSelectCurrency={this.handleSelectCurrency}
      />
    )
  }

  renderLeftCol () {
    return (
      <div styleName='leftCol'>
        <div styleName='balanceRow'>
          <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.LHAU} />
          <div styleName='title'>LHUS</div>
          <div styleName='balanceWrap'>
            <div styleName='balance'>
              <div styleName='title'><Translate value={prefix('issuedAmount')} />:</div>
              <TokenValue
                style={{ fontSize: '24px', lineHeight: '24px' }}
                value={new BigNumber(1324123)}
                symbol='usd'
              />
            </div>
          </div>
        </div>

        <div styleName='crowdsaleTypeRow'>
          <h3 styleName='title'>
            <Translate value={prefix('crowdsaleType')} />
          </h3>
          <RadioButtonGroup name='crowdsaleType'>
            <RadioButton
              value='time'
              label={<Translate value={prefix('timeLimited')} />}
              onClick={this.handleSelectType}
            />

            <RadioButton
              styleName='crowdsaleType'
              value='block'
              label={<Translate value={prefix('blockLimited')} />}
              onClick={this.handleSelectType}
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
            style={{ width: '180px' }}
          />

          <Field
            component={DatePicker}
            locale={this.props.locale}
            DateTimeFormat={Intl.DateTimeFormat}
            cancelLabel={<Translate value='materialUi.DatePicker.cancelLabel' />}
            okLabel={<Translate value='materialUi.DatePicker.okLabel' />}
            name='endDate'
            fullWidth
            floatingLabelText={<Translate value={prefix('endDate')} />}
            style={{ width: '180px' }}
          />
        </div>
      </div>
    )
  }

  renderRightCol () {
    let currencyAccepted = this.props.formValues && this.props.formValues.get('currencyAccepted')
    currencyAccepted = currencyAccepted && currencyAccepted.toObject()

    return (
      <div styleName='rightCol'>
        <h3 styleName='title'><Translate value={prefix('fundingTarget')} /></h3>

        <div styleName='whiteRow'>
          <div styleName='title'><Translate value={prefix('chooseCurrency')} />:</div>
          <div styleName='currenciesList'>
            {CROWDSALE_COINS.map(this.renderCrowdsaleCurrency)}
          </div>
          <div styleName='action'>
            <FlatButton
              label={<Translate value={prefix('allAvailableCurrencies')} />}
            />
          </div>
        </div>

        <div className='CrowdsaleForm__grid'>
          <div className='row'>
            <div className='col-xs-1'>
              <Field
                component={TextField}
                name='minValue'
                fullWidth
                floatingLabelText={<Translate value={prefix('minimumValue')} />}
              />
            </div>
            <div className='col-xs-1'>
              <Field
                component={TextField}
                name='maxValue'
                fullWidth
                floatingLabelText={<Translate value={prefix('maximumValue')} />}
              />
            </div>
          </div>
        </div>

        <div styleName='subTitle'><Translate value={prefix('exchangeRate')} />:</div>

        <div className='Exchange__grid'>
          <div className='row'>
            <div className='col-xs-5'>
              <Field
                component={TextField}
                name='token'
                fullWidth
                floatingLabelText={<Translate value={prefix('token')} />}
              />
            </div>
            <div className='col-xs-2' styleName='exchangeEquals'><i className='material-icons'>drag_handle</i></div>
            <div className='col-xs-5'>
              <Field
                component={TextField}
                name='startPrice'
                fullWidth
                floatingLabelText={<Translate value={prefix('startPrice')} />}
              />
            </div>
          </div>
        </div>

        <div styleName='subTitle'><Translate value={prefix('currencyAccepted')} />:</div>

        <div styleName='whiteRow'>
          <div styleName='currencyAcceptedList'>
            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'eth') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.eth'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.ETH} />
                    <div styleName='name'>Ethereum</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>

            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'time') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.time'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.TIME} />
                    <div styleName='name'>TIME</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>

            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'btc') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.btc'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.BTC} />
                    <div styleName='name'>Bitcoin</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>

            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'lheu') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.lheu'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.LHEU} />
                    <div styleName='name'>lheu</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>

            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'ltc') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.ltc'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.LTC} />
                    <div styleName='name'>litecoin</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>

            <div styleName={classnames('currencyAcceptedItem', { selected: get(currencyAccepted, 'lhus') })}>
              <Field
                component={Checkbox}
                labelPosition='left'
                iconStyle={styles.checkbox.iconStyle}
                labelStyle={styles.checkbox.labelStyle}
                name='currencyAccepted.lhus'
                label={(
                  <div styleName='checkboxLabel'>
                    <IPFSImage styleName='tokenIcon' fallback={ICON_OVERRIDES.LHUS} />
                    <div styleName='name'>LHUS</div>
                    <div styleName='checkbox' />
                  </div>
                )}
              />
            </div>
          </div>
          <div styleName='action'>
            <FlatButton
              label={<Translate value={prefix('allAvailableCurrencies')} />}
            />
          </div>
        </div>

        <div styleName='dialogFooter'>
          <RaisedButton
            styleName='action'
            label={<Translate value={prefix('confirmAndStart')} />}
            type='submit'
            primary
          />
        </div>
      </div>
    )
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
          {this.renderLeftCol()}
          {this.renderRightCol()}
        </div>
      </form>
    )
  }
}
