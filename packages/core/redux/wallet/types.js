/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable import/prefer-default-export */

import PropTypes from 'prop-types'
import Amount from '../../models/Amount'

export const PTWallet = PropTypes.shape({
  address: PropTypes.string,
  blockchain: PropTypes.string,
  name: PropTypes.string,
  requiredSignatures: PropTypes.string,
  pendingCount: PropTypes.number,
  isMultisig: PropTypes.bool,
  isTimeLocked: PropTypes.bool,
  is2FA: PropTypes.bool,
  isDerived: PropTypes.bool,
  owners: PropTypes.arrayOf(PropTypes.string),
  customTokens: PropTypes.arrayOf(PropTypes.string),
  releaseTime: PropTypes.instanceOf(Date),
  amount: PropTypes.instanceOf(Amount),
  isMain: PropTypes.bool,
})
