import axios from 'axios'
import EventEmitter from 'events'

const api = axios.create({
  baseURL: 'https://testnet.blockexplorer.com/',
  timeout: 2000
})

// TODO @ipavlenko: Rename to BlockexplorerNode when add another Node implementation
export default class BitcoinNode extends EventEmitter {

  constructor () {
    super()
    // TODO @ipavlenko: Instantiate here permanent socket connection to the bitcoin Node
  }

  async getAddressInfo (address) {
    const res = await api.get(`/api/addr/${address}?noTxList=1`)
    const { balance, unconfirmedBalance } = res.data
    return {
      balance0: unconfirmedBalance,
      balance6: balance
    }
  }

  async getAddressUTXOS (address) {

    const { balance, unconfirmedBalance } = await api.get(`/api/addr/${address}/utxo`)

    return {
      balance0: unconfirmedBalance,
      balance6: balance
    }
  }

  async send (rawtx) {

    const params = new URLSearchParams()
    params.append('rawtx', rawtx)
    const response = await api.post(`/api/tx/send`, params)
    // console.log(response)
    return response
  }
}
