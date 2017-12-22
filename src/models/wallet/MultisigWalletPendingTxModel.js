import TxExecModel from 'models/TxExecModel'
import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from '../AbstractFetchingModel'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  to: null,
  value: new BigNumber(0),
  isConfirmed: false,
  decodedTx: new TxExecModel(), // decoded data
}) {
  id () {
    return this.get('id') || Math.random()
  }

  to () {
    return this.get('to')
  }

  value () {
    return this.get('value')
  }

  isConfirmed (value: boolean) {
    return this._getSet('isConfirmed', value)
  }

  decodedTx (value) {
    return this._getSet('decodedTx', value)
  }

  txRevokeSummary () {
    return {
      to: this.to(),
      value: this.value(),
    }
  }

  title () {
    return this.decodedTx().title()
  }

  details () {
    return this.decodedTx().details()
  }
}

export default MultisigWalletPendingTxModel
