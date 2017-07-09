import { abstractModel } from './AbstractModel'
import BigNumber from 'bignumber.js'

class TxPluralModel extends abstractModel({
  gasLeft: new BigNumber(0),
  gasLimit: null,
  gasFee: null,
  estimateGas: null,
  step: null,
  totalSteps: null
}) {
  /**
   * @param estimateGas array of results of the...
   * @see AbstractContractDAO._estimateGas
   */
  constructor (estimateGas: Array<Object> = []) {
    if (estimateGas.length < 2) {
      throw new Error('invalid plural model')
    }
    super({
      step: 1,
      gasLeft: estimateGas.reduce((a, b) => a.gasFee.plus(b.gasFee)),
      gasLimit: estimateGas[0].gasLimit,
      gasFee: estimateGas[0].gasFee.toNumber(),
      totalSteps: estimateGas.length,
      estimateGas
    })
  }

  gasLeft () {
    return this.get('gasLeft').toNumber()
  }

  gasLimit () {
    return this.get('gasLimit')
  }

  gasFee () {
    return this.get('gasFee')
  }

  step () {
    return this.get('step')
  }

  totalSteps () {
    return this.get('totalSteps')
  }

  makeStep (): TxPluralModel {
    if (this.step() >= this.totalSteps()) {
      throw new Error('steps are over')
    }
    let model = this.set('step', this.step() + 1)
    model = model.set(
      'gasLimit',
      this.get('estimateGas')[this.step()].gasLimit
    )
    model = model.set(
      'gasFee',
      this.get('estimateGas')[this.step()].gasFee.toNumber()
    )
    return model.set(
      'gasLeft',
      this.get('gasLeft').minus(this.get('estimateGas')[this.step() - 1].gasFee)
    )
  }
}

export default TxPluralModel
