import reducer, {
    createCompletedOperationAction,
    updateCompletedOperationAction
} from '../../../../src/redux/ducks/completedOperations/reducer';

let operation = '0x100500';
let state = reducer(undefined, {});

it('create empty state', () => {
    expect(state.toObject()).toEqual({});
});

it('Add new Operation with default fields', () => {
    let action = createCompletedOperationAction({operation});
    state = reducer(state, action);
    expect(state.get(operation).get('operation')).toEqual(operation);
});

it('Change data of the Operation', () => {
    let valueName = 'data';
    let value = '0x8297b11aXXXXXtest data';
    let action = updateCompletedOperationAction({valueName, value, operation});
    state = reducer(state, action);
    expect(state.get(operation).functionName()).toEqual('removeLOC');
});
