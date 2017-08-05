import type ExchangeManagerDAO from 'dao/ExchangeManagerDAO'
import type ExchangeModel from 'models/ExchangeModel'
import type TokenModel from 'models/TokenModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

export const EXCHANGE_MANAGER_LIST = 'exchangeManager/LIST'
export const EXCHANGE_MANAGER_SET = 'exchangeManager/SET'
export const EXCHANGE_MANAGER_REMOVE = 'exchangeManager/REMOVE'

const getDAO = async (): Promise<ExchangeManagerDAO> => await contractsManagerDAO.getExchangeManagerDAO()

export const listExchanges = () => async (dispatch) => {
  const dao = await getDAO()
  dispatch({type: EXCHANGE_MANAGER_LIST, list: await dao.getList()})
}

export const addExchange = (address) => async () => {
  const exchange = new ExchangeModel({address, isFetching: true})
  dispatch({type: EXCHANGE_MANAGER_SET, exchange})
  try {
    const dao = await getDAO()
    await dao.addExchange(address)
  } catch (e) {
    // no rollback
  }
}

export const createExchange = (token: TokenModel) => async () => {
  try {
    const dao = await getDAO()
    await dao.createExchange(token)
  } catch (e) {
    // no rollback
  }
}

export const editExchange = (exchange: ExchangeModel, newExchange: ExchangeModel) => async () => {
  try {
    const dao = await getDAO()
    await dao.editExchange(exchange, newExchange)
  } catch (e) {
    // no rollback
  }
}

export const removeExchange = (exchange: ExchangeModel) => async () => {
  try {
    const dao = await getDAO()
    await dao.removeExchange(exchange)
  } catch (e) {
    // no rollback
  }
}

// TODO @bshevchenko: MINT-230 AssetsManager
// export const addOwner = (exchange: ExchangeModel, account) => async () => {
//   try {
//     const dao = await getDAO()
//     await dao.addOwner(exchange, account)
//   } catch (e) {
//     // no rollback
//   }
// }
//
// export const removeOwner = (exchange: ExchangeModel, account) => async () => {
//   try {
//     const dao = await getDAO()
//     await dao.removeOwner(exchange, account)
//   } catch (e) {
//     // no rollback
//   }
// }
