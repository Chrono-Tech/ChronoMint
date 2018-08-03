import PropTypes from 'prop-types'
import { Amount } from './'
import AbstractModel from './AbstractModel'
import { decodeTxData } from '../utils/DecodeUtils'

const schemaFactory = () => ({
  name: PropTypes.string,
  hash: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  address: PropTypes.string,
  contract: PropTypes.string,
  amount: PropTypes.instanceOf(Amount),
  fee: PropTypes.instanceOf(Amount),
  params: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string(),
      type: PropTypes.string(),
      value: PropTypes.any(),
    }),
  ),
  details: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string(),
      type: PropTypes.string(),
      value: PropTypes.any(),
    }),
  ),
})

export default class TxDescModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory(), options)
    Object.freeze(this)
  }

  static fromWeb3 ({ account, tx, getAbi, getToken }) {
    const to = tx.to.toLowerCase()
    const eth = getToken() // TokenModel {dao, token}
    const token = getToken(to) // TokenModel {dao, token}

    const abi = getAbi(to) // JSON from dao
    const data = abi != null && tx.data != null // nil check
      ? decodeTxData(abi.value.abi, tx.data)
      : (tx.data != null ? { name: 'Unknown contract' } : null)
    const dao = token != null
      ? token.dao // token dao
      : eth.dao // token dao
    const info = dao.describeTx(account.toLowerCase(), token, abi, eth, tx, data)
    return new TxDescModel(info)
  }
}
