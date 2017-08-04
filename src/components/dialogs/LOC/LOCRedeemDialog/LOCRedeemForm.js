import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import { Translate, I18n } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import validate from './validate'
export const LOC_REDEEM_FORM_NAME = 'LOCRedeemForm'
import './LOCRedeemForm.scss'
import { RaisedButton } from 'material-ui'

const onSubmit = (values) => {
  return +values.get('amount')
}

@reduxForm({form: LOC_REDEEM_FORM_NAME, validate, onSubmit})
class LOCRedeemForm extends Component {
  static propTypes = {
    loc: PropTypes.object,
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func
  }

  render () {
    const {loc, pristine, handleSubmit} = this.props
    const actionToken = I18n.t('locs.forms.actions.redeemed')

    return (
      <form name='LOCRedeemFormName' onSubmit={handleSubmit}>

        <div styleName='subHeader'>
          <p><Translate value='forms.mustBeCoSigned' /></p>
          <p><Translate value='forms.correspondingFee' /></p>
        </div>

        <Field
          component={TextField}
          name='amount'
          type='number'
          floatingLabelText={<Translate value='locs.forms.amountToBeS' action={actionToken} />}
        />

        <div styleName='footer'>
          <RaisedButton
            label={<Translate value='locs.redeemS' asset={loc.currency()} />}
            primary
            onTouchTap={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCRedeemForm
