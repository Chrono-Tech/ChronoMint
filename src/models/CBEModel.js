import React from 'react';
import {Record} from 'immutable';

class CBEModel extends Record({
    address: null,
    name: null
}) {
    address() {
        return this.get('address');
    }

    name() {
        return this.get('name') ? this.get('name') : <i>Unknown</i>;
    }
}

export default CBEModel;