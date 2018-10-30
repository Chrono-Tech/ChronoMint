/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { LHT } from '@chronobank/core/dao/constants'
import { estimateLaborHourGasTransfer } from '@chronobank/core/redux/tokens/thunks'

import Form, { mapStateToProps as mapFormStateToProps } from '../AbstractEthereum/Form'
import FormContainer, {
  mapStateToProps as mapContainerStateToProps,
  mapDispatchToProps
} from '../AbstractEthereum/FormContainer'

function mapFormDispatchToProps (dispatch) {
  return {
    estimateGas: (tokenId, params, gasPriceMultiplier, address) => (
      dispatch(estimateLaborHourGasTransfer(tokenId, params, gasPriceMultiplier, address))
    ),
  }
}

const LaborHourForm = connect(mapFormStateToProps, mapFormDispatchToProps)(Form)

export function mapStateToProps (state, props) {
  const fields = mapContainerStateToProps(state, props)
  fields.form = LaborHourForm
  fields.symbol = LHT
  return fields
}

export default connect(mapStateToProps, mapDispatchToProps)(FormContainer)
