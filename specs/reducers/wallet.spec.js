import reducer, {
    setTimeBalanceStart,
    setTimeBalanceSuccess,
} from '../../src/redux/ducks/wallet/reducer';

let state = reducer(undefined, {});

it('should be initial state: isFetching==true, balance==null', () => {
    expect(state.time.isFetching).toEqual(true);
    expect(state.time.balance).toEqual(null);
});

it('Start setting balance. isFetching should be True', () => {
    const action = setTimeBalanceStart();
    const prevBalance = state.time.balance;
    state = reducer(state, action);
    expect(state.time.isFetching).toEqual(true);
    expect(state.time.balance).toEqual(prevBalance);
});

it('Finish set balance. isFetching should be False, balance changed.', () => {
    const balance = 100500;
    const action = setTimeBalanceSuccess( balance );
    state = reducer(state, action);
    expect(state.time.isFetching).toEqual(false);
    expect(state.time.balance).toEqual(balance);
});
