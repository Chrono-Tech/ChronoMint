import RewardModel from '../../../models/RewardModel';
import PeriodModel from '../../../models/PeriodModel';

export const REWARDS_LOAD_START = 'rewards/LOAD_START';
export const REWARDS_LOAD_SUCCESS = 'rewards/LOAD_SUCCESS';
export const PERIOD_LOAD_SUCCESS = 'rewards/PERIOD_LOAD_SUCCESS';

export const loadRewardsData = () => ({type: REWARDS_LOAD_START});
export const loadRewardsDataSuccess = (payload) => ({type: REWARDS_LOAD_SUCCESS, payload});
export const loadPeriodDataSuccess = (payload) => ({type: PERIOD_LOAD_SUCCESS, payload});

const initialState = new RewardModel();

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case REWARDS_LOAD_SUCCESS:
            return new RewardModel(action.payload);
        case PERIOD_LOAD_SUCCESS:
            return state.setIn(['periods', action.payload.id.toNumber()], new PeriodModel(action.payload));
        default:
            return state;
    }
};

export default reducer;