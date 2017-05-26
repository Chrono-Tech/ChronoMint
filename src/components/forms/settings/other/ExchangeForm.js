import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { declarativeValidator } from '../../../../utils/validator'
import { I18n } from 'react-redux-i18n'

const mapStateToProps = (state) => () => {
  const settings = state.get('settingsOtherContracts').selected.settings()
  return { initialValues: {
    buyPrice: settings.buyPrice.toFixed(),
    sellPrice: settings.sellPrice.toFixed()
  }}
}

const ethPattern = '[0-9]+([\\.][0-9]{1,18})?'

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'SettingsExchangeForm',
  validate: values => { // TODO weird but if just specify validate callback without this wrapper it won't work
    let errors = declarativeValidator({
      buyPrice: 'positive-number',
      sellPrice: 'positive-number'
    })(values)

    if (!errors.sellPrice && parseFloat(values.get('sellPrice')) < parseFloat(values.get('buyPrice'))) {
      errors.sellPrice = I18n.t('errors.greaterOrEqualBuyPrice')
    }

    return errors
  }
})
class ExchangeForm extends Component {
  render () {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
          name='buyPrice'
          style={{width: '100%'}}
          floatingLabelText='Buy price in ether'
          pattern={ethPattern}
        />
        <Field component={TextField}
          name='sellPrice'
          style={{width: '100%'}}
          floatingLabelText='Sell price in ether'
          pattern={ethPattern}
        />
      </form>
    )
  }
}

export default ExchangeForm
