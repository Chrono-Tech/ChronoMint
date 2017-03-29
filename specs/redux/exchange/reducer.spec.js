import reducer, {setRatesStart, setRatesSuccess} from '../../../src/redux/exchange/reducer';
import communicationsReducer from '../../../src/redux/exchange/communication';

let state = reducer(undefined, {});
let communicationsState = communicationsReducer(undefined, {});

it('should have initial state', () => {
    expect(state.toObject()).toEqual({});
    expect(communicationsState.isFetching).toEqual(false);
});

it('Start set rates. isFetching should be True', () => {
    let action = setRatesStart();
    communicationsState = communicationsReducer(communicationsState, action);
    expect(communicationsState.isFetching).toEqual(true);
});

const title = 'Test title';
const buyPrice = 330;
const sellPrice = 758;
const action = setRatesSuccess({title, buyPrice, sellPrice});

it('Load exchange rates, get sell price using getter', () => {
    state = reducer(state, action);
    expect(state.get(title).printSellPrice()).toEqual(sellPrice * 100);
});

it('Finish set rates. isFetching should be False', () => {
    communicationsState = communicationsReducer(communicationsState, action);
    expect(communicationsState.isFetching).toEqual(false);
});
