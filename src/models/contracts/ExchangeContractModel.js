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
    return this.get('settings').buyPrice
  }

  sellPrice () {
    return this.get('settings').sellPrice
  }

  form (ref, onSubmit) {
    return <ExchangeForm ref={ref} onSubmit={onSubmit} />
  }
}

export default ExchangeContractModel
