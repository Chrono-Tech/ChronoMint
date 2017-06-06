import { store } from '../init'
import * as actions from '../../src/redux/watcher'

describe('watcher', () => {
  it('should dispatch watcher', () => {
    store.dispatch(actions.watcher())
    expect(store.getActions()).toContainEqual({'type': actions.WATCHER})
  })

  it.skip('should dispatch cbeWatcher', () => {
    store.dispatch(actions.cbeWatcher())
    expect(store.getActions()).toEqual([{'type': actions.WATCHER_CBE}])
  })
})
