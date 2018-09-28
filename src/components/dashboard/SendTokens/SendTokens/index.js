/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { connect } from 'react-redux'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/constants'

import SendTokens from './component'

const mapStateToProps = (state, props) => ({
  token: state.get(DUCK_TOKENS).item(props.tokenSymbol)
})

export default connect(mapStateToProps) (SendTokens)
