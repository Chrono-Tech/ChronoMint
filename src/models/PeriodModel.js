import {Record as record} from 'immutable';
import moment from 'moment';

class PeriodModel extends record({
    id: null,
    totalDeposit: null,
    currentUserDeposit: null,
    isClosed: false,
    startDate: null
}) {
    getId() {
        return this.id.toNumber() + 1;
    }
    getTotalDeposit() {
        return this.totalDeposit.toNumber() / 100;
    }
    getCurrentUserDeposit() {
        return this.currentUserDeposit.toNumber() / 100;
    }
    getStartDate() {
        return this.startDate?moment.unix(this.startDate.toNumber()).format('Do MMMM YYYY'):'';
    }
    getEndDate(periodLength: number) {
        return this.startDate?moment.unix(this.startDate.toNumber()).add(periodLength, 'days').format('Do MMMM YYYY'):'';
    }
    getDaysPassed() {
        return this.startDate?moment().diff(moment.unix(this.startDate.toNumber()), 'days'):'';
    }
}

export default PeriodModel;