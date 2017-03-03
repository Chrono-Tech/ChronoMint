import React from 'react';
import {abstractContractModel} from './ContractModel';

class CBEModel extends abstractContractModel() {
    name() {
        return this.get('name') ? this.get('name') : <i>Unknown</i>;
    }
}

export default CBEModel;