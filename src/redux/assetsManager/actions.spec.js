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

describe('AssetsManager tests', () => {
  store = mockStore(mock)
  networkService
    .connectStore(store)

  const manager = accounts[1]
  let createdToken = null
  let createdTokenTx = null
  let addManagerTx = null

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
    await store.dispatch(a.createPlatform(new Immutable.Map({
      platformAddress: accounts[0],
    })))
  })

  it('should create token', async (done) => {
    const actions = store.getActions()
    const platform = actions[0].payload.usersPlatforms[1]

    const watchCallback = async (tx) => {
      expect(tx.args.token).toBeDefined()
      createdTokenTx = tx
      done()
    }

    const platformTokenExtensionGatewayManagerEmitterDAO = await contractsManagerDAO.getPlatformTokenExtensionGatewayManagerEmitterDAO()
    await platformTokenExtensionGatewayManagerEmitterDAO.watchAssetCreate(watchCallback, accounts[0])

    store.dispatch(a.createAsset(new TokenModel({
      decimals: 3,
      name: 'QQQ',
      symbol: 'QQQ',
      balance: 10000,
      icon: '',
      fee: 1,
      feeAddress: platform.address,
      withFee: true,
      platform: platform,
      totalSupply: 10000,
      isReissuable: true,
    })))
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
    expect(Object.keys(action.payload.assets).length).toEqual(2)
    expect(action.payload.managers.length).toEqual(2)
    done()
  })

  it('should get Tokens', async (done) => {
    await store.dispatch(a.getTokens())
    const actions = store.getActions()
    const action = actions[actions.length - 1]
    expect(action.type).toEqual(a.GET_TOKENS)
    expect(action.payload.tokensMap.size).toEqual(2)
    expect(Object.keys(action.payload.assets).length).toEqual(2)
    // set created token
    createdToken = action.payload.tokensMap.get('QQQ')
    done()
  })

  it('should get managers for asset symbol', async (done) => {
    await store.dispatch(a.getManagersForAssetSymbol(createdToken.symbol()))
    const actions = store.getActions()
    const preLastAction = actions[actions.length - 2]
    const lastAction = actions[actions.length - 1]
    expect(preLastAction.type).toEqual(a.GET_MANAGERS_FOR_TOKEN_LOADING)
    expect(lastAction.type).toEqual(a.GET_MANAGERS_FOR_TOKEN)
    expect(lastAction.payload.symbol).toEqual('QQQ')
    expect(lastAction.payload.managersForAssetSymbol.length).toEqual(1)
    done()
  })

  it('should add manager', async (done) => {
    const watchCallback = async (tx) => {
      expect(tx.args.to).toEqual(manager)
      addManagerTx = tx
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchManagers(watchCallback)
    await store.dispatch(a.addManager(createdToken, manager))
  })

  it('should remove manager', async (done) => {
    const watchCallback = async (tx) => {
      expect(tx.args.from).toEqual(manager)
      done()
    }

    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchManagers(watchCallback)
    await store.dispatch(a.removeManager(createdToken, manager))
  })

  it('should reissue Asset', async (done) => {
    const watchCallback = async (symbol) => {
      expect(symbol).toEqual(createdToken.symbol())
    }

    await store.dispatch(a.reissueAsset(createdToken, 100))
    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchIssue(watchCallback)
    done()
  })

  it('should revoke Asset', async (done) => {
    const watchCallback = async (symbol) => {
      expect(symbol).toEqual(createdToken.symbol())
    }

    await store.dispatch(a.revokeAsset(createdToken, 100))
    const chronoBankPlatformDAO = await contractsManagerDAO.getChronoBankPlatformDAO()
    await chronoBankPlatformDAO.watchRevoke(watchCallback)
    done()
  })

  it('should check is reissuable token', async (done) => {
    await store.dispatch(a.isReissuable(createdToken))
    const actions = store.getActions()
    const lastAction = actions[actions.length - 1]
    expect(lastAction.type).toEqual(a.SET_IS_REISSUABLE)
    expect(lastAction.payload.symbol).toEqual('QQQ')
    done()
  })

  it('should set total supply', async (done) => {
    const testsStore = mockStore(new Immutable.Map({
      [DUCK_SESSION]: {
        account: accounts[0],
      },
      [a.DUCK_ASSETS_MANAGER]: {
        tokensMap: new Immutable.Map({
          'QQQ': createdToken,
        }),
      },
    }))

    const tokenTotalSupply = createdToken.totalSupply()
    await testsStore.dispatch(a.setTotalSupply(createdToken, new BigNumber(10), true))
    await testsStore.dispatch(a.setTotalSupply(createdToken, new BigNumber(10), false))
    const actions = testsStore.getActions()
    const preLastAction = actions[actions.length - 2]
    const lastAction = actions[actions.length - 1]
    expect(preLastAction.type).toEqual(a.SET_TOTAL_SUPPLY)
    expect(lastAction.type).toEqual(a.SET_TOTAL_SUPPLY)
    expect(preLastAction.payload.token.totalSupply()).toEqual(tokenTotalSupply.plus(createdToken.dao().removeDecimals(10)))
    expect(lastAction.payload.token.totalSupply()).toEqual(tokenTotalSupply.minus(createdToken.dao().removeDecimals(10)))
    done()
  })

  it('should get transactions', async (done) => {
    await store.dispatch(a.getTransactions())
    const actions = store.getActions()
    const preLastAction = actions[actions.length - 2]
    const lastAction = actions[actions.length - 1]
    expect(preLastAction.type).toEqual(a.GET_TRANSACTIONS_START)
    expect(lastAction.type).toEqual(a.GET_TRANSACTIONS_DONE)
    expect(lastAction.payload.transactionsList.length).toEqual(10)
    done()
  })

  it('should set transaction', async (done) => {
    await store.dispatch(a.setTx(createdTokenTx))
    const actions = store.getActions()
    const lastAction = actions[actions.length - 1]
    expect(lastAction.type).toEqual(a.GET_TRANSACTIONS_DONE)
    expect(lastAction.payload.transactionsList.length).toEqual(1)
    done()
  })

  it('should set managers', async (done) => {
    const testsStore = mockStore(new Immutable.Map({
      [DUCK_SESSION]: {
        account: accounts[0],
      },
      [a.DUCK_ASSETS_MANAGER]: {
        selectedToken: '',
        tokensMap: new Immutable.Map({
          'QQQ': createdToken,
        }),
      },
    }))

    await testsStore.dispatch(a.setManagers(addManagerTx))
    const newActions = testsStore.getActions()
    const lastAction = newActions[newActions.length - 1]
    expect(lastAction.type).toEqual(a.SET_NEW_MANAGERS_LIST)
    expect(lastAction.payload.managers.length).toEqual(2)
    expect(lastAction.payload.symbol).toEqual('QQQ')
    expect(lastAction.payload.managersList.length).toEqual(1)
    done()
  })

  it('should get fee', async (done) => {
    await store.dispatch(a.getFee(createdToken))
    const newActions = store.getActions()
    const lastAction = newActions[newActions.length - 1]
    expect(lastAction.type).toEqual(a.SET_FEE)
    expect(lastAction.payload.symbol).toEqual(createdToken.symbol())
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
    const actions = testsStore.getActions()
    expect(actions[0].type).toEqual(a.GET_ASSETS_MANAGER_COUNTS_START)
    expect(result.length).toEqual(4)
    done()
  })
})
