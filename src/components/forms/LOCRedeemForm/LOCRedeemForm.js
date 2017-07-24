// TODO MINT-266 New LOC
/* eslint-disable */
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import globalStyles from '../../../styles'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
import { Translate, I18n } from 'react-redux-i18n'
export const LOC_REDEEM_FORM_NAME = 'LOCRedeemForm'

const onSubmit = (values) => {
  return +values.get('amount')
}

@reduxForm({form: LOC_REDEEM_FORM_NAME, validate, onSubmit})
class LOCRedeemForm extends Component {
  render () {
    const {loc} = this.props
    const actionToken = I18n.t('locs.forms.actions.redeemed')

    return (
      <form name='LOCRedeemFormName'>

        <div style={globalStyles.greyText}>
          <p><Translate value='forms.mustBeCoSigned' /></p>
          <p><Translate value='forms.correspondingFee' /></p>
          <p><Translate
            value='locs.forms.allowedToBeS'
            action={actionToken}
            name={loc.name()}
            limit={loc.issued()}
            currency={loc.currency()}
          /></p>
        </div>

        <Field
          component={TextField}
          name='amount'
          type='number'
          floatingLabelText={<Translate value='locs.forms.amountToBeS' action={actionToken} />}
        />

      </form>
    )
  }
}

export default LOCRedeemForm
