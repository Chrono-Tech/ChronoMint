import RewardsDAO from '../../dao/RewardsDAO';
import TimeHolderDAO from '../../dao/TimeHolderDAO';
import RewardModel from '../../models/RewardModel';
import PeriodModel from '../../models/PeriodModel';

export const REWARDS_LOAD_START = 'rewards/LOAD_START';
export const REWARDS_LOAD_SUCCESS = 'rewards/LOAD_SUCCESS';
export const PERIOD_LOAD_SUCCESS = 'rewards/PERIOD_LOAD_SUCCESS';

const initialState = {
    reward: new RewardModel(),
    isFetching: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REWARDS_LOAD_START:
            return {
                isFetching: true
            };
        case REWARDS_LOAD_SUCCESS:
            return {
                reward: new RewardModel(action.payload),
                isFetching: false
            };
        case PERIOD_LOAD_SUCCESS:
            return {
                reward: state.reward.setIn(['periods', action.payload.id.toNumber()], new PeriodModel(action.payload))
            };
        default:
            return state;
    }
};

const loadRewardsData = () => ({type: REWARDS_LOAD_START});
const loadRewardsDataSuccess = (payload) => ({type: REWARDS_LOAD_SUCCESS, payload});
const loadPeriodDataSuccess = (payload) => ({type: PERIOD_LOAD_SUCCESS, payload});

const getRewardsData = account => dispatch => {
    dispatch(loadRewardsData());
    Promise.all([
        RewardsDAO.getAddress(),
        RewardsDAO.getPeriodLength(),
        RewardsDAO.getLastPeriod(),
        RewardsDAO.getLastClosedPeriod(),
        TimeHolderDAO.getAccountDepositBalance(account),
        RewardsDAO.getTotalDepositBalance(account)
    ]).then(values => {
        dispatch(loadRewardsDataSuccess({
            address: values[0],
            periodLength: values[1],
            lastPeriod: values[2],
            lastClosedPeriod: values[3],
            accountDeposit: values[4],
            totalDeposit: values[5]
        }));
    });
};

const getPeriodData = (address, periodId) => dispatch => {
    Promise.all([
        RewardsDAO.getTotalDepositInPeriod(periodId),
        RewardsDAO.getDepositBalanceInPeriod(address, periodId),
        RewardsDAO.getPeriodClosedState(periodId),
        //todo RewardsDAO.getPeriodStartDate(periodId)
    ]).then(values => {
        dispatch(loadPeriodDataSuccess({
            id: periodId,
            totalDeposit: values[0],
            currentUserDeposit: values[1],
            isClosed: values[2],
            //startDate: values[3]
        }))
    });
};

export {
    loadRewardsData,
    loadRewardsDataSuccess,
    loadPeriodDataSuccess,
    getRewardsData,
    getPeriodData
}

export default reducer;