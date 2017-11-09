import contractsManagerDAO from 'dao/ContractsManagerDAO'
import Immutable from 'immutable'
import networkService from 'Login/redux/network/actions'
import TokenModel from 'models/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { accounts, mockStore } from 'specsInit'
import * as a from './actions'

let store
const mock = new Immutable.Map({
  [DUCK_SESSION]: {
    account: accounts[0],
  },
})

describe('AssetsManager getters', () => {
  store = mockStore(mock)
  networkService
    .connectStore(store)

  it('should create platform', async (done) => {
    const watchCallback = async () => {
      await store.dispatch(a.getUsersPlatforms())
      const actions = store.getActions()
      expect(actions[0].type).toEqual(a.GET_USER_PLATFORMS)
      expect(actions[0].payload.usersPlatforms.length).toEqual(2)
      done()
    }

    const locManagerDAO = await contractsManagerDAO.getPlatformManagerDAO()
    await locManagerDAO.watchCreatePlatform(watchCallback, accounts[0])
    await store.dispatch(a.createPlatform(new Immutable.Map()))
  })

  it.skip('should create token', async (done) => {
    const actions = store.getActions()
    const platform = actions[0].payload.usersPlatforms[0]

    expect(1).toEqual(1)

    const watchCallback = async (tx) => {
      expect(tx).toBeDefined()
      done()
    }

    const platformTokenExtensionGatewayManagerEmitterDAO = await contractsManagerDAO.getPlatformTokenExtensionGatewayManagerEmitterDAO()
    await platformTokenExtensionGatewayManagerEmitterDAO.watchAssetCreate(watchCallback, accounts[0])

    store.dispatch(a.createAsset(new TokenModel({
      decimals: 11,
      name: 'QQQ',
      symbol: 'QQQ',
      balance: '11',
      icon: '',
      fee: 1,
      feeAddress: '',
      withFee: false,
      platform: platform.address,
      totalSupply: 11,
      isReissuable: true,
    })))

  })

  it('should get users Platforms', async (done) => {
    await store.dispatch(a.getUsersPlatforms())
    const actions = store.getActions()
    expect(actions[1].type).toEqual(a.GET_USER_PLATFORMS)
    expect(actions[1].payload.usersPlatforms.length).toEqual(2)
    done()
  })

  it('should get Platforms', async (done) => {
    await store.dispatch(a.getPlatforms())
    const actions = store.getActions()
    expect(actions[2].type).toEqual(a.GET_PLATFORMS)
    expect(actions[2].payload.platforms.length).toEqual(2)
    done()
  })

  it('should get AssetsManager data', async (done) => {
    await store.dispatch(a.getAssetsManagerData())
    const actions = store.getActions()

    expect(actions[3].type).toEqual(a.GET_ASSETS_MANAGER_COUNTS)
    expect(actions[3].payload.platforms.length).toEqual(2)
    expect(Object.keys(actions[3].payload.assets).length).toEqual(1)
    expect(actions[3].payload.managers.length).toEqual(2)
    done()
  })

  it('should get Tokens', async (done) => {
    await store.dispatch(a.getTokens())
    const actions = store.getActions()
    expect(actions[4].type).toEqual(a.GET_TOKENS)
    expect(actions[4].payload.tokensMap.size).toEqual(1)
    expect(Object.keys(actions[4].payload.assets).length).toEqual(1)
    done()
  })

})

