import { abstractFetchingModel } from '../AbstractFetchingModel'

export const abstractPeriodModel = (defaultValues) => class AbstractPeriodModel extends abstractFetchingModel({

  ...defaultValues,
}) {

}

export default abstractPeriodModel()
