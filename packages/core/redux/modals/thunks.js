/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getSignerModalComponentName } from '../bitcoin/selectors'
import { modalsOpen, modalsClose } from '../modals/actions'

/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const showSignerModal = () => (dispatch, getState) => {
  const modalComponentName = getSignerModalComponentName(getState())

  if (modalComponentName) {
    dispatch(modalsOpen(modalComponentName))
  }
}

export const closeSignerModal = () => (dispatch, getState) => {
  const modalComponentName = getSignerModalComponentName(getState())

  if (modalComponentName) {
    dispatch(modalsClose(modalComponentName))
  }
}
