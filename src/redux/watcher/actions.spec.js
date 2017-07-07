import { store } from 'specsInit'
import * as actions from './actions'

describe('watcher actions', () => {
  it('should dispatch watcher', async () => {
    await store.dispatch(actions.watcher())
    expect(store.getActions()).toContainEqual({'type': actions.WATCHER})
  })

  it('should dispatch cbeWatcher', async () => {
    await store.dispatch(actions.cbeWatcher())
    expect(store.getActions()).toEqual([{'type': actions.WATCHER_CBE}])
  })
})
