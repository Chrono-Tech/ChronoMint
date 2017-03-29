import reducer, {createLOCAction, updateLOCAction, removeLOCAction, createAllLOCsAction} from '../../../src/redux/locs/reducer';
import LOCModel from '../../../src/models/LOCModel';

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

it('State should not be changed', () => {
    let action = {type: 'SOME_TYPE'};
    expect(reducer(state, action)).toEqual(state);
});

it('Remove LOC. State should be empty', () => {
    let action = removeLOCAction({address});
    state = reducer(state, action);
    expect(state.toObject()).toEqual({});
});

it('Set state Completely', () => {
    let action = createAllLOCsAction({x:1});
    state = reducer(state, action);
    expect(state).toEqual({x:1});
});
