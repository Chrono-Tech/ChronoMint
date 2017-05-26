import React from 'react'
import AbstractOtherContractModel from './AbstractOtherContractModel'
import DAOFactory from '../../dao/DAOFactory'
import ExchangeForm from '../../components/forms/settings/other/ExchangeForm'

class ExchangeContractModel extends AbstractOtherContractModel {
  dao () {
    return DAOFactory.initExchangeDAO(this.address())
  }

  name () {
    return 'Exchange'
  }

  buyPrice () {
    return parseInt(this.get('settings').buyPrice, 10)
  }

  sellPrice () {
    return parseInt(this.get('settings').sellPrice, 10)
  }

  form (ref, onSubmit) {
    return <ExchangeForm ref={ref} onSubmit={onSubmit} />
  }
}

export default ExchangeContractModel
