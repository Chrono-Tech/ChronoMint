import RewardsDAO from '../../../dao/RewardsDAO';
import {
    loadRewardsData,
    loadRewardsDataSuccess,
    loadPeriodDataSuccess,
} from './reducer';

export const getRewardsData = (address) => (dispatch) => {
    dispatch(loadRewardsData());

    Promise.all([
        RewardsDAO.getAddress(),
        RewardsDAO.getPeriodLength(),
        RewardsDAO.getLastPeriod(),
        RewardsDAO.getLastClosedPeriod(),
        RewardsDAO.getAccountDepositBalance(address),
        RewardsDAO.getTotalDepositBalance(address)
    ]).then(values => {
        dispatch(loadRewardsDataSuccess({
            address: values[0],
            periodLength: values[1],
            lastPeriod:  values[2],
            lastClosedPeriod: values[3],
            accountDeposit: values[4],
            totalDeposit: values[5]
        }));
    });
};

export const getPeriodData = (address, periodId) => (dispatch) => {
    Promise.all([
        RewardsDAO.getTotalDepositInPeriod(periodId),
        RewardsDAO.getDepositBalanceInPeriod(address, periodId),
        //todo RewardsDAO.getPeriodStartDate(periodId),
        //RewardsDAO.getPeriodClosedState(periodId),
    ]).then(values => {
        dispatch(loadPeriodDataSuccess({
            id: periodId,
            totalDeposit: values[0],
            currentUserDeposit: values[1],
            startDate: values[2]
            //isClosed: values[2],
        }))
    });
};