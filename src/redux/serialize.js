/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import { createTransform } from 'redux-persist'
import jsan from 'jsan'
import Amount from '@chronobank/core/models/Amount'
import BalanceModel from '@chronobank/core/models/tokens/BalanceModel'
import BalancesCollection from '@chronobank/core/models/tokens/BalancesCollection'
import TxModel from '@chronobank/core/models/TxModel'
import TransactionsCollection from '@chronobank/core/models/wallet/TransactionsCollection'
import OwnerModel from '@chronobank/core/models/wallet/OwnerModel'
import OwnerCollection from '@chronobank/core/models/wallet/OwnerCollection'
import MultisigWalletPendingTxModel from '@chronobank/core/models/wallet/MultisigWalletPendingTxModel'
import TxExecModel from '@chronobank/core/models/TxExecModel'
import MultisigWalletPendingTxCollection from '@chronobank/core/models/wallet/MultisigWalletPendingTxCollection'
import AddressModel from '@chronobank/core/models/wallet/AddressModel'
import AddressesCollection from '@chronobank/core/models/wallet/AddressesCollection'
import MultisigWalletModel from '@chronobank/core/models/wallet/MultisigWalletModel'
import MultisigWalletCollection from '@chronobank/core/models/wallet/MultisigWalletCollection'
import DerivedWalletModel from '@chronobank/core/models/wallet/DerivedWalletModel'
import AllowanceCollection from '@chronobank/core/models/wallet/AllowanceCollection'
import AllowanceModel from '@chronobank/core/models/wallet/AllowanceModel'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import AccountModel from '@chronobank/core/models/wallet/persistAccount/AccountModel'

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
  let r = mark(data, type, isArray)
  if (!refs) return r
  for (let i = 0; i < refs.length; i++) {
    let ref = refs[i]
    if (typeof ref === 'function' && data instanceof ref) {
      r.__serializedRef__ = i
      return r
    }
  }
  return r
}

function serialize (Immutable, refs) {
  return {
    replacer: function (key, value) {
      if (value instanceof AccountModel) return null
      if (value instanceof Date) return mark(value, 'Date', 'toString')
      if (value instanceof Amount) return mark(value, 'Amount', 'transform')
      if (value instanceof BalanceModel) return refer(value, 'BalanceModel', 'toObject', refs)
      if (value instanceof BalancesCollection) return refer(value, 'BalancesCollection', 'toObject', refs)
      if (value instanceof TxModel) return refer(value, 'TxModel', 'toObject', refs)
      if (value instanceof TransactionsCollection) return refer(value, 'TransactionsCollection', 'toObject', refs)
      if (value instanceof OwnerModel) return refer(value, 'OwnerModel', 'toObject', refs)
      if (value instanceof OwnerCollection) return refer(value, 'OwnerCollection', 'toObject', refs)
      if (value instanceof TxExecModel) return refer(value, 'TxExecModel', 'toObject', refs)
      if (value instanceof MultisigWalletPendingTxModel) return refer(value, 'MultisigWalletPendingTxModel', 'toObject', refs)
      if (value instanceof MultisigWalletPendingTxCollection) return refer(value, 'MultisigWalletPendingTxCollection', 'toObject', refs)
      if (value instanceof AddressModel) return refer(value, 'AddressModel', 'toObject', refs)
      if (value instanceof AddressesCollection) return refer(value, 'AddressesCollection', 'toObject', refs)
      if (value instanceof MultisigWalletModel) return refer(value, 'MultisigWalletModel', 'toObject', refs)
      if (value instanceof DerivedWalletModel) return refer(value, 'DerivedWalletModel', 'toObject', refs)
      if (value instanceof MultisigWalletCollection) return refer(value, 'MultisigWalletCollection', 'toObject', refs)
      if (value instanceof AllowanceModel) return refer(value, 'AllowanceModel', 'toObject', refs)
      if (value instanceof AllowanceCollection) return refer(value, 'AllowanceCollection', 'toObject', refs)
      if (value instanceof MainWalletModel) return refer(value, 'MainWalletModel', 'toObject', refs)

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

    reviver: function (key, value) {
      if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
        let data = value.data
        switch (value.__serializedType__) {
          case 'Date':
            return new Date(data)
          case 'Amount':
            return new Amount(data.value, data.symbol, data.isLoaded)
          case 'BalanceModel':
            return new BalanceModel(data)
          case 'BalancesCollection':
            return new BalancesCollection(data)
          case 'TxModel':
            return new TxModel(data)
          case 'TransactionsCollection':
            return new TransactionsCollection(data)
          case 'OwnerModel':
            return new OwnerModel(data)
          case 'OwnerCollection':
            return new OwnerCollection(data)
          case 'TxExecModel':
            return new TxExecModel(data)
          case 'MultisigWalletPendingTxModel':
            return new MultisigWalletPendingTxModel(data)
          case 'MultisigWalletPendingTxCollection':
            return new MultisigWalletPendingTxCollection(data)
          case 'AddressModel':
            return new AddressModel(data)
          case 'AddressesCollection':
            return new AddressesCollection(data)
          case 'MultisigWalletModel':
            return new MultisigWalletModel(data)
          case 'DerivedWalletModel':
            return new DerivedWalletModel(data)
          case 'MultisigWalletCollection':
            return new MultisigWalletCollection(data)
          case 'AllowanceModel':
            return new AllowanceModel(data)
          case 'AllowanceCollection':
            return new AllowanceCollection(data)
          case 'MainWalletModel':
            return new MainWalletModel(data)
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

const transformer = (Immutable, refs) => {
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

export default function (config) {
  config = config || {}

  const serializer = transformer(Immutable, config.records)

  return createTransform(serializer.stringify, serializer.parse, config)
}
