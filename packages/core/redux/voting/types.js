/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import { List } from 'immutable'
import Amount from '../../models/Amount'

export const PTPoll = PropTypes.shape({
  id: PropTypes.string,
  isFetched: PropTypes.bool,
  isFetching: PropTypes.bool,
  title: PropTypes.string,
  hasMember: PropTypes.bool,
  endDate: PropTypes.instanceOf(Date),
  published: PropTypes.instanceOf(Date),
  voteLimitInTIME: PropTypes.instanceOf(Amount),
  options: PropTypes.instanceOf(List),
  files: PropTypes.instanceOf(List),
  active: PropTypes.bool,
  status: PropTypes.bool,
  daysLeft: PropTypes.number,
  daysTotal: PropTypes.number,
  received: PropTypes.instanceOf(Amount),
  totalSupply: PropTypes.instanceOf(BigNumber),
  votedCount: PropTypes.instanceOf(BigNumber),
  shareholdersCount: PropTypes.instanceOf(BigNumber),
  percents: PropTypes.instanceOf(BigNumber),
  maxOptionTime: PropTypes.instanceOf(BigNumber),
  memberOption: PropTypes.number,
  voteEntries: PropTypes.arrayOf(PropTypes.object),
  description: PropTypes.string,
})
