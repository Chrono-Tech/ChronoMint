/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * C - constants
 * A - action
 * S - state
*/

import * as C from './constants'

const initialState = {
  stack: [],
  counter: 0,
}

export default (S = initialState, A) => {
  switch (A.type) {
    case C.MODALS_OPEN:
      return {
        ...S,
        counter: S.counter + 1,
        stack: [
          ...S.stack, {
            key: S.counter,
            componentName: A.componentName,
            props: A.props,
          }
        ],
      }
    case C.MODALS_CLOSE:
      return {
        ...S,
        stack: S.stack.slice(0, -1),
      }
    case C.MODALS_REPLACE:
      return {
        ...S,
        stack: [
          ...S.stack.slice(0, -1),
          {
            key: S.counter,
            componentName: A.componentName,
            props: A.props,
          }
        ],
      }
    case C.MODALS_CLEAR:
      return {
        ...S,
        stack: [],
      }
    default:
      return S
  }
}
