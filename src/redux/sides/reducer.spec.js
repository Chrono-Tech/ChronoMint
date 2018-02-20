import React, { PureComponent } from 'react'

import * as actions from 'redux/sides/actions'
import reducer from 'redux/sides/reducer'

const initialState = {
  stack: [],
}

let state = null

const sides = {
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
      ...sides.hello,
      type: actions.SIDES_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...sides.hello, key: 'hello' })
  })

  it('should handle SIDES_PUSH then POP with a wrong key and finally POP with correct key', () => {
    state = reducer(state, {
      ...sides.goodbye,
      type: actions.SIDES_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...sides.goodbye, key: 'goodbye' })

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

  it('double SIDES_PUSH with the same key', () => {
    state = reducer(state, {
      ...sides.chao,
      type: actions.SIDES_PUSH,
    })

    const lengthBefore = state.stack.length
    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...sides.chao })

    state = reducer(state, {
      ...sides.chao,
      props: { title: 'some_new_title' },
      type: actions.SIDES_PUSH,
    })

    expect(state.stack.length)
      .toEqual(lengthBefore)
    expect(state.stack[state.stack.length - 1].props.title)
      .toEqual('some_new_title')

  })

  it('should handle SIDES_CLEAR', () => {
    state = reducer(state, {
      type: actions.SIDES_CLEAR,
    })

    expect(state.stack.length).toEqual(0)
  })
})
