import AbstractProvider from './AbstractProvider'
import selector from './NemNode'

export class NemProvider extends AbstractProvider {
  // TODO @dkchv: continue to implement it

  // TODO @dkchv: overrided for avoid subscription until set node settings @see ./NemNode
  // eslint-disable-next-line
  subscribe (engine) {}
  // eslint-disable-next-line
  unsubscribe (engine) {}
}

export const nemProvider = new NemProvider(selector)
