import React from 'react';
import {Record as record} from 'immutable';
import {dateFormatOptions} from '../../config';

//noinspection JSUnusedLocalSymbols
const abstractNoticeModel = defaultValues => class AbstractNoticeModel extends record({
    time: Date.now(),
    ...defaultValues
}) {
    constructor(data) {
        if (new.target === AbstractNoticeModel) {
            throw new TypeError('Cannot construct AbstractNoticeModel instance directly');
        }
        super(data);
    }

    message() {
        throw new Error('should be overridden');
    };

    date() {
        let date = new Date(this.get('time'));
        return date.toLocaleDateString(undefined, dateFormatOptions) + ' ' + date.toTimeString().substr(0,5);
    };

    historyBlock() {
        return (
            <span>
                {this.message()}
                <small style={{display: 'block', marginTop: '-25px'}}>{this.date()}</small>
            </span>
        );
    }

    fullHistoryBlock() {
        return (
            <div>
                {this.message()}
                <p style={{marginBottom: '0'}}><small>{this.date()}</small></p>
            </div>
        );
    }
};

export {
    abstractNoticeModel
}

export default abstractNoticeModel();