import AbstractContractDAO from './AbstractContractDAO'
import AbstractOtherContractModel from '../models/contracts/AbstractOtherContractModel'

class AbstractOtherContractDAO extends AbstractContractDAO {
  constructor (json, at = null) {
    if (new.target === AbstractOtherContractDAO) {
      throw new TypeError('Cannot construct AbstractOtherContractDAO instance directly')
    }
    super(json, at)
  }

  /** @returns {string} */
  static getTypeName () {
    throw new Error('should be overridden')
  }

  /** @returns {object} for truffleContract */
  static getJson () {
    throw new Error('should be overridden')
  }

  /**
   * @returns {class} model class, not instance! child of...
   * @see AbstractOtherContractModel
   */
  static getContractModel () {
    throw new Error('should be overridden')
  }

  /** @returns {Promise<AbstractOtherContractModel>} */
  initContractModel () {
    throw new Error('should be overridden')
  }

  retrieveSettings () {
    return new Promise(resolve => resolve({}))
  }

  // noinspection JSUnusedLocalSymbols
  /**
   * @param model
   * @returns {Promise<bool>} result
   */
  saveSettings (model: AbstractOtherContractModel) {
    return new Promise(resolve => resolve(true))
  }
}

export default AbstractOtherContractDAO
