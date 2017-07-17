import { store } from 'specsInit'
import fakeCoinDAO from 'dao/FakeCoinDAO'
import TokenModel from 'models/TokenModel'
import * as a from './actions'

let token: TokenModel
let newToken: TokenModel

describe('settings erc20 actions', () => {
  it.skip('should add token', async () => {
    token = new TokenModel({
      symbol: 'FAKE',
      name: 'Fake',
      address: await fakeCoinDAO.getAddress(),
      decimals: 3,
      url: 'http://fakecoin.io',
      icon: 'QmaJUTXy22JyWnjoy3d34j89ifzqdwKZC2QziKWMja7GsS'
    })

    await store.dispatch(a.addToken(token))

    expect(store.getActions()).toEqual([

    ])
  })

  it.skip('should list tokens', async () => {
    await store.dispatch(a.listTokens())

    expect(store.getActions()).toEqual([

    ])
  })

  it.skip('should load token metadata in form', async () => {
    // TODO it should throw alreadyAdded error if token is already exists
    // TODO it should throw invalidAddress error if token is not valid ERC20
    // TODO it should dispatch changes for decimals and symbol fields for valid ERC20
    // TODO it should throw symbolInUse error if token symbol is already in use
  })

  it.skip('should modify token', async () => {
    newToken = token.setSymbol('CAKE')

    await store.dispatch(a.modifyToken(token, newToken))

    expect(store.getActions()).toEqual([

    ])
  })

  it.skip('should remove token', async () => {
    await store.dispatch(a.revokeToken(newToken))

    expect(store.getActions()).toEqual([

    ])
  })
})
