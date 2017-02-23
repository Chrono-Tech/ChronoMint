import React from 'react';
import {Record as record} from 'immutable';
import {dateFormatOptions} from '../../config';

//noinspection JSUnusedLocalSymbols
const abstractNoticeModel = defaultValues => class NoticeModel extends record({
    message: '',
    time: Date.now(),
    ...defaultValues
}) {
    message() {
        return this.get('message');
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
};

export {
    abstractNoticeModel
}

export default abstractNoticeModel();