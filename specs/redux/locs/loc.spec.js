import { loc as reducer } from '../../../src/redux/locs/'

describe('single LOC reducer', () => {
  let state = reducer(undefined, {})

  it('create empty state', () => {
    expect(state).toEqual(null)
  })
})
