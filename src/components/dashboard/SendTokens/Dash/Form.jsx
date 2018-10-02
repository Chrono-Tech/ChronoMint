/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { estimateFee } from '@chronobank/core/redux/dash/thunks'
import BitcoinLikeBlockchainForm, { mapStateToProps } from '../BitcoinLikeBockchain/Form'

function mapDispatchToProps (dispatch) {
  return {
    estimateFee: (params) => dispatch(estimateFee(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinLikeBlockchainForm)
