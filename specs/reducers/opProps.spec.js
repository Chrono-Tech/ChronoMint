import BigNumber from 'bignumber.js';
import reducer, {
    updatePropsAction,
} from '../../src/redux/ducks/pendings/operationsProps/reducer';

let state = reducer(undefined, {});

it('should be initial state', () => {
    expect(state.get('signaturesRequired')).toEqual(new BigNumber(0));
});

it('Change field of the props, uses getter', () => {
    let valueName = 'signaturesRequired';
    let number = 74;
    let value = new BigNumber(number);
    let action = updatePropsAction({valueName, value});
    state = reducer(state, action);
    expect(state.signaturesRequired()).toEqual(number);
});
