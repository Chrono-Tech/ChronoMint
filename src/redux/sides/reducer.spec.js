import React, { PureComponent } from 'react'

import * as actions from 'redux/sides/actions'
import reducer from 'redux/sides/reducer'

const initialState = {
  stack: [],
}

let state = null

const modals = {
  hello: {
    component: PureComponent,
    key: 'hello',
    props: {
      title: 'Hello',
    },
  },
  goodbye: {
    component: PureComponent,
    key: 'goodbye',
    props: {
      title: 'goodbye',
    },
  },
  chao: {
    component: PureComponent,
    key: 'chao',
    props: {
      title: 'Chao',
    },
  },
}

describe('sides reducer', () => {
  it('should return the initial state', () => {
    state = reducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should handle SIDES_PUSH', () => {
    state = reducer(state, {
      ...modals.hello,
      type: actions.SIDES_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...modals.hello, key: 'hello' })
  })

  it('should handle SIDES_PUSH then POP with a wrong key and finally POP with correct key', () => {
    state = reducer(state, {
      ...modals.goodbye,
      type: actions.SIDES_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...modals.goodbye, key: 'goodbye' })

    state = reducer(state, {
      key: 'wrong_goodbye',
      type: actions.SIDES_POP,
    })

    expect(state.stack.find((e) => e.key === 'goodbye').key)
      .toEqual('goodbye')

    state = reducer(state, {
      key: 'goodbye',
      type: actions.SIDES_POP,
    })

    expect(state.stack.find((e) => e.key === 'goodbye'))
      .toEqual(undefined)

  })

  it('should handle SIDES_CLEAR', () => {
    state = reducer(state, {
      type: actions.SIDES_CLEAR,
    })

    expect(state.stack.length).toEqual(0)
  })
})
