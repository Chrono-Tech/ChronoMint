import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { declarativeValidator } from '../../../../utils/validator'
import { I18n } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsOtherContracts').selected.settings()
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({
  form: 'SettingsExchangeForm',
  validate: values => { // TODO weird but if just specify validate callback without this wrapper it won't work
    let errors = declarativeValidator({
      buyPrice: 'positive-number',
      sellPrice: 'positive-number'
    })(values)

    if (!errors.sellPrice && parseInt(values.get('sellPrice'), 10) < parseInt(values.get('buyPrice'), 10)) {
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
          floatingLabelText='Buy price in wei'
        />
        <Field component={TextField}
          name='sellPrice'
          style={{width: '100%'}}
          floatingLabelText='Sell price in wei'
        />
      </form>
    )
  }
}

export default ExchangeForm
