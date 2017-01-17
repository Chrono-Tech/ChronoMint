import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {Map} from 'immutable';
import {combineReducers} from 'redux-immutable';

import {reducer as formReducer} from 'redux-form/immutable';
import * as reducers from './ducks';

const configureStore = () => {
    const logger = createLogger();
    const initialState = new Map();

    const rootReducer = combineReducers({
        form: formReducer,
        ...reducers
    });

    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            thunk,
            logger
        )
    );
};

export default configureStore;
