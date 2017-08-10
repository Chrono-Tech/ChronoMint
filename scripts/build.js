process.env.NODE_ENV = process.env.NODE_ENV || 'production'

console.log('NODE_ENV:', process.env.NODE_ENV)

const path = require('path')
const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')

var isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
var relative = isInNodeModules ? '../..' : '.'
rimrafSync(relative + '/build_front')

webpack(config).run(function (err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:')
    console.error(err.message || err)
    process.exit(1)
  }

  var openCommand = process.platform === 'win32' ? 'start' : 'open'

  if (process.env.NODE_ENV === 'standalone') {
    console.log(`
    Successfully generated a bundle in the build folder!
    Open 'build/index.html' in your browser.
    `)
  } else {
    console.log(`
    Successfully generated a bundle in the build folder!
    You can now serve it with any static server, for example:
    
      cd build
      npm install -g http-server
      hs
      ${openCommand} http://localhost:8080'

    The bundle is optimized and ready to be deployed to production.`)
  }
})
