import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { Button } from 'components'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { I18n, Translate } from 'react-redux-i18n'
import LOCModel from 'models/LOCModel'
import validate from './validate'

import './LOCRedeemForm.scss'

export const LOC_REDEEM_FORM_NAME = 'LOCRedeemForm'

const onSubmit = (values) => +values.get('amount')

@reduxForm({ form: LOC_REDEEM_FORM_NAME, validate, onSubmit })
class LOCRedeemForm extends PureComponent {
  static propTypes = {
    loc: PropTypes.instanceOf(LOCModel),
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func,
  }

  render () {
    const { loc, pristine, handleSubmit } = this.props
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
          <Button
            label={<Translate value='locs.redeemS' asset={loc.currency()} />}
            onTouchTap={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCRedeemForm
