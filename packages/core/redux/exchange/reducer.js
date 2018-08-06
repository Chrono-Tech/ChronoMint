/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ExchangeModel from '../../models/exchange/ExchangeModel'
import ExchangesCollection from '../../models/exchange/ExchangesCollection'
import * as a from './constants'

export const initialState = new ExchangeModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.EXCHANGE_INIT:
      return state.isInited(action.isInited)
    case a.EXCHANGE_GET_ORDERS_START:
      return state.exchanges(state.exchanges().isFetched(false).isFetching(true))
    case a.EXCHANGE_GET_ORDERS_FINISH:
      return state.exchanges(action.exchanges.isFetched(true).isFetching(false)).lastPages(action.lastPages || state.lastPages)
    case a.EXCHANGE_SET_FILTER:
      return state
        .exchanges(new ExchangesCollection())
        .filter(action.filter)
        .lastPages(0)
    case a.EXCHANGE_GET_DATA_START:
      return state.isFetched(false).isFetching(true)
    case a.EXCHANGE_GET_DATA_FINISH:
      return state
        .assetSymbols(action.assetSymbols || state.assetSymbols())
        .isFetched(true).isFetching(false)
    case a.EXCHANGE_MIDDLEWARE_DISCONNECTED:
      return state
        .showFilter(false)
        .isFetched(true).isFetching(false)
    case a.EXCHANGE_REMOVE_FOR_OWNER:
      return state.exchangesForOwner(state.exchangesForOwner().remove(action.exchange))
    case a.EXCHANGE_UPDATE_FOR_OWNER:
      return state.exchangesForOwner(state.exchangesForOwner().update(action.exchange))
    case a.EXCHANGE_UPDATE:
      return state.exchanges(state.exchanges().update(action.exchange))
    case a.EXCHANGE_EXCHANGES_LIST_GETTING_START:
      return state.exchanges(state.exchanges().isFetching(true))
    case a.EXCHANGE_EXCHANGES_LIST_GETTING_FINISH:
      return state
        .exchanges(action.exchanges.isFetching(false).isFetched(true))
        .lastPages(action.lastPages)
        .pagesCount(action.pagesCount || state.pagesCount())
    case a.EXCHANGE_EXCHANGES_LIST_GETTING_FINISH_CONCAT:
      return state
        .exchanges(state.exchanges().concat(action.exchanges).isFetching(false).isFetched(true))
        .lastPages(action.lastPages)
    case a.EXCHANGE_SET_PAGES_COUNT:
      return state.pagesCount(action.count)
    case a.EXCHANGE_GET_OWNERS_EXCHANGES_START:
      return state.exchangesForOwner(state.exchangesForOwner().isFetched(false).isFetching(true))
    case a.EXCHANGE_GET_OWNERS_EXCHANGES_FINISH:
      return state.exchangesForOwner(action.exchanges.isFetched(true).isFetching(false))
    default:
      return state
  }
}
