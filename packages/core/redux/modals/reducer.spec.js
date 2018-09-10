/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { PureComponent } from 'react'

import * as actions from './actions'
import reducer from './reducer'

const initialState = {
  stack: [],
  counter: 0,
}

let state = null

const modals = {

  hello: {
    component: PureComponent,
    props: {
      title: 'Hello',
    },
  },
  goodby: {
    component: PureComponent,
    props: {
      title: 'Goodby',
    },
  },
  chao: {
    component: PureComponent,
    props: {
      title: 'Chao',
    },
  },
}

describe('modals reducer', () => {
  it('should return the initial state', () => {
    state = reducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should handle MODALS_PUSH', () => {
    state = reducer(state, {
      ...modals.hello,
      type: actions.MODALS_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...modals.hello, key: state.counter - 1 })
  })

  it('should handle MODALS_PUSH again', () => {
    state = reducer(state, {
      ...modals.goodby,
      type: actions.MODALS_PUSH,
    })

    expect(state.stack[state.stack.length - 1])
      .toEqual({ ...modals.goodby, key: state.counter - 1 })
  })

  it('should handle MODALS_POP', () => {
    state = reducer(state, {
      type: actions.MODALS_POP,
    })

    const peak = state.stack[state.stack.length - 1]
    expect(peak.component).toEqual(modals.hello.component)
    expect(peak.props).toEqual(modals.hello.props)
  })

  it('should handle MODALS_REPLACE again', () => {
    const length = state.stack.length

    state = reducer(state, {
      ...modals.chao,
      type: actions.MODALS_REPLACE,
    })

    const peak = state.stack[state.stack.length - 1]
    expect(peak.component).toEqual(modals.chao.component)
    expect(peak.props).toEqual(modals.chao.props)
    expect(state.stack.length).toEqual(length)
  })

  it('should handle MODALS_CLEAR', () => {
    state = reducer(state, {
      type: actions.MODALS_CLEAR,
    })

    expect(state.stack.length).toEqual(0)
  })
})
