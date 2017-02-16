import {Record} from 'immutable';
import {dateFormatOptions} from '../../config';

/**
 * Base notice model for extending.
 */
class NoticeModel extends Record({
    message: null,
    time: Date.now()
}) {
    message() {
        return this.get('message');
    };

    date() {
        let date = new Date(this.get('time'));
        return date.toLocaleDateString(undefined, dateFormatOptions);
    };
}

export default NoticeModel;