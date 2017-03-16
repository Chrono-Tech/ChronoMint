import reducer, {createLOCAction, updateLOCAction, removeLOCAction} from '../../../../src/redux/ducks/locs/reducer';
import LOCModel from '../../../../src/models/LOCModel';

let address = '0x100500';
let state = reducer(undefined, {});

it('create empty state', () => {
    expect(state.toObject()).toEqual({});
});

it('Add new LOC with default fields', () => {
    let action = createLOCAction(new LOCModel({address}));
    state = reducer(state, action);
    expect(state.get(address).get('address')).toEqual(address);
});

it('Change name of the LOC', () => {
    let valueName = 'locName';
    let value = 'test name';
    let action = updateLOCAction({valueName, value, address});
    state = reducer(state, action);
    expect(state.get(address).get('locName')).toEqual(value);
});

it('Remove LOC. State should be empty', () => {
    let action = removeLOCAction({address});
    state = reducer(state, action);
    expect(state.toObject()).toEqual({});
});
