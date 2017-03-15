import reducer, {createLocAction, updateLocAction, removeLocAction} from '../../../../src/redux/ducks/locs/reducer';

let address = '0x100500';
let state = reducer(undefined, {});

it('create empty state', () => {
    expect(state.toObject()).toEqual({});
});

it('Add new LOC with default fields', () => {
    let action = createLocAction({address});
    state = reducer(state, action);
    expect(state.get(address).get('address')).toEqual(address);
});

it('Change name of the LOC', () => {
    let valueName = 'locName';
    let value = 'test name';
    let action = updateLocAction({valueName, value, address});
    state = reducer(state, action);
    expect(state.get(address).get('locName')).toEqual(value);
});

it('Remove LOC. State should be empty', () => {
    let action = removeLocAction({address});
    state = reducer(state, action);
    expect(state.toObject()).toEqual({});
});
