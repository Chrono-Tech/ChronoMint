import { I18n } from 'react-redux-i18n'
import { store } from 'specsInit'
import type AbstractFetchingModel from 'models/AbstractFetchingModel'
import type TokenNoticeModel from 'models/notices/TokenNoticeModel'
import TokenModel from 'models/TokenModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import fakeCoinDAO from 'dao/FakeCoinDAO'
import * as a from './actions'
import { TIME } from 'redux/wallet/actions'

let token: TokenModel | AbstractFetchingModel
let newToken: TokenModel | AbstractFetchingModel

describe('settings erc20 actions', () => {
  it('should dispatch changes for decimals and symbol fields for valid ERC20', async () => {
    await a.formTokenLoadMetaData(new TokenModel({
      address: await fakeCoinDAO.getAddress(),
    }), store.dispatch, 'TEST')

    expect(store.getActions()[1].payload).toEqual(4)
    expect(store.getActions()[2].payload).toEqual('FAKE')
  })

  it('should throw symbolInUse error if token symbol is already in use', async () => {
    try {
      await a.formTokenLoadMetaData(new TokenModel({
        address: await fakeCoinDAO.getAddress(),
        symbol: TIME,
      }), store.dispatch, 'TEST')
    } catch (e) {
      expect(e).toEqual({ symbol: I18n.t('settings.erc20.tokens.errors.symbolInUse') })
    }
  })

  it('should add token', async resolve => {
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
      // eslint-disable-next-line
      console.log('Handled!!!', notice)

      expect(store.getActions()[0].token).toEqual(token.fetching())

      expect(notice.isRemoved()).toBeFalsy()
      // eslint-disable-next-line
      console.log(notice)
      expect(notice.token()).toEqual(token)
      resolve()
    })

    await store.dispatch(a.addToken(token))
  })

  it('should list tokens', async () => {
    await store.dispatch(a.listTokens())
    expect(store.getActions()[0].list.get(token.symbol())).toEqual(token)
  })

  it('should throw invalidAddress error if token is not valid ERC20', async () => {
    try {
      await a.formTokenLoadMetaData(new TokenModel({
        address: '0xc38f003c0a14a05f11421d793edc9696a25cb2b3',
      }), store.dispatch, 'TEST')
    } catch (e) {
      expect(e).toEqual({ address: I18n.t('settings.erc20.tokens.errors.invalidAddress') })
    }
  })

  it('should modify token', async resolve => {
    newToken = token.setSymbol('CAKE')

    const dao = await contractsManagerDAO.getERC20ManagerDAO()
    await dao.watchModify((notice: TokenNoticeModel) => {
      expect(store.getActions()).toEqual([
        { type: a.TOKENS_SET, token: token.fetching() },
        { type: a.TOKENS_REMOVE, token },
      ])

      expect(notice.isModified()).toBeTruthy()
      expect(notice.token()).toEqual(newToken)
      expect(notice.oldAddress()).toEqual(token.address())
      resolve()
    })

    await store.dispatch(a.modifyToken(token, newToken))
  })

  it('should remove token', async resolve => {
    const dao = await contractsManagerDAO.getERC20ManagerDAO()
    await dao.watchRemove((notice: TokenNoticeModel) => {
      expect(store.getActions()).toEqual([
        { type: a.TOKENS_SET, token: newToken.fetching() },
      ])

      expect(notice.isRemoved()).toBeTruthy()
      expect(notice.token()).toEqual(newToken)
      resolve()
    })

    await store.dispatch(a.revokeToken(newToken))
  })
})
