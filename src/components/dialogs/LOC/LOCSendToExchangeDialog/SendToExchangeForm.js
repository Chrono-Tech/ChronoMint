import { Field, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'

import TokenValue from 'components/common/TokenValue/TokenValue'

import validate from './validate'

import './SendToExchangeForm.scss'

const onSubmit = (values) => +values.get('sendAmount')

@reduxForm({ form: 'SendToExchangeForm', validate, onSubmit })
class SendToExchangeForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    allowed: PropTypes.object,
  }

  render () {
    const { handleSubmit, allowed } = this.props
    return (
      <form onSubmit={handleSubmit} name='SendToExchangeFormName' styleName='root'>

        <div styleName='subHeader'>
          <p><Translate value='forms.mustBeCoSigned' /></p><br />
          <p><Translate value='forms.correspondingFee' /></p><br />
          <p>Allowed to send: <TokenValue value={allowed} symbol='LHT' /></p>
        </div>

        <Field
          component={TextField}
          name='sendAmount'
          floatingLabelText='Amount to send'
        />

        <div styleName='footer'>
          <RaisedButton
            label={<Translate value='terms.send' />}
            onTouchTap={handleSubmit}
            primary
          />
        </div>

      </form>
    )
  }
}

export default SendToExchangeForm
