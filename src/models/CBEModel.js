import React from 'react';
import {AbstractContractModel} from './ContractModel';

class CBEModel extends AbstractContractModel() {
    name() {
        return this.get('name') ? this.get('name') : <i>Unknown</i>;
    }
}

export default CBEModel;