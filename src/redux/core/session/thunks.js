/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { logout } from '@chronobank/core/redux/session/actions'
import { navigateToRoot } from 'redux/ui/navigation'

// eslint-disable-next-line import/prefer-default-export
export const logoutAndGoToRoot = () => (dispatch) => {
  dispatch(logout())
  dispatch(navigateToRoot())
}
