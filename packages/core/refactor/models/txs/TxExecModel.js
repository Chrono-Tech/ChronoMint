import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import Tx from 'ethereumjs-tx'
import ethDAO from 'packages/core/refactor/daos/lib/ETHDAO'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  block: PropTypes.string,
  hash: PropTypes.string,
  from: PropTypes.string.isRequired,
  to: PropTypes.string,
  nonce: PropTypes.number,
  data: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
  gas: PropTypes.instanceOf(BigNumber),
  gasPrice: PropTypes.instanceOf(BigNumber),
})

export default class TxExecModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get fee () {
    return this.gas != null && this.gasPrice != null // nil check
      ? ethDAO.removeDecimals(this.gas.multipliedBy(this.gasPrice))
      : new BigNumber(0)
  }

  get amount () {
    return this.value != null // nil check
      ? ethDAO.removeDecimals(this.value)
      : null
  }

  static fromWeb3 (tx, { block }) {
    const ethTx = new Tx(tx.raw)
    return new TxExecModel({
      block,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      nonce: tx.nonce,
      data: ethTx.data && ethTx.data.length
        ? ethTx.data.toString('hex')
        : null,
      value: tx.value != null
        ? new BigNumber(tx.value)
        : null,
      gas: tx.gas != null
        ? new BigNumber(tx.gas)
        : null,
      gasPrice: tx.gasPrice != null
        ? new BigNumber(tx.gasPrice)
        : null,
    })
  }
}
