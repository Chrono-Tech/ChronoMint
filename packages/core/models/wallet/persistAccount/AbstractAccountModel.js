import { Record as record } from 'immutable'

export const abstractModel = (defaultValues) => class AbstractAccountModel extends record({
  ...defaultValues,
}){}

export default abstractModel()
