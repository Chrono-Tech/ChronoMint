import AppDAO from '../dao/AppDAO';
import {abstractContractModel} from './ContractModel';
import * as validation from '../components/forms/validate';

class TokenContractModel extends abstractContractModel({
    proxy: null,
    symbol: null,
    totalSupply: null
}) {
    proxy() {
        return AppDAO.initProxyDAO(this.get('proxy'));
    };

    proxyAddress() {
        return this.get('proxy');
    };

    symbol() {
        return this.get('symbol');
    };

    totalSupply() {
        return this.get('totalSupply');
    };
}

export const validate = values => {
    const errors = {};
    errors.address = validation.address(values.get('address'));
    return errors;
};

export default TokenContractModel;