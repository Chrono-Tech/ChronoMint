import { omit } from 'lodash'
import { HolderModel, TxEntryModel, TxExecModel } from 'src/models'
import { WEB3_UPDATE, NONCE_UPDATE, TX_CREATE, TX_STATUS, TX_UPDATE, TX_REMOVE } from './actions'

const initialState = ({ web3 }) => ({
  web3: new HolderModel({ value: web3 }),
  nonces: {},
  pending: {},
})

const mutations = {
  [WEB3_UPDATE] (state, { web3 }) {
    return {
      ...state,
      web3: new HolderModel({ value: web3 }),
    }
  },
  [NONCE_UPDATE] (state, { address, nonce }) {
    return {
      ...state,
      nonces: {
        ...state.nonces,
        [address]: nonce,
      },
    }
  },
  [TX_CREATE] (state, { entry }) {
    const address = entry.tx.from
    const pending = state.pending
    const scope = pending[address]
    return {
      ...state,
      pending: {
        ...pending,
        [address]: {
          ...scope,
          [entry.key]: entry,
        },
      },
    }
  },
  [TX_STATUS] (state, { key, address, props }) {
    const scope = state.pending[address]
    if (!scope) { console.log('No address', address); return state }
    const entry = scope[key]
    if (!entry) { console.log('No entry', entry); return state }
    return {
      ...state,
      pending: {
        [address]: {
          ...scope,
          [key]: new TxEntryModel({
            ...entry,
            ...props,
          }),
        },
      },
    }
  },
  [TX_UPDATE] (state, { key, address, props }) {
    const scope = state.pending[address]
    if (!scope) return state
    const entry = scope[key]
    if (!entry) return state
    return {
      ...state,
      pending: {
        [address]: {
          ...scope,
          [key]: new TxEntryModel({
            ...entry,
            tx: new TxExecModel({
              ...entry.tx,
              ...props,
            }),
          }),
        },
      },
    }
  },
  [TX_REMOVE] (state, { key, address }) {
    const scope = state.pending[address]
    if (!scope) return state
    const entry = scope[key]
    if (!entry) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
}

export default ({ web3 }) => (state = initialState({ web3 }), { type, ...other }) => {
  // return [state, other]
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
