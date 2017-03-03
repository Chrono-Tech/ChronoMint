import reducer, {
    createPendingAction,
    updatePendingAction,
    removePendingAction
} from '../../../../src/redux/ducks/pendings/reducer';

let operation = '0x100500';
let state = reducer(undefined, {});

it('create empty state', () => {
    expect(state.toObject()).toEqual({});
});

it('Add new Pending with default fields', () => {
    let action = createPendingAction({operation});
    state = reducer(state, action);
    expect(state.get(operation).get('operation')).toEqual(operation);
});

it('Change data of the Pending', () => {
    let valueName = 'data';
    let value = '0x8297b11aXXXXXtest data';
    let action = updatePendingAction({valueName, value, operation});
    state = reducer(state, action);
    expect(state.get(operation).functionName()).toEqual('removeLOC');
});

it('Remove Pending. State should be empty', () => {
    let action = removePendingAction({operation});
    state = reducer(state, action);
    expect(state.toObject()).toEqual({});
});
