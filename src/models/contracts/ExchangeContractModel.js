import React from 'react';
import {abstractOtherContractModel} from './AbstractOtherContractModel';
import ExchangeForm from '../../components/forms/settings/other/ExchangeForm';
import * as validation from '../../components/forms/validate';

class ExchangeContractModel extends abstractOtherContractModel({
    settings: {
        buyPrice: null,
        sellPrice: null
    }
}) {
    name() {
        return 'Exchange';
    }

    buyPrice() {
        return parseInt(this.get('settings').buyPrice, 10);
    }

    sellPrice() {
        return parseInt(this.get('settings').sellPrice, 10);
    }

    form(ref, onSubmit) {
        return <ExchangeForm ref={ref} onSubmit={onSubmit}/>;
    }
}

export const validate = values => {
    const errors = {};
    errors.buyPrice = validation.positiveInt(values.get('buyPrice'));
    errors.sellPrice = validation.positiveInt(values.get('sellPrice'));
    return errors;
};

export default ExchangeContractModel;