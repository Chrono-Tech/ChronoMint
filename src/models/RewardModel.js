import {Map, Record as record} from 'immutable';

class RewardModel extends record({
    address: null,
    periodLength: null,
    lastPeriod: null,
    lastClosedPeriod: null,
    accountDeposit: null,
    totalDeposit: null,
    periods: new Map()

}) {
    getPeriodLength() {
        return this.get('periodLength').toNumber();
    }
    lastPeriodIndex() {
        return this.get('lastPeriod').toNumber() + 1;
    }
    lastClosedPeriodIndex() {
        return this.get('lastClosedPeriod') && this.get('lastClosedPeriod').toNumber() + 1;
    }
    getAccountDeposit() {
        return this.get('accountDeposit').toNumber() / 100;
    }
    getTotalDeposit() {
        return this.get('totalDeposit').toNumber() / 100;
    }
}

export default RewardModel;