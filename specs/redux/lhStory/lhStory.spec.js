import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {List} from 'immutable'
import reducer, * as actions from '../../../src/redux/lhStory/lhStory'

const mockStore = configureMockStore([thunk])
let store = null

let list = new List()
list = list.set(0, 'Abc')
list = list.set(1, 'Xyz')

describe('lhStory', () => {
  beforeEach(() => {
    store = mockStore()
    window.localStorage.clear()
  })

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      list: new List()
    })
  })

  it('should handle LH_STORY_LIST', () => {
    expect(
      reducer([], {type: actions.LH_STORY_LIST, list})
    ).toEqual({
      list
    })
  })

  it('should list lh story', () => {
    store.dispatch(actions.listStory())
    expect(store.getActions()).toEqual([
      {type: actions.LH_STORY_LIST, list: store.getActions()[0].list}
    ])
  })
})
