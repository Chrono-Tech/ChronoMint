/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// eslint-disable-next-line
console.log('NODE_ENV:', process.env.NODE_ENV)

const path = require('path')
const fs = require('fs')
const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const config = require('../config/webpack.new.prod')

const isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
const relative = isInNodeModules ? '../..' : '.'
rimrafSync(relative + '/build_front')

const buildPath = path.join(__dirname, isInNodeModules ? '../../..' : '..', 'build')

webpack(config).run(function (err, stats) {
  if (err) {
    // eslint-disable-next-line
    console.error('Failed to create a production build. Reason:')
    // eslint-disable-next-line
    console.error(err.message || err)
    process.exit(1)
  }

  fs.writeFileSync(buildPath + '/i18nJson.js', 'var i18nJson = {}')

  if (process.env.NODE_ENV === 'standalone') {
    // eslint-disable-next-line
    console.log(`
    Successfully generated a bundle in the build folder!
    Open 'build/index.html' in your browser.
    `)
  } else {
    // eslint-disable-next-line
    console.log(`
    Successfully generated a bundle in the build folder!
    You can now serve it with any static server, for example:
    
      yarn hs

    The bundle is optimized and ready to be deployed to production.`)
  }
})
