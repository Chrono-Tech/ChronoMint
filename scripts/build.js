process.env.NODE_ENV = 'production'

var path = require('path')
var rimrafSync = require('rimraf').sync
var webpack = require('webpack')
var config = require('../config/webpack.config.prod')

var isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) ===
  'node_modules'
var relative = isInNodeModules ? '../..' : '.'
rimrafSync(relative + '/build_front')

webpack(config).run(function (err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:')
    console.error(err.message || err)
    process.exit(1)
  }

  var openCommand = process.platform === 'win32' ? 'start' : 'open'
  console.log('Successfully generated a bundle in the build folder!')
  console.log()
  console.log('You can now serve it with any static server, for example:')
  console.log('  cd build')
  console.log('  npm install -g http-server')
  console.log('  hs')
  console.log('  ' + openCommand + ' http://localhost:8080')
  console.log()
  console.log('The bundle is optimized and ready to be deployed to production.')
})
