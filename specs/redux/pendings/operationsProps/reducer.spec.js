import reducer, {
  updatePropsAction
} from '../../../../src/redux/pendings/operationsProps/reducer'

let state = reducer(undefined, {})

it('should be initial state', () => {
  expect(state.get('signaturesRequired')).toEqual(0)
})

it('Change field of the props, uses getter', () => {
  let valueName = 'signaturesRequired'
  let value = 74
  let action = updatePropsAction({valueName, value})
  state = reducer(state, action)
  expect(state.signaturesRequired()).toEqual(value)
})
