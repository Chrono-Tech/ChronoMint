import React from 'react';
import {abstractContractModel, validate as superValidate} from './ContractModel';

class CBEModel extends abstractContractModel() {
    name() {
        return this.get('name') ? this.get('name') : <i>Unknown</i>;
    }
}

export const validate = values => {
    return superValidate(values);
};

export default CBEModel;