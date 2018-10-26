/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'
import { estimateBtcFee } from '@chronobank/core/redux/bitcoin/thunks'

import { FORM_SEND_TOKENS } from 'components/constants'
import BitcoinLikeBlockchainForm, { mapStateToProps } from '../BitcoinLikeBockchain/Form'
import validate from '../validate'

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateBtcFee(params)),
  }
}

const BitcoinReduxForm = reduxForm({ form: FORM_SEND_TOKENS, validate })(BitcoinLikeBlockchainForm)
export default connect(mapStateToProps, mapDispatchToProps)(BitcoinReduxForm)
