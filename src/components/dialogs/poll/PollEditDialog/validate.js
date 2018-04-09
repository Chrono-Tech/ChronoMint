/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import BigNumber from 'bignumber.js'
import * as validator from 'models/validator'

export default function validate (values, props) {
  let voteLimitInTIME = values.get('voteLimitInTIME')
  if (voteLimitInTIME instanceof BigNumber) {
    voteLimitInTIME = voteLimitInTIME.toNumber()
  }
  const deadline = values.get('deadline')
  const options = values.get('options')
  const filesCollection = values.get('files')
  return {
    title: ErrorList.toTranslate(validator.required(values.get('title'))),
    voteLimitInTIME: new ErrorList()
      .add(validator.required(voteLimitInTIME))
      .add(validator.lowerThan(voteLimitInTIME || 0, props.timeToken.removeDecimals(props.maxVoteLimitInTIME).toNumber()))
      .getErrors(),
    deadline: new ErrorList()
      .add(validator.required(deadline))
      .getErrors(),
    files: ErrorList.toTranslate(validator.validIpfsFileList(filesCollection && filesCollection.hash())),
    options: new ErrorList()
      .add(validator.required(options))
      .add(validator.moreThan(options && options.size, 1, false))
      .getErrors(),
  }
}
