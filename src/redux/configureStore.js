import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {Map} from 'immutable';
import {browserHistory} from 'react-router';
import {combineReducers} from 'redux-immutable';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';

import {reducer as formReducer} from 'redux-form/immutable';
import {reducer as routerReducer} from './router';
import * as reducers from './ducks';

/* Create enhanced history object for router */
const createSelectLocationState = () => {
    let prevRoutingState, prevRoutingStateJS;
    return (state) => {
        const routingState = state.get('routing'); // or state.routing
        if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
            prevRoutingState = routingState;
            prevRoutingStateJS = routingState.toJS();
        }
        return prevRoutingStateJS;
    };
};

const configureStore = () => {
    const logger = createLogger();
    const initialState = new Map();

    const rootReducer = combineReducers({
        form: formReducer,
        router: routerReducer,
        ...reducers
    });

    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            routerMiddleware,
            thunk,
            logger
        )
    );
};

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: createSelectLocationState()
});

export default {store, history};
