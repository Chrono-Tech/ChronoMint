/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'

export default {
  default: {
    client: axios.create({
      baseURL: 'http://localhost:8080/api',
      responseType: 'json'
    })
  },
  googleMaps: {
    client: axios.create({
      baseURL:'https://maps.googleapis.com/maps/api',
      responseType: 'json'
    })
  }
}
