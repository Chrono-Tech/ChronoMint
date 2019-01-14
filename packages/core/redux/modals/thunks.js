/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getSignerModalComponentName } from '../bitcoin/selectors'
import { modalsOpen, modalsClose } from './actions'

/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const showSignerModal = () => (dispatch, getState) => {
  const modalComponentName = getSignerModalComponentName(getState())

  if (modalComponentName) {
    dispatch(modalsOpen({
      componentName: modalComponentName,
    }))
  }
}

export const closeSignerModal = () => (dispatch, getState) => {
  const modalComponentName = getSignerModalComponentName(getState())

  if (modalComponentName) {
    dispatch(modalsClose())
  }
}
