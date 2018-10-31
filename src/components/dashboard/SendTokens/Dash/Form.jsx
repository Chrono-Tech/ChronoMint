/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { FormControlLabel } from '@material-ui/core'
import { Checkbox } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { estimateFee } from '@chronobank/core/redux/dash/thunks'

import { FORM_SEND_TOKENS } from 'components/constants'
import AbstractBitcoinForm, { mapStateToProps } from '../AbstractBitcoin/Form'
import { prefix } from '../lang'
import validate from '../validate'

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateFee(params)),
  }
}

class DashForm extends AbstractBitcoinForm {
  renderExtraFields () {
    return (
      <FormControlLabel
        control={<Field component={Checkbox} name='instantSend' color='primary' />}
        label={I18n.t(`${prefix}.instantSend`)}
      />
    )
  }
}

const DashReduxForm = reduxForm({ form: FORM_SEND_TOKENS, validate })(DashForm)
export default connect(mapStateToProps, mapDispatchToProps)(DashReduxForm)
