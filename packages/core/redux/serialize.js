/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable no-underscore-dangle */

import Immutable from 'immutable'
import { createTransform } from 'redux-persist'
import jsan from 'jsan'
import BigNumber from 'bignumber.js'
import * as models from '../models'

function mark (data, type, transformMethod) {
  return {
    data: transformMethod ? data[transformMethod]() : data,
    __serializedType__: type,
  }
}

function extract (data, type) {
  return {
    data: Object.assign({}, data),
    __serializedType__: type,
  }
}

function refer (data, type, isArray, refs) {
  const r = mark(data, type, isArray)
  if (!refs) return r
  for (let i = 0; i < refs.length; i++) {
    const ref = refs[i]
    if (typeof ref === 'function' && data instanceof ref) {
      r.__serializedRef__ = i
      return r
    }
  }
  return r
}

function serialize (Immutable, refs) {
  return {
    // eslint-disable-next-line complexity
    replacer: function (key, value) {
      if (value instanceof models.AccountModel) return null
      if (value instanceof Date) return mark(value, 'Date', 'toString')
      if (value instanceof models.WalletModel) return mark(value, 'WalletModel', 'transform')
      if (value instanceof models.MultisigEthWalletModel) return mark(value, 'MultisigEthWalletModel', 'transform')
      if (value instanceof models.TxHistoryModel) return mark(value, 'TxHistoryModel', 'transform')
      if (value instanceof models.Amount) return mark(value, 'Amount', 'transform')
      if (value instanceof BigNumber) return mark(value, 'BigNumber', 'toString')
      if (value instanceof models.BalanceModel) return refer(value, 'BalanceModel', 'toObject', refs)
      if (value instanceof models.BalancesCollection) return refer(value, 'BalancesCollection', 'toObject', refs)
      if (value instanceof models.TxModel) return refer(value, 'TxModel', 'toObject', refs)
      if (value instanceof models.TransactionsCollection) return refer(value, 'TransactionsCollection', 'toObject', refs)
      if (value instanceof models.OwnerModel) return refer(value, 'OwnerModel', 'toObject', refs)
      if (value instanceof models.OwnerCollection) return refer(value, 'OwnerCollection', 'toObject', refs)
      if (value instanceof models.TxExecModel) return refer(value, 'TxExecModel', 'toObject', refs)
      if (value instanceof models.MultisigWalletPendingTxModel) return mark(value, 'MultisigWalletPendingTxModel', 'transform')
      if (value instanceof models.AddressModel) return refer(value, 'AddressModel', 'toObject', refs)
      if (value instanceof models.AddressesCollection) return refer(value, 'AddressesCollection', 'toObject', refs)
      if (value instanceof models.DerivedWalletModel) return refer(value, 'DerivedWalletModel', 'toObject', refs)
      if (value instanceof models.MultisigWalletCollection) return refer(value, 'MultisigWalletCollection', 'toObject', refs)
      if (value instanceof models.AllowanceModel) return refer(value, 'AllowanceModel', 'toObject', refs)
      if (value instanceof models.AllowanceCollection) return mark(value, 'AllowanceCollection', 'transform')
      if (value instanceof models.MainWalletModel) return refer(value, 'MainWalletModel', 'toObject', refs)
      if (value instanceof Immutable.Record) return refer(value, 'ImmutableRecord', 'toObject', refs)
      if (value instanceof Immutable.Range) return extract(value, 'ImmutableRange')
      if (value instanceof Immutable.Repeat) return extract(value, 'ImmutableRepeat')
      if (Immutable.OrderedMap.isOrderedMap(value)) return mark(value, 'ImmutableOrderedMap', 'toObject')
      if (Immutable.Map.isMap(value)) return mark(value, 'ImmutableMap', 'toObject')
      if (Immutable.List.isList(value)) return mark(value, 'ImmutableList', 'toArray')
      if (Immutable.OrderedSet.isOrderedSet(value)) return mark(value, 'ImmutableOrderedSet', 'toArray')
      if (Immutable.Set.isSet(value)) return mark(value, 'ImmutableSet', 'toArray')
      if (Immutable.Seq.isSeq(value)) return mark(value, 'ImmutableSeq', 'toArray')
      if (Immutable.Stack.isStack(value)) return mark(value, 'ImmutableStack', 'toArray')
      return value
    },
    // eslint-disable-next-line complexity
    reviver: function (key, value) {
      if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
        const data = value.data
        switch (value.__serializedType__) {
          case 'Date':
            return new Date(data)
          case 'Amount':
            return new models.Amount(data.value, data.symbol, data.isLoaded)
          case 'BigNumber':
            return new BigNumber(data)
          case 'WalletModel':
            return new models.WalletModel(data)
          case 'MultisigEthWalletModel':
            return new models.MultisigEthWalletModel(data)
          case 'TxHistoryModel':
            return new models.TxHistoryModel(data)
          case 'BalanceModel':
            return new models.BalanceModel(data)
          case 'BalancesCollection':
            return new models.BalancesCollection(data)
          case 'TxModel':
            return new models.TxModel(data)
          case 'TransactionsCollection':
            return new models.TransactionsCollection(data)
          case 'OwnerModel':
            return new models.OwnerModel(data)
          case 'OwnerCollection':
            return new models.OwnerCollection(data)
          case 'TxExecModel':
            return new models.TxExecModel(data)
          case 'MultisigWalletPendingTxModel':
            return new models.MultisigWalletPendingTxModel(data)
          case 'AddressModel':
            return new models.AddressModel(data)
          case 'AddressesCollection':
            return new models.AddressesCollection(data)
          case 'DerivedWalletModel':
            return new models.DerivedWalletModel(data)
          case 'MultisigWalletCollection':
            return new models.MultisigWalletCollection(data)
          case 'AllowanceModel':
            return new models.AllowanceModel(data)
          case 'AllowanceCollection':
            return new models.AllowanceCollection(data)
          case 'MainWalletModel':
            return new models.MainWalletModel(data)
          case 'AccountModel':
            return null

          // Immutable types
          case 'ImmutableMap':
            return Immutable.Map(data)
          case 'ImmutableOrderedMap':
            return Immutable.OrderedMap(data)
          case 'ImmutableList':
            return Immutable.List(data)
          case 'ImmutableRange':
            return Immutable.Range(data._start, data._end, data._step)
          case 'ImmutableRepeat':
            return Immutable.Repeat(data._value, data.size)
          case 'ImmutableSet':
            return Immutable.Set(data)
          case 'ImmutableOrderedSet':
            return Immutable.OrderedSet(data)
          case 'ImmutableSeq':
            return Immutable.Seq(data)
          case 'ImmutableStack':
            return Immutable.Stack(data)
          case 'ImmutableRecord':
            return refs && refs[value.__serializedRef__]
              ? new refs[value.__serializedRef__](data)
              : Immutable.Map(data)
          default:
            return data
        }
      }
      return value
    },
  }
}

function transformer (Immutable, refs) {
  return {
    stringify: function (data) {
      return jsan.stringify(data, serialize(Immutable, refs).replacer, null, true)
    },
    parse: function (data) {
      return jsan.parse(data, serialize(Immutable, refs).reviver)
    },
    serialize: serialize,
  }
}

export default function (config = {}) {
  const serializer = transformer(Immutable, config.records)

  return createTransform(serializer.stringify, serializer.parse, config)
}
