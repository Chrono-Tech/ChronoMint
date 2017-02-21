import React from 'react';
import AppDAO from '../dao/AppDAO';
import {abstractContractModel} from './ContractModel';

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

export default TokenContractModel;