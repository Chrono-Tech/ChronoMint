/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

const baseURL = 'https://explorer.bitcoingold.org/insight-api'
const timeout = 10000 // 10 seconds

export default axios.create({
  baseURL,
  timeout,
})
