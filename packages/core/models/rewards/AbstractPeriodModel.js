/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from '../AbstractFetchingModel'

export const abstractPeriodModel = (defaultValues) => class AbstractPeriodModel extends abstractFetchingModel({

  ...defaultValues,
}) {

}

export default abstractPeriodModel()
