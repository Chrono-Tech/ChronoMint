/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const path = require('path')
const fs = require('fs')
const axios = require('axios')

const PUBLIC_REST_URL = 'https://backend.chronobank.io'

let backendHostArg = process.argv.find(e => e.startsWith('--backend='))
const backendHost = backendHostArg ? backendHostArg.substr('--backend='.length) : PUBLIC_REST_URL

const BUILD_FOLDER = path.resolve(__dirname, '../build')

const doLoad = async () => {

  const importUrl = `${backendHost}/api/v1/mintTranslations`
  const i18nPublic = await axios.get(importUrl)
  if (!i18nPublic) {
    return
  }

  const fileName = BUILD_FOLDER + '/i18nJson.js'

  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER)
  }
  fs.writeFileSync(fileName, 'var i18nJson = ' + JSON.stringify(i18nPublic.data))
}

doLoad()
