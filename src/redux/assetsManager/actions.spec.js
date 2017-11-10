import BigNumber from 'bignumber.js'
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

  it('should get users Platforms', async (done) => {
    await store.dispatch(a.getUsersPlatforms())
    const actions = store.getActions()
    const action = actions[actions.length - 1]
    expect(action.type).toEqual(a.GET_USER_PLATFORMS)
    expect(action.payload.usersPlatforms.length).toEqual(2)
    done()
  })

  it('should get Platforms', async (done) => {
    await store.dispatch(a.getPlatforms())
    const actions = store.getActions()
    const action = actions[actions.length - 1]
    expect(action.type).toEqual(a.GET_PLATFORMS)
    expect(action.payload.platforms.length).toEqual(2)
    done()
  })

  it('should get AssetsManager data', async (done) => {
    await store.dispatch(a.getAssetsManagerData())
    const actions = store.getActions()
    const action = actions[actions.length - 1]
    expect(action.type).toEqual(a.GET_ASSETS_MANAGER_COUNTS)
    expect(action.payload.platforms.length).toEqual(2)
    expect(Object.keys(action.payload.assets).length).toEqual(1)
    expect(action.payload.managers.length).toEqual(2)
    done()
  })

  it('should get Tokens', async (done) => {
    await store.dispatch(a.getTokens())
    const actions = store.getActions()
    const action = actions[actions.length - 1]
    expect(action.type).toEqual(a.GET_TOKENS)
    expect(action.payload.tokensMap.size).toEqual(1)
    expect(Object.keys(action.payload.assets).length).toEqual(1)
    done()
  })

  it('should get managers for asset symbol', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 1].payload.tokensMap.get('LHT')
    await store.dispatch(a.getManagersForAssetSymbol(token.symbol()))
    const newActions = store.getActions()
    const preLastAction = newActions[newActions.length - 2]
    const lastAction = newActions[newActions.length - 1]
    expect(preLastAction.type).toEqual(a.GET_MANAGERS_FOR_TOKEN_LOADING)
    expect(lastAction.type).toEqual(a.GET_MANAGERS_FOR_TOKEN)
    expect(lastAction.payload.symbol).toEqual('LHT')
    expect(lastAction.payload.managersForAssetSymbol.length).toEqual(2)
    done()
  })

  const manager = accounts[1]
  it('should add manager', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    const watchCallback = async (tx) => {
      expect(tx.args.to).toEqual(manager)
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchManagers(watchCallback)
    await store.dispatch(a.addManager(token, manager))
  })

  it.skip('should remove manager', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    const watchCallback = async (tx) => {
      expect(tx.args.from).toEqual(manager)
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchManagers(watchCallback)
    await store.dispatch(a.removeManager(token, manager))
  })

  // TODO fix test
  it.skip('should create token', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    const platform = token.platform()

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
      platform: platform,
      totalSupply: 11,
      isReissuable: true,
    })))
  })

  it.skip('should reissue Asset', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    const watchCallback = async (tx) => {
      expect(tx).toBeDefined()
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchIssue(watchCallback)
    await store.dispatch(a.reissueAsset(token, 0.01))
  })

  it.skip('should revoke Asset', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    const watchCallback = async (tx) => {
      expect(tx).toBeDefined()
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchRevoke(watchCallback)
    await store.dispatch(a.revokeAsset(token, 0.01))
  })

  it('should check is reissuable token', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 3].payload.tokensMap.get('LHT')
    await store.dispatch(a.isReissuable(token))
    const newActions = store.getActions()
    const lastAction = newActions[newActions.length - 1]
    expect(lastAction.type).toEqual(a.SET_IS_REISSUABLE)
    expect(lastAction.payload.symbol).toEqual('LHT')
    done()
  })

  it('should set total supply', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 4].payload.tokensMap.get('LHT')
    const testsStore = mockStore(new Immutable.Map({
      [DUCK_SESSION]: {
        account: accounts[0],
      },
      [a.DUCK_ASSETS_MANAGER]: {
        tokensMap: new Immutable.Map({
          'LHT': token,
        }),
      },
    }))

    const tokenTotalSupply = token.totalSupply()
    await testsStore.dispatch(a.setTotalSupply(token, new BigNumber(10), true))
    await testsStore.dispatch(a.setTotalSupply(token, new BigNumber(10), false))
    const newActions = testsStore.getActions()
    const preLastAction = newActions[newActions.length - 2]
    const lastAction = newActions[newActions.length - 1]
    expect(preLastAction.type).toEqual(a.SET_TOTAL_SUPPLY)
    expect(lastAction.type).toEqual(a.SET_TOTAL_SUPPLY)
    expect(preLastAction.payload.token.totalSupply()).toEqual(tokenTotalSupply.plus(token.dao().removeDecimals(10)))
    expect(lastAction.payload.token.totalSupply()).toEqual(tokenTotalSupply.minus(token.dao().removeDecimals(10)))
    done()
  })

  it('should get transactions', async (done) => {
    await store.dispatch(a.getTransactions())
    const actions = store.getActions()
    const preLastAction = actions[actions.length - 2]
    const lastAction = actions[actions.length - 1]
    expect(preLastAction.type).toEqual(a.GET_TRANSACTIONS_START)
    expect(lastAction.type).toEqual(a.GET_TRANSACTIONS_DONE)
    expect(lastAction.payload.transactionsList.length).toEqual(5)
    done()
  })

  it.skip('should set transaction', async (done) => {
    const tx = {
      logIndex: 4,
      transactionIndex: 1110,
      transactionHash: '0x7e637b7f28d93138fa2da8623b127d05d8a1de09cf814b8d40d17092886f2e0c',
      blockHash: '0x40876d791d8f16a21d19f58aa34b786a3602fdba2970a77b9032ab1a3bcb5a8d',
      blockNumber: 351,
      address: '0x9e3b716aaab6ebf12e85208c6ac364d715f62132',
      type: 'mined',
      event: 'AssetCreated',
      args:
        {
          self: '0xf5e76fd5342f132e4bb29401f029e0dd9e27fd8f',
          platform: '0x8bbe6c371a8e3f287cb849a1bfc8adfb153ee371',
          symbol: '0x4c48540000000000000000000000000000000000000000000000000000000000',
          token: '0x6da2647e384b274df69fafb8414ed9fee75f4612',
          by: '0x4b38275ff955c4d42d17aab972e32846305eb88e',
        },
    }

    await store.dispatch(a.setTx(tx))
    const actions = store.getActions()
    const lastAction = actions[actions.length - 1]
    expect(lastAction.type).toEqual(a.GET_TRANSACTIONS_DONE)
    expect(lastAction.payload.transactionsList.length).toEqual(1)
    done()
  })

  it('should set managers', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 6].payload.tokensMap.get('LHT')
    const tx = {
      logIndex: 0,
      transactionIndex: 0,
      transactionHash: '0xae72fee30afa9ecfbf10d00113e11c26759eca1c0858834bb2c20c654464cbfb',
      blockHash: '0x18e0259c3640bf0ae8e64fd3dd27f64d1db597ccb0c07f5f6e4de4eaed681c7c',
      blockNumber: 389,
      address: '0xb44ea24d1531f96f3c04606ad2cce94ff97b04bd',
      type: 'mined',
      event: 'OwnershipChange',
      args:
        {
          from: '0x0000000000000000000000000000000000000000',
          to: '0x3aafe4831ef539306da68da0b3e17597fba44942',
          symbol: '0x4c48540000000000000000000000000000000000000000000000000000000000',
        },
    }
    const testsStore = mockStore(new Immutable.Map({
      [DUCK_SESSION]: {
        account: accounts[0],
      },
      [a.DUCK_ASSETS_MANAGER]: {
        selectedToken: '',
        tokensMap: new Immutable.Map({
          'LHT': token,
        }),
      },
    }))

    await testsStore.dispatch(a.setManagers(tx))
    const newActions = testsStore.getActions()
    const lastAction = newActions[newActions.length - 1]
    expect(lastAction.type).toEqual(a.SET_NEW_MANAGERS_LIST)
    expect(lastAction.payload.managers.length).toEqual(3)
    expect(lastAction.payload.symbol).toEqual('LHT')
    expect(lastAction.payload.managersList.length).toEqual(1)
    done()
  })

  it('should get fee', async (done) => {
    const actions = store.getActions()
    const token = actions[actions.length - 6].payload.tokensMap.get('LHT')

    await store.dispatch(a.getFee(token))
    const newActions = store.getActions()
    const lastAction = newActions[newActions.length - 1]
    expect(lastAction.type).toEqual(a.SET_FEE)
    expect(lastAction.payload.symbol).toEqual(token.symbol())
    expect(lastAction.payload.fee).toEqual(1)
    expect(lastAction.payload.withFee).toEqual(true)
    done()
  })

  it('should init watchers', async (done) => {
    const testsStore = mockStore(new Immutable.Map({
      [DUCK_SESSION]: {
        account: accounts[0],
      },
    }))
    const result = await testsStore.dispatch(a.watchInitTokens())
    const newActions = testsStore.getActions()
    expect(newActions[0].type).toEqual(a.GET_ASSETS_MANAGER_COUNTS_START)
    expect(result.length).toEqual(4)
    done()
  })

})

