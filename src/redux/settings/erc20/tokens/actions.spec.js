import { store } from 'specsInit'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import fakeCoinDAO from 'dao/FakeCoinDAO'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import TokenModel from 'models/TokenModel'
import type TokenNoticeModel from 'models/notices/TokenNoticeModel'
import { TIME } from 'redux/mainWallet/actions'
import * as a from './actions'

let token: TokenModel | AbstractFetchingModel
let newToken: TokenModel | AbstractFetchingModel

describe('settings erc20 actions', () => {
  afterEach(async (done) => {
    await setTimeout(() => {
      done()
    }, 3000)
  })
  it('should dispatch changes for decimals and symbol fields for valid ERC20', async () => {
    await a.formTokenLoadMetaData(new TokenModel({
      address: await fakeCoinDAO.getAddress(),
    }), store.dispatch, 'TEST')

    expect(store.getActions()[ 1 ].payload).toMatchSnapshot()
    expect(store.getActions()[ 2 ].payload).toMatchSnapshot()
  })

  it('should throw symbolInUse error if token symbol is already in use', async () => {
    try {
      await a.formTokenLoadMetaData(new TokenModel({
        address: await fakeCoinDAO.getAddress(),
        symbol: TIME,
      }), store.dispatch, 'TEST')
    } catch (e) {
      expect(e).toMatchSnapshot()
    }
  })

  it('should add token', async (done) => {
    token = new TokenModel({
      symbol: 'FAKE',
      name: 'Fake',
      address: await fakeCoinDAO.getAddress(),
      decimals: 3,
      url: 'http://fakecoin.io',
      icon: 'QmaJUTXy22JyWnjoy3d34j89ifzqdwKZC2QziKWMja7GsS',
    })

    const dao = await contractsManagerDAO.getERC20ManagerDAO()
    await dao.watchAdd((notice: TokenNoticeModel) => {
      expect(store.getActions()[ 0 ].token.address(null)).toMatchSnapshot()
      expect(notice.isRemoved()).toMatchSnapshot()
      expect(notice.token().address(null)).toMatchSnapshot()
      done()
    })

    await store.dispatch(a.addToken(token))
  })

  it('should list tokens', async () => {
    await store.dispatch(a.listTokens())
    expect(store.getActions()[ 0 ].list.get(token.symbol()).address(null)).toMatchSnapshot()
  })

  it('should throw invalidAddress error if token is not valid ERC20', async () => {
    try {
      await a.formTokenLoadMetaData(new TokenModel({
        address: '0xc38f003c0a14a05f11421d793edc9696a25cb2b3',
      }), store.dispatch, 'TEST')
    } catch (e) {
      expect(e).toMatchSnapshot()
    }
  })

  it('should modify token', async (done) => {
    newToken = token.setSymbol('FAKE')
    const result = await store.dispatch(a.modifyToken(token, newToken))
    expect(result).toMatchSnapshot()
    done()
  })

  it('should remove token', async (done) => {
    const dao = await contractsManagerDAO.getERC20ManagerDAO()
    await dao.watchRemove((notice: TokenNoticeModel) => {
      expect(store.getActions()).toMatchSnapshot()
      expect(notice.isRemoved()).toMatchSnapshot()
      expect(notice.token()).toMatchSnapshot()
      done()
    })
    await store.dispatch(a.revokeToken(newToken))
  })
})
