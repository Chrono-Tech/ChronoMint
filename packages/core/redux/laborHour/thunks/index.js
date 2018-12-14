/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

//#region imports
import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { TIME } from '@chronobank/login/network/constants'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { getNetworkById, LABOR_HOUR_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import {
  daoByType,
  getLXToken,
  web3Selector,
} from '../selectors/mainSelectors'
import {
  ATOMIC_SWAP_ERC20,
  CHRONOBANK_PLATFORM_SIDECHAIN,
  LX_VALIDATOR_MANAGER,
  MULTI_EVENTS_HISTORY,
  TIME_HOLDER,
} from '../dao/ContractList'
import tokenService from '../../../services/TokenService'
import ContractDAOModel from '../../../models/contracts/ContractDAOModel'
import { notify } from '../../notifier/actions'
import ERC20TokenDAO from '../../../dao/ERC20TokenDAO'
import web3Converter from '../../../utils/Web3Converter'
import TokenModel from '../../../models/tokens/TokenModel'
import ContractModel from '../../../models/contracts/ContractModel'
import { getAddressCache } from '../../persistAccount/selectors'
import { DUCK_PERSIST_ACCOUNT, WALLETS_CACHE_ADDRESS } from '../../persistAccount/constants'
import ErrorNoticeModel from '../../../models/notices/ErrorNoticeModel'
import * as LXSidechainActions from '../actions'
import HolderModel from '../../../models/HolderModel'
import laborHourDAO from '../../../dao/LaborHourDAO'
import { BLOCKCHAIN_LABOR_HOUR, EVENT_NEW_BLOCK } from '../../../dao/constants'
import { getEthereumDerivedPath } from '../../ethereum/utils'
import { WalletModel } from '../../../models/index'
import { watch } from './watchers'
import { getSwapList, obtainAllMainnetOpenSwaps } from './mainnetToSidechain'
import { obtainAllLXOpenSwaps } from './sidechainToMainnet'
import {
  estimateLaborHourGas,
  executeLaborHourTransaction,
  getTokenBalance,
} from './transactions'
import web3Factory from '../../../../core/web3'
import { getWalletsByBlockchain } from '../../wallets/selectors/models'
import { WALLETS_UNSET } from '../../wallets/constants'
import { getEthereumSigner } from '../../ethereum/selectors'
//#endregion

export { executeLaborHourTransaction }
export { estimateLaborHourGas }
export { obtainAllMainnetOpenSwaps }
export { obtainAllLXOpenSwaps }

export const enableLaborHour = () => async (dispatch, getState) => {
  const state = getState()
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }

  const lhtNetwork = network[BLOCKCHAIN_LABOR_HOUR]
    ? network[BLOCKCHAIN_LABOR_HOUR]
    : LABOR_HOUR_NETWORK_CONFIG[BLOCKCHAIN_LABOR_HOUR]
  dispatch(initLaborHour({ web3: web3Factory(lhtNetwork) }))
}

export const disableLaborHour = () => async (dispatch, getState) => {
  const wallets = getWalletsByBlockchain(BLOCKCHAIN_LABOR_HOUR)(getState())

  wallets.forEach((wallet) => {
    laborHourProvider.unsubscribe(wallet.address)
    dispatch({ type: WALLETS_UNSET, wallet })
  })

  laborHourDAO.removeAllListeners()
  laborHourDAO.disconnect()
}

export const initLaborHour = ({ web3 }) => async (dispatch) => {
  await dispatch(LXSidechainActions.updateWeb3(new HolderModel({ value: web3 })))
  await dispatch(initContracts())
  await dispatch(initWalletFromKeys())
  await dispatch(initTokens())
  await dispatch(watch())
  await dispatch(getSwapList())
  await dispatch(getParams())
  // await dispatch(obtainAllMainnetOpenSwaps())
  // await dispatch(obtainAllLXOpenSwaps())
}

const getParams = () => async (dispatch, getState) => {
  const state = getState()
  const lxTimeToken = getLXToken(TIME)(state)
  const timeHolder = daoByType('TimeHolderSidechain')(state)
  const lxValidatorManager = daoByType('LXValidatorManagerSidechain')(state)

  const minDepositLimit = await timeHolder.getMiningDepositLimits(lxTimeToken.address())
  const rewardsCoefficient = await lxValidatorManager.getDefaultRewardCoefficient()
  dispatch(
    LXSidechainActions.updateMiningParams(minDepositLimit, rewardsCoefficient),
  )
}

//#region init
const initContracts = () => async (dispatch, getState) => {
  const web3 = web3Selector()(getState())
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
        }),
      ),
    )
  }

  await Promise.all(
    contracts.map((contract) => {
      return getDaoModel(contract)
    }),
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
  dispatch(watchLatestBlock())
}

const loadTokenByIndex = (symbolIndex) => async (dispatch, getState) => {
  try {
    const state = getState()
    const web3 = web3Selector()(getState())
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

    tokenService.registerDAO(token, tokenDao)
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
        }),
      ),
    )
    dispatch(getTokenBalance(tokenDao))
    return Promise.resolve({ e: null, res: true })
  } catch (e) {
    return Promise.resolve({ e })
  }
}

const loadLHTToken = () => async (dispatch, getState) => {
  const web3 = web3Selector()(getState())
  laborHourDAO.connect(web3)
  const token = await laborHourDAO.getToken()

  if (token) {
    tokenService.registerDAO(token, laborHourDAO)
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
        }),
      ),
    )
    dispatch(getTokenBalance(laborHourDAO))
  }
}
//#endregion

export const notifyUnknownError = () => {
  notify(
    new ErrorNoticeModel({
      title: 'errors.labotHour.unknown.title',
      message: 'errors.labotHour.unknown.message',
    }),
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
  dispatch(LXSidechainActions.updateWallet(wallet))
}

export const watchLatestBlock = () => async (dispatch) => {

  laborHourDAO
    .on(EVENT_NEW_BLOCK, (block) => {
      dispatch(LXSidechainActions.setLatestBlock(BLOCKCHAIN_LABOR_HOUR, block))
    })

  const block = await laborHourDAO.getBlockNumber()
  dispatch(LXSidechainActions.setLatestBlock(BLOCKCHAIN_LABOR_HOUR, { blockNumber: block }))
}
