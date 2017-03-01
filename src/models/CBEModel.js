import React from 'react';
import {abstractContractModel, validate as superValidate} from './ContractModel';
import UserModel from './UserModel';

class CBEModel extends abstractContractModel({
    user: null
}) {
    constructor(data = {}) {
        super({
            ...data,
            user: data.user instanceof UserModel ? data.user : new UserModel(data.user)
        });
    }

    name() {
        return this.get('name') ? this.get('name') : <i>Unknown</i>;
    }

    /** @return {UserModel} */
    user() {
        return this.get('user');
    }
}

export const validate = values => {
    return superValidate(values);
};

export default CBEModel;