import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import AbstractModel from '../AbstractModel'
import PocketModel from './PocketModel'

const schemaFactory = () => ({
  pocket: PropTypes.instanceOf(PocketModel).isRequired,
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  value: PropTypes.instanceOf(BigNumber),
})

export default class BalanceModel extends AbstractModel {
  constructor (props) {
    super(Object.assign({
      isLoading: true,
      isLoaded: false,
      value: null,
    }, props), schemaFactory())
    Object.assign(this, {
      isLoading: true,
      isLoaded: false,
      value: null,
    }, props)
    Object.freeze(this)
  }

  get amount () {
    return this.pocket.token.dao.removeDecimals(this.value)
  }

  loaded (value) {
    return new BalanceModel({
      pocket: this.pocket,
      isLoaded: true,
      isLoading: false,
      value,
    })
  }

  loading () {
    return new BalanceModel({
      pocket: this.pocket,
      isLoaded: this.isLoaded,
      isLoading: true,
      value: this.value,
    })
  }
}
