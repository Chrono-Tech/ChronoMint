/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

//#region imports
import { LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import {
  getLaborHourWeb3,
  laborHourProvider,
} from '@chronobank/login/network/LaborHourProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import web3Factory from '../../../web3'
import {
  daoByType,
  web3Selector,
  getMainLaboborHourWallet,
} from '../selectors/mainSelectors'
import {
  ATOMIC_SWAP_ERC20,
  CHRONOBANK_PLATFORM_SIDECHAIN,
  MULTI_EVENTS_HISTORY,
  TIME_HOLDER,
  LX_VALIDATOR_MANAGER,
} from '../dao/ContractList'
import ContractDAOModel from '../../../models/contracts/ContractDAOModel'
import { notify } from '../../notifier/actions'
import Amount from '../../../models/Amount'
import ERC20TokenDAO from '../../../dao/ERC20TokenDAO'
import web3Converter from '../../../utils/Web3Converter'
import TokenModel from '../../../models/tokens/TokenModel'
import ContractModel from '../../../models/contracts/ContractModel'
import {
  getEthereumSigner,
  getAddressCache,
} from '../../persistAccount/selectors'
import { WALLETS_CACHE_ADDRESS } from '../../persistAccount/constants'
import ErrorNoticeModel from '../../../models/notices/ErrorNoticeModel'
import { getMainEthWallet } from '../../wallets/selectors/models'
import * as LXSidechainActions from '../actions'
import HolderModel from '../../../models/HolderModel'
import laborHourDAO from '../../../dao/LaborHourDAO'
import { BLOCKCHAIN_LABOR_HOUR } from '../../../dao/constants'
import { getEthereumDerivedPath } from '../../ethereum/utils'
import { WalletModel } from '../../../models/index'
import { watch } from './watchers'
import { obtainAllOpenSwaps, getSwapList } from './mainnetToSidechain'
import {
  executeLaborHourTransaction,
  estimateLaborHourGas,
} from './transactions'
//#endregion
export { executeLaborHourTransaction }
export { estimateLaborHourGas }
export { obtainAllOpenSwaps }

export const initLaborHour = ({ web3 }) => async (dispatch) => {
  await dispatch(
    LXSidechainActions.updateWeb3(new HolderModel({ value: web3 }))
  )
  await dispatch(initContracts())
  await dispatch(initWalletFromKeys())
  await dispatch(initTokens())
  await dispatch(watch())
  await dispatch(getSwapList())
  await dispatch(getParams())
}

const getParams = () => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainLaboborHourWallet(state)
  const timeHolder = daoByType('TimeHolderSidechain')(state)
  const lxValidatorManager = daoByType('LXValidatorManagerSidechain')(state)

  const minDepositLimit = await timeHolder.getMiningDepositLimits(
    wallet.address
  )
  const rewardsCoefficient = await lxValidatorManager.getDefaultRewardCoefficient()
  dispatch(
    LXSidechainActions.updateDepositParams(minDepositLimit, rewardsCoefficient)
  )
}

//#region init
const initContracts = () => async (dispatch, getState) => {
  const web3 = getLaborHourWeb3(web3Selector()(getState()))
  const networkId = await web3.eth.net.getId()
  const contracts = [
    CHRONOBANK_PLATFORM_SIDECHAIN,
    ATOMIC_SWAP_ERC20,
    TIME_HOLDER,
    LX_VALIDATOR_MANAGER,
  ]
  const historyAddress = MULTI_EVENTS_HISTORY.abi.networks[networkId].address

  const getDaoModel = async (contract) => {
    const contractAddress = contract.abi.networks[networkId].address
    const contractDAO = contract.create(contractAddress, historyAddress)
    await contractDAO.connect(web3)

    dispatch(
      LXSidechainActions.daosRegister(
        new ContractDAOModel({
          contract,
          address: contractDAO.address,
          dao: contractDAO,
        })
      )
    )
  }

  await Promise.all(
    contracts.map((contract) => {
      return getDaoModel(contract)
    })
  )
}

const initTokens = () => async (dispatch, getState) => {
  dispatch(loadLHTToken())
  const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
  const symbolsCount = await platformDao.symbolsCount()
  dispatch(LXSidechainActions.setTokensFetchingCount(symbolsCount))
  const promises = []
  for (let i = 0; i < symbolsCount; i++) {
    promises.push(dispatch(loadTokenByIndex(i)))
  }
  await Promise.all(promises)
}

const loadTokenByIndex = (symbolIndex) => async (dispatch, getState) => {
  try {
    const state = getState()
    const web3 = getLaborHourWeb3(web3Selector()(getState()))
    const platformDao = daoByType('ChronoBankPlatformSidechain')(state)
    const symbol = await platformDao.symbols(symbolIndex) // bytes32
    const address = await platformDao.proxies(symbol)
    let token = new TokenModel({
      address: address.toLowerCase(),
      symbol: web3Converter.bytesToString(symbol),
      isFetched: true,
      isERC20: true,
    })
    const tokenDao = new ERC20TokenDAO(token)
    tokenDao.connect(web3)
    const decimals = await tokenDao.getDecimals()
    token = token.set('decimals', decimals)
    tokenDao.token = token

    dispatch(LXSidechainActions.tokenFetched(token))
    dispatch(
      LXSidechainActions.daosRegister(
        new ContractDAOModel({
          contract: new ContractModel({
            abi: tokenDao.abi,
            type: token.symbol(),
          }),
          address: token.address(),
          dao: tokenDao,
        })
      )
    )
    dispatch(getTokenBalance(tokenDao))
    return Promise.resolve({ e: null, res: true })
  } catch (e) {
    return Promise.resolve({ e })
  }
}

const loadLHTToken = () => async (dispatch, getState) => {
  const web3 = getLaborHourWeb3(web3Selector()(getState()))
  laborHourDAO.connect(web3)
  const token = await laborHourDAO.getToken()

  if (token) {
    dispatch(LXSidechainActions.tokenFetched(token))
    dispatch(
      LXSidechainActions.daosRegister(
        new ContractDAOModel({
          contract: new ContractModel({
            abi: laborHourDAO.abi,
            type: token.symbol(),
          }),
          address: token.address(),
          dao: laborHourDAO,
        })
      )
    )
    dispatch(getTokenBalance(laborHourDAO))
  }
}
//#endregion

export const sidechainWithdraw = (amount: Amount, token: TokenModel) => async (
  dispatch,
  getState
) => {
  try {
    const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
    const web3 = web3Factory(LABOR_HOUR_NETWORK_CONFIG)
    const mainEthWallet = getMainEthWallet(getState())

    const promises = [
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    ]
    const [chainId, nonce] = await Promise.all(promises)

    const tx = {
      ...platformDao.revokeAsset(
        web3Converter.stringToBytes(token.symbol()),
        amount
      ),
      gas: 5700000, // TODO @Abdulov remove hard code and do something
      gasPrice: 80000000000,
      nonce: nonce,
      chainId: chainId,
    }
    dispatch(executeLaborHourTransaction({ tx }))
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}

export const notifyUnknownError = () => {
  notify(
    new ErrorNoticeModel({
      title: 'errors.labotHour.unknown.title',
      message: 'errors.labotHour.unknown.message',
    })
  )
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }

  const blockchain = BLOCKCHAIN_LABOR_HOUR
  const signer = getEthereumSigner(state)

  if (!addressCache[blockchain]) {
    const path = getEthereumDerivedPath(network[blockchain])
    if (signer) {
      const address = await signer.getAddress(path).toLowerCase()
      addressCache[blockchain] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: blockchain,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[blockchain]
  const wallet = new WalletModel({
    address: address.toLowerCase(),
    blockchain: blockchain,
    isMain: true,
    walletDerivedPath: path,
  })

  laborHourProvider.subscribe(wallet.address)
  // TODO @abdulov remove console.log
  console.log('%c wallet', 'background: #222; color: #fff', wallet)
  dispatch(LXSidechainActions.updateWallet(wallet))
}

const getTokenBalance = (tokenDao) => async (dispatch, getState) => {
  const wallet = getMainLaboborHourWallet(getState())
  const balance = await tokenDao.getAccountBalance(wallet.address)
  const token = tokenDao.token

  // TODO @abdulov remove console.log
  console.log(
    '%c balance',
    'background: #222; color: #fff',
    wallet.address,
    token.removeDecimals(balance).toString(),
    token.symbol()
  )
  dispatch(
    LXSidechainActions.updateWallet(
      new WalletModel({
        ...wallet,
        balances: {
          ...wallet.balances,
          [token.symbol()]: new Amount(balance, token.symbol()),
        },
      })
    )
  )
}
